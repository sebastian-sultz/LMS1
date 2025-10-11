import { Request, Response } from 'express';
import User from '../models/User.model';
import { generateOTP, getOtpExpiry, isOtpExpired } from '../utils/helpers';
import { generateToken } from '../middleware/auth.middleware';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, referralCode } = req.body;

    // Check if user already exists
    let user = await User.findOne({ phoneNumber });

    if (user) {
      // User exists, check their progress
      const token = generateToken(user._id.toString());
      
      let redirectTo = '/profile-setup';
      
      if (user.isProfileSetup && !user.isKycDone) {
        redirectTo = '/kyc';
      } else if (user.isProfileSetup && user.isKycDone) {
        redirectTo = '/dashboard';
      }

      res.status(200).json({
        success: true,
        message: 'User already exists',
        data: {
          token,
          user: {
            id: user._id,
            phoneNumber: user.phoneNumber,
            isProfileSetup: user.isProfileSetup,
            isKycDone: user.isKycDone
          },
          redirectTo
        }
      });
      return;
    }

    // Create new user
    user = new User({
      phoneNumber,
      referralCode: referralCode || undefined,
      otp: generateOTP(),
      otpExpiry: getOtpExpiry()
    });

    await user.save();

    // In production, send OTP via SMS service
    console.log(`OTP for ${phoneNumber}: ${user.otp}`);

    res.status(201).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phoneNumber,
        otp: user.otp // Remove this in production
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if OTP exists and is valid
    if (!user.otp || user.otp !== otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
      return;
    }

    // Check if OTP is expired
    if (user.otpExpiry && isOtpExpired(user.otpExpiry)) {
      res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
      return;
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id.toString());

    let redirectTo = '/profile-setup';
    if (user.isProfileSetup && !user.isKycDone) {
      redirectTo = '/kyc';
    } else if (user.isProfileSetup && user.isKycDone) {
      redirectTo = '/dashboard';
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          isProfileSetup: user.isProfileSetup,
          isKycDone: user.isKycDone
        },
        redirectTo
      }
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
      return;
    }

    // For login, we'll use dummy OTP validation
    if (otp !== '123456') {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
      return;
    }

    const token = generateToken(user._id.toString());

    let redirectTo = '/profile-setup';
    if (user.isProfileSetup && !user.isKycDone) {
      redirectTo = '/kyc';
    } else if (user.isProfileSetup && user.isKycDone) {
      redirectTo = '/dashboard';
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          isProfileSetup: user.isProfileSetup,
          isKycDone: user.isKycDone
        },
        redirectTo
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Generate new OTP
    user.otp = generateOTP();
    user.otpExpiry = getOtpExpiry();
    await user.save();

    // In production, send OTP via SMS service
    console.log(`New OTP for ${phoneNumber}: ${user.otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        phoneNumber,
        otp: user.otp // Remove this in production
      }
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};