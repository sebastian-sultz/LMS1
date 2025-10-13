// controllers/auth.controller.ts - FIXED VERSION
import { Request, Response } from 'express';
import User from '../models/User.model';
import { generateOTP, getOtpExpiry, isOtpExpired } from '../utils/helpers';
import { generateToken } from '../middleware/auth.middleware';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, referralCode } = req.body;

    console.log(' Signup request for:', phoneNumber);

    // Check if user already exists
    let user = await User.findOne({ phoneNumber });

    if (user) {
      console.log(' User exists - checking progress:', {
        isProfileSetup: user.isProfileSetup,
        isKycDone: user.isKycDone
      });
      
      if (user.isProfileSetup && user.isKycDone) {
        // Complete - redirect to login, no OTP
        console.log(' User complete - redirecting to login');
        res.status(200).json({
          success: true,
          message: 'User already exists and setup complete',
          data: {
            redirectTo: '/login'
          }
        });
      } else {
        // Incomplete - generate OTP to continue
        user.otp = generateOTP();
        user.otpExpiry = getOtpExpiry();
        await user.save();

        console.log(' User incomplete - sending OTP to continue:', user.otp);
        res.status(200).json({
          success: true,
          message: 'OTP sent to continue setup',
          data: {
            otp: user.otp // For development
          }
        });
      }
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

    console.log(` New user created with OTP: ${user.otp}`);

    res.status(201).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phoneNumber,
        otp: user.otp // For development
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

    console.log(' Verifying OTP for:', phoneNumber, 'OTP:', otp);

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      console.log(' User not found in database');
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    console.log(' User found, OTP from DB:', user.otp);
    console.log(' User profile setup status:', user.isProfileSetup);
    console.log(' User KYC status:', user.isKycDone);

    // Check if OTP exists and is valid
    if (!user.otp) {
      console.log(' No OTP found for user');
      res.status(400).json({
        success: false,
        message: 'No OTP found for this user. Please request a new OTP.'
      });
      return;
    }

    if (user.otp !== otp) {
      console.log(' OTP mismatch');
      res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
      return;
    }

    // Check if OTP is expired
    if (user.otpExpiry && isOtpExpired(user.otpExpiry)) {
      console.log(' OTP expired');
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

    // Generate token
    const token = generateToken(user._id.toString());

    console.log(' OTP verified successfully for user:', user._id);
    console.log(' User status after OTP verification:', {
      isProfileSetup: user.isProfileSetup,
      isKycDone: user.isKycDone
    });

    let redirectTo = '/profile-setup';
    if (user.isProfileSetup && !user.isKycDone) {
      redirectTo = '/kyc';
    } else if (user.isProfileSetup && user.isKycDone) {
      redirectTo = '/login';
    }

    console.log(' Redirecting to:', redirectTo);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          isProfileSetup: user.isProfileSetup,
          isKycDone: user.isKycDone,
          isAdmin: user.isAdmin || false
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

export const requestLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone } = req.body;

    console.log(' Login OTP request for:', emailOrPhone);

    // Check if it's admin login
    if (emailOrPhone === 'admin@loanapp.com') {
      console.log(' Admin OTP requested');
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          emailOrPhone,
          isAdmin: true,
          otp: '123456'
        }
      });
      return;
    }

    // For regular users, find by email or phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phoneNumber: emailOrPhone }
      ]
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with this email or phone number'
      });
      return;
    }

    // Generate and save OTP for user
    user.otp = generateOTP();
    user.otpExpiry = getOtpExpiry();
    await user.save();

    console.log(`OTP for ${emailOrPhone}: ${user.otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        emailOrPhone,
        isAdmin: false,
        otp: user.otp
      }
    });
  } catch (error: any) {
    console.error('Request login OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, otp } = req.body;

    console.log(' Verifying login OTP for:', emailOrPhone, 'OTP:', otp);

    // Check if it's admin login
    if (emailOrPhone === 'admin@loanapp.com') {
      console.log(' Admin login attempt');
      
      // Verify admin OTP
      if (otp !== '123456') {
        res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
        return;
      }

      // Check if admin user exists in database, if not create one
      let adminUser = await User.findOne({ email: 'admin@loanapp.com', isAdmin: true });

      if (!adminUser) {
        adminUser = new User({
          phoneNumber: '0000000000',
          email: 'admin@loanapp.com',
          isProfileSetup: true,
          isKycDone: true,
          isAdmin: true,
          profile: {
            fullName: 'System Administrator',
            email: 'admin@loanapp.com',
            dob: new Date('1990-01-01'),
            address: 'Admin Headquarters',
            city: 'Admin City',
            state: 'Admin State'
          }
        });
        await adminUser.save();
        console.log(' Admin user created in database');
      }

      const token = generateToken(adminUser._id.toString());

      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: {
          token,
          user: {
            id: adminUser._id,
            phoneNumber: adminUser.phoneNumber,
            email: adminUser.email,
            isProfileSetup: adminUser.isProfileSetup,
            isKycDone: adminUser.isKycDone,
            isAdmin: true,
            profile: adminUser.profile
          },
          redirectTo: '/admin/dashboard'
        }
      });
      return;
    }

    // For regular users
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phoneNumber: emailOrPhone }
      ]
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found with this email or phone number'
      });
      return;
    }

    console.log(' User OTP from DB:', user.otp);

    // Check if OTP exists and is valid
    if (!user.otp) {
      res.status(400).json({
        success: false,
        message: 'No OTP found for this user'
      });
      return;
    }

    if (user.otp !== otp) {
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

    console.log(' Login successful, redirecting to:', redirectTo);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token, // ONLY LOGIN GETS TOKEN
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          isProfileSetup: user.isProfileSetup,
          isKycDone: user.isKycDone,
          isAdmin: user.isAdmin || false
        },
        redirectTo
      }
    });
  } catch (error: any) {
    console.error('Verify login OTP error:', error);
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

    console.log(`New OTP for ${phoneNumber}: ${user.otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        phoneNumber,
        otp: user.otp
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