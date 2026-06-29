import { Request, Response } from 'express';

export class SettingsController {
  public getSettings = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      theme: 'dark',
      notificationsEnabled: true
    });
  };

  public getAISettings = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      provider: 'OpenRouter',
      model: 'gpt-4o-mini',
      temperature: 0.7
    });
  };
}
