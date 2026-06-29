
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

    logger.info(`Starting Facebook Reel upload for ${filePath}`);

    // Facebook Graph API logic (simplified initiation, upload, finish phases)
    // 1. Init
    const initRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/video_reels`, {
      upload_phase: 'start',
      access_token: tokens.accessToken
    });
    const { video_id, upload_url } = (initRes.data as any);

    // 2. Upload (Raw bytes to upload_url)
    const fileBuffer = fs.readFileSync(filePath);
    await axios.post(upload_url, fileBuffer, {
      headers: {
        'Authorization': `OAuth ${tokens.accessToken}`,
        'offset': '0',
        'file_size': fileBuffer.length.toString()
      }
    });

    // 3. Publish
    await axios.post(`https://graph.facebook.com/v19.0/${pageId}/video_reels`, {
      access_token: tokens.accessToken,
      upload_phase: 'finish',
      video_id: video_id,
      video_state: 'PUBLISHED',
      description: `${metadata.title}\n\n${metadata.description}`
    });

    return `https://facebook.com/reel/${video_id}`;
  }
}
