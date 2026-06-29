
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
    logger.info(`Polling Google Drive folder: ${folderId}`);
    const res = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed=false and mimeType contains 'video/'`,
      fields: 'files(id, name, mimeType, webContentLink)',
      pageSize: 50
    });
    return res.data.files || [];
  }

  public async downloadFile(fileId: string, destPath: string): Promise<void> {
    logger.info(`Downloading Drive file ${fileId} to ${destPath}`);
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
    logger.info(`Moving Drive file ${fileId} to ${targetFolderId}`);
    await this.drive.files.update({
      fileId: fileId,
      addParents: targetFolderId,
      removeParents: currentFolderId,
      fields: 'id, parents'
    });
  }
}
