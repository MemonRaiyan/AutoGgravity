import { Request, Response } from 'express';
// import { prisma } from '../config/prisma';

export class ChannelController {
  public getChannels = async (req: Request, res: Response): Promise<void> => {
    // Mock for MVP without breaking compilation
    res.status(200).json([]);
  };
}
