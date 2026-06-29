
export interface UploadMetadata {
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: 'public' | 'private' | 'unlisted';
}

export interface IUploadAdapter {
  uploadVideo(filePath: string, metadata: UploadMetadata, tokens: any): Promise<string>;
}
