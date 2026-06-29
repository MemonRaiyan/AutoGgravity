import { Request, Response } from 'express';
// import { prisma } from '../config/prisma';

export class VideoController {
  public getVideos = async (req: Request, res: Response): Promise<void> => {
    try {
      // For MVP, return empty array if prisma isn't fully linked
      // const videos = await prisma.uploadHistory.findMany();
      res.status(200).json([]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
