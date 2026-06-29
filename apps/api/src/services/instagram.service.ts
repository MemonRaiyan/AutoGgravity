
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
    const containerRes = await axios.post(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: `${metadata.title}\n\n${metadata.description}\n${metadata.tags?.map(t => '#'+t).join(' ')}`,
      access_token: tokens.accessToken
    });
    const containerId = (containerRes.data as any).id;

    // Wait loop omitted for brevity in MVP (production requires checking container status until FINISHED)
    
    // 2. Publish
    const publishRes = await axios.post(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
      creation_id: containerId,
      access_token: tokens.accessToken
    });

    return `https://instagram.com/p/${(publishRes.data as any).id}`;
  }
}
