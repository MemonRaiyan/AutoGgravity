import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response): Promise<void> => {
    // Placeholder login - would validate against DB User
    const { email, password } = req.body;
    
    if (email === 'admin@autogravity.ai' && password === 'admin') {
      const tokens = await this.authService.generateTokens('1', 'ADMIN');
      res.status(200).json(tokens);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };
}
