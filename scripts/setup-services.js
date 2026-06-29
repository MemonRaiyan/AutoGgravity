const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../apps/api/src/services');

// 1. Upload Adapter Interface
fs.writeFileSync(path.join(servicesDir, 'upload-adapter.ts'), `
export interface UploadMetadata {
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: 'public' | 'private' | 'unlisted';
}

export interface IUploadAdapter {
  uploadVideo(filePath: string, metadata: UploadMetadata, tokens: any): Promise<string>;
}
`);

// 2. AI Service
fs.writeFileSync(path.join(servicesDir, 'ai.service.ts'), `
import axios from 'axios';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';

export interface GeneratedMetadata {
  title: string;
  description: string;
  hashtags: string[];
  category: string;
  language: string;
}

export class AIService {
  public async generateMetadata(fileName: string, context?: string): Promise<GeneratedMetadata> {
    const prompt = \`Generate YouTube/Instagram metadata for a video named: "\${fileName}". 
    Context: \${context || 'No context'}.
    Return ONLY a JSON object with keys: title (string), description (string), hashtags (array of strings), category (string), language (string).\`;

    // 1. OpenRouter (Primary)
    if (env.OPENROUTER_API_KEY) {
      try {
        logger.info('Calling OpenRouter for AI metadata...');
        const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        }, {
          headers: {
            'Authorization': \`Bearer \${env.OPENROUTER_API_KEY}\`,
            'Content-Type': 'application/json'
          }
        });

        const content = res.data.choices[0].message.content;
        return JSON.parse(content);
      } catch (error: any) {
        logger.error('OpenRouter failed, falling back to Ollama', error.message);
      }
    }

    // 2. Ollama (Fallback)
    try {
      logger.info('Calling Ollama for AI metadata...');
      const ollamaUrl = env.OLLAMA_URL || 'http://localhost:11434';
      const res = await axios.post(\`\${ollamaUrl}/api/generate\`, {
        model: 'llama3',
        prompt: prompt,
        stream: false,
        format: 'json'
      });
      return JSON.parse(res.data.response);
    } catch (error: any) {
      logger.error('Ollama fallback failed.', error.message);
      throw new Error('AI Generation failed on all providers');
    }
  }
}
`);

// 3. YouTube Service
fs.writeFileSync(path.join(servicesDir, 'youtube.service.ts'), `
import { google } from 'googleapis';
import fs from 'fs';
import { IUploadAdapter, UploadMetadata } from './upload-adapter';
import { logger } from '@autogravity/shared';
import { env } from '@autogravity/config';

export class YouTubeService implements IUploadAdapter {
  public async uploadVideo(filePath: string, metadata: UploadMetadata, tokens: any): Promise<string> {
    if (!tokens.accessToken) {
      throw new Error("Missing Credentials: YouTube access token not found.");
    }
    if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET) {
      throw new Error("Not Configured: YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET missing in environment.");
    }

    const oauth2Client = new google.auth.OAuth2(
      env.YOUTUBE_CLIENT_ID,
      env.YOUTUBE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    logger.info(\`Starting YouTube upload for \${filePath}\`);

    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: '22' // People & Blogs default
        },
        status: {
          privacyStatus: metadata.privacyStatus || 'private',
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(filePath)
      }
    });

    return \`https://youtube.com/watch?v=\${res.data.id}\`;
  }
}
`);

