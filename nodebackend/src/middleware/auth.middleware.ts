import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';

// Extend the Request interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user: IUser;
}

interface JwtPayload {
  id: string;
}
// In your backend routes (user.routes.ts), you might need to adjust authentication
// For signup flow endpoints, consider making them public or handling auth differently

// Or update your auth middleware to handle signup flow
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    // 🔥 Allow signup flow endpoints to work without token
    const isSignupFlow = req.path.includes('/setup-profile') || req.path.includes('/upload-kyc');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (isSignupFlow) {
        // For signup flow, we might handle authentication differently
        // You can proceed without user context and handle auth in the controller
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

    // Add user to request object using type assertion
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