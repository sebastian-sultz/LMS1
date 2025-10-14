import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';

// Export the interface so routes can import and use it for typing
export interface AuthenticatedRequest extends Request {
  user: IUser;
}

interface JwtPayload {
  id: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    const isSignupFlow = req.path.includes('/setup-profile') || req.path.includes('/upload-kyc');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (isSignupFlow) {
        next();
        return;
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Access denied. No token provided.' 
        });
        return;
      }
    }

    const token = authHeader.replace('Bearer ', '');
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({ 
        success: false, 
        message: 'JWT secret not configured.' 
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Token is invalid.' 
      });
      return;
    }

    // Cast req to AuthenticatedRequest
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token is invalid.' 
    });
  }
};

export const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { id: userId }, 
    jwtSecret, 
    { expiresIn: jwtExpiresIn || '7d' }
  );
};