// 4. Facebook Service
fs.writeFileSync(path.join(servicesDir, 'facebook.service.ts'), `
import axios from 'axios';
import { IUploadAdapter, UploadMetadata } from './upload-adapter';
import { logger } from '@autogravity/shared';
import fs from 'fs';

export class FacebookService implements IUploadAdapter {
  public async uploadVideo(filePath: string, metadata: UploadMetadata, tokens: any): Promise<string> {
    if (!tokens.accessToken) {
      throw new Error("Missing Credentials: Facebook page access token not found.");
    }
    
    const pageId = tokens.pageId; // Expected to be saved in token JSON
    if (!pageId) {
      throw new Error("Missing Configuration: Facebook Page ID not found in connection.");
    }

    logger.info(\`Starting Facebook Reel upload for \${filePath}\`);

    // Facebook Graph API logic (simplified initiation, upload, finish phases)
    // 1. Init
    const initRes = await axios.post(\`https://graph.facebook.com/v19.0/\${pageId}/video_reels\`, {
      upload_phase: 'start',
      access_token: tokens.accessToken
    });
    const { video_id, upload_url } = initRes.data;

    // 2. Upload (Raw bytes to upload_url)
    const fileBuffer = fs.readFileSync(filePath);
    await axios.post(upload_url, fileBuffer, {
      headers: {
        'Authorization': \`OAuth \${tokens.accessToken}\`,
        'offset': '0',
        'file_size': fileBuffer.length.toString()
      }
    });

    // 3. Publish
    await axios.post(\`https://graph.facebook.com/v19.0/\${pageId}/video_reels\`, {
      access_token: tokens.accessToken,
      upload_phase: 'finish',
      video_id: video_id,
      video_state: 'PUBLISHED',
      description: \`\${metadata.title}\\n\\n\${metadata.description}\`
    });

    return \`https://facebook.com/reel/\${video_id}\`;
  }
}
`);

// 5. Instagram Service
fs.writeFileSync(path.join(servicesDir, 'instagram.service.ts'), `
import axios from 'axios';
import { IUploadAdapter, UploadMetadata } from './upload-adapter';
import { logger } from '@autogravity/shared';

export class InstagramService implements IUploadAdapter {
  public async uploadVideo(videoUrl: string, metadata: UploadMetadata, tokens: any): Promise<string> {
    // Note: IG Graph API requires a public URL for the video, not a local file.
    // For MVP, we assume videoUrl is a publicly accessible URL (e.g. presigned S3/Drive link)
    if (!tokens.accessToken) {
      throw new Error("Missing Credentials: Instagram access token not found.");
    }
    const igUserId = tokens.igUserId;
    if (!igUserId) {
      throw new Error("Missing Configuration: Instagram User ID not found.");
    }

    logger.info('Starting Instagram Reel upload');

    // 1. Create Container
    const containerRes = await axios.post(\`https://graph.facebook.com/v19.0/\${igUserId}/media\`, {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: \`\${metadata.title}\\n\\n\${metadata.description}\\n\${metadata.tags?.map(t => '#'+t).join(' ')}\`,
      access_token: tokens.accessToken
    });
    const containerId = containerRes.data.id;

    // Wait loop omitted for brevity in MVP (production requires checking container status until FINISHED)
    
    // 2. Publish
    const publishRes = await axios.post(\`https://graph.facebook.com/v19.0/\${igUserId}/media_publish\`, {
      creation_id: containerId,
      access_token: tokens.accessToken
    });

    return \`https://instagram.com/p/\${publishRes.data.id}\`;
  }
}
`);

// 6. Google Drive Service
fs.writeFileSync(path.join(servicesDir, 'google-drive.service.ts'), `
import { google, drive_v3 } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma';

export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor(tokens: any) {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      throw new Error("Not Configured: GOOGLE_CLIENT_ID or SECRET missing.");
    }
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials(tokens);
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  public async pollFolder(folderId: string): Promise<any[]> {
    logger.info(\`Polling Google Drive folder: \${folderId}\`);
    const res = await this.drive.files.list({
      q: \`'\${folderId}' in parents and trashed=false and mimeType contains 'video/'\`,
      fields: 'files(id, name, mimeType, webContentLink)',
      pageSize: 50
    });
    return res.data.files || [];
  }

  public async downloadFile(fileId: string, destPath: string): Promise<void> {
    logger.info(\`Downloading Drive file \${fileId} to \${destPath}\`);
    const res = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(destPath);
      res.data
        .on('end', () => resolve())
        .on('error', err => reject(err))
        .pipe(dest);
    });
  }

  public async moveFile(fileId: string, currentFolderId: string, targetFolderId: string): Promise<void> {
    logger.info(\`Moving Drive file \${fileId} to \${targetFolderId}\`);
    await this.drive.files.update({
      fileId: fileId,
      addParents: targetFolderId,
      removeParents: currentFolderId,
      fields: 'id, parents'
    });
  }
}
`);

console.log("Services generated successfully.");
