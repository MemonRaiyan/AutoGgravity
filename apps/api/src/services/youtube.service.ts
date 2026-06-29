
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

    logger.info(`Starting YouTube upload for ${filePath}`);

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

    return `https://youtube.com/watch?v=${res.data.id}`;
  }
}
