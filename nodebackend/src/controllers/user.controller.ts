// controllers/user.controller.ts - Updated redirect
import { Request, Response } from 'express';
import User, { IUser } from '../models/User.model';

// Extend the Request interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user: IUser;
}

export const setupProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Type assertion to access user property
    const authReq = req as AuthenticatedRequest;
    
    console.log('🔍 Setting up profile for user:', authReq.user?._id);
    console.log('📨 Request body:', req.body);

    const { fullName, email, dob, address, city, state } = req.body;
    
    if (!authReq.user) {
      console.log('❌ No user in request');
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = authReq.user._id;
    const user = await User.findById(userId);

    if (!user) {
      console.log('❌ User not found in database');
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Validate required fields
    if (!fullName || fullName.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Full name is required'
      });
      return;
    }

    if (!email || email.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    // Check if email is already used by another user
    const existingUser = await User.findOne({ 
      email: email.trim().toLowerCase(), 
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
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      dob: new Date(dob),
      address: address.trim(),
      city: city.trim(),
      state: state.trim()
    };
    user.email = email.trim().toLowerCase();
    user.isProfileSetup = true;

    console.log('💾 Saving user profile:', user.profile);
    
    await user.save();

    console.log('✅ Profile setup successful for user:', userId);

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
        },
        redirectTo: user.isKycDone ? '/login' : '/kyc'
      }
    });
  } catch (error: any) {
    console.error('❌ Profile setup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const uploadKyc = async (req: Request, res: Response): Promise<void> => {
  try {
    // Type assertion to access user property
    const authReq = req as AuthenticatedRequest;
    
    console.log('🔍 Uploading KYC for user:', authReq.user?._id);
    console.log('📨 KYC Request body:', req.body);

    const { docType, fileUrl } = req.body;
    
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = authReq.user._id;
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

    // Validate required fields
    if (!docType || !fileUrl) {
      res.status(400).json({
        success: false,
        message: 'Document type and file URL are required'
      });
      return;
    }

    // Add KYC document
    const kycDocument = {
      docType,
      fileUrl,
      uploadedAt: new Date()
    };

    user.kycDocuments.push(kycDocument);
    
    // Mark KYC as done
    user.isKycDone = true;

    console.log('💾 Saving KYC document:', kycDocument);
    
    await user.save();

    console.log('✅ KYC upload successful for user:', userId);

    res.status(200).json({
      success: true,
      message: 'KYC document uploaded successfully',
      data: {
        user: {
          id: user._id,
          isKycDone: user.isKycDone,
          kycDocuments: user.kycDocuments
        },
        redirectTo: '/login'
      }
    });
  } catch (error: any) {
    console.error('❌ KYC upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Type assertion to access user property
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = authReq.user._id;
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