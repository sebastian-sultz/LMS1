import { Request, Response } from 'express';
import User, { IUser } from '../models/User.model';

// Local interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user: IUser;
}

export const setupProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, dob, address, city, state } = req.body;
    
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = authenticatedReq.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if email is already used by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
      return;
    }

    // Update user profile
    user.profile = {
      fullName,
      email,
      dob: new Date(dob),
      address,
      city,
      state
    };
    user.email = email;
    user.isProfileSetup = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile setup successfully',
      data: {
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          isProfileSetup: user.isProfileSetup,
          isKycDone: user.isKycDone,
          profile: user.profile
        }
      }
    });
  } catch (error: any) {
    console.error('Profile setup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const uploadKyc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { docType, fileUrl } = req.body;
    
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = authenticatedReq.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (!user.isProfileSetup) {
      res.status(400).json({
        success: false,
        message: 'Please complete profile setup first'
      });
      return;
    }

    // Add KYC document
    user.kycDocuments.push({
      docType,
      fileUrl,
      uploadedAt: new Date()
    });

    // Mark KYC as done if required documents are uploaded
    user.isKycDone = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'KYC document uploaded successfully',
      data: {
        user: {
          id: user._id,
          isKycDone: user.isKycDone,
          kycDocuments: user.kycDocuments
        }
      }
    });
  } catch (error: any) {
    console.error('KYC upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = authenticatedReq.user._id;
    const user = await User.findById(userId).select('-otp -otpExpiry');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          isProfileSetup: user.isProfileSetup,
          isKycDone: user.isKycDone,
          profile: user.profile,
          kycDocuments: user.kycDocuments,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};