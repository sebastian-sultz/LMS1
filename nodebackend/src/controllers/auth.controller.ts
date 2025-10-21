// controllers/auth.controller.ts 
import { Request, Response } from 'express';
import User from '../models/User.model';
import { generateOTP, getOtpExpiry, isOtpExpired } from '../utils/helpers';
import { generateToken } from '../middleware/auth.middleware';

// ------------------- SIGNUP -------------------
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, referralCode } = req.body;
    console.log(' Signup request for:', phoneNumber);

    let user = await User.findOne({ phoneNumber });

    if (user) {
      console.log(' User exists - checking progress:', {
        isProfileSetup: user.isProfileSetup,
        isKycDone: user.isKycDone,
      });

      if (user.isProfileSetup && user.isKycDone) {
        console.log(' User complete - redirecting to login');
        res.status(200).json({
          success: true,
          message: 'User already exists and setup complete',
          data: { redirectTo: '/login' },
        });
      } else {
        user.otp = generateOTP();
        user.otpExpiry = getOtpExpiry();
        await user.save();

        console.log(' User incomplete - sending OTP to continue:', user.otp);
        res.status(200).json({
          success: true,
          message: 'OTP sent to continue setup',
          data: { otp: user.otp }, // For dev
        });
      }
      return;
    }

    // New user
    user = new User({
      phoneNumber,
      referralCode: referralCode || undefined,
      otp: generateOTP(),
      otpExpiry: getOtpExpiry(),
    });
    await user.save();

    console.log(` New user created with OTP: ${user.otp}`);
    res.status(201).json({
      success: true,
      message: 'OTP sent successfully',
      data: { phoneNumber, otp: user.otp },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ------------------- VERIFY OTP -------------------
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, otp } = req.body;
    console.log(' Verifying OTP for:', phoneNumber, 'OTP:', otp);

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      console.log(' User not found');
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (!user.otp) {
      res.status(400).json({ success: false, message: 'No OTP found. Please request a new OTP.' });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
      return;
    }

    if (user.otpExpiry && isOtpExpired(user.otpExpiry)) {
      res.status(400).json({ success: false, message: 'OTP has expired' });
      return;
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Include isAdmin in token
    const token = generateToken(user._id.toString(), user.isAdmin || false);

    let redirectTo = '/profile-setup';
    if (user.isProfileSetup && !user.isKycDone) redirectTo = '/kyc';
    else if (user.isProfileSetup && user.isKycDone) redirectTo = '/login';

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
          isAdmin: user.isAdmin || false,
        },
        redirectTo,
      },
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ------------------- REQUEST LOGIN OTP -------------------
export const requestLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone } = req.body;
    console.log(' Login OTP request for:', emailOrPhone);

    // Admin special case
    if (emailOrPhone === 'admin@loanapp.com') {
      console.log(' Admin OTP requested');
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        data: { emailOrPhone, isAdmin: true, otp: '123456' },
      });
      return;
    }

    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }] });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found with this email or phone number' });
      return;
    }

    user.otp = generateOTP();
    user.otpExpiry = getOtpExpiry();
    await user.save();

    console.log(`OTP for ${emailOrPhone}: ${user.otp}`);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: { emailOrPhone, isAdmin: false, otp: user.otp },
    });
  } catch (error: any) {
    console.error('Request login OTP error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ------------------- VERIFY LOGIN OTP -------------------
export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, otp } = req.body;
    console.log(' Verifying login OTP for:', emailOrPhone, 'OTP:', otp);

    // --- Admin login ---
    if (emailOrPhone === 'admin@loanapp.com') {
      console.log(' Admin login attempt');

      if (otp !== '123456') {
        res.status(400).json({ success: false, message: 'Invalid OTP' });
        return;
      }

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
            state: 'Admin State',
          },
        });
        await adminUser.save();
        console.log(' Admin user created in database');
      }

      // ✅ Token with isAdmin true
      const token = generateToken(adminUser._id.toString(), true);

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
            profile: adminUser.profile,
          },
          redirectTo: '/admin/dashboard',
        },
      });
      return;
    }

    // --- Regular user login ---
    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }] });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found with this email or phone number' });
      return;
    }

    if (!user.otp) {
      res.status(400).json({ success: false, message: 'No OTP found for this user' });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
      return;
    }

    if (user.otpExpiry && isOtpExpired(user.otpExpiry)) {
      res.status(400).json({ success: false, message: 'OTP has expired' });
      return;
    }

    // Clear OTP and generate token
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // ✅ Include isAdmin in token
    const token = generateToken(user._id.toString(), user.isAdmin || false);

    let redirectTo = '/profile-setup';
    if (user.isProfileSetup && !user.isKycDone) redirectTo = '/kyc';
    else if (user.isProfileSetup && user.isKycDone) redirectTo = '/dashboard';

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
          isKycDone: user.isKycDone,
          isAdmin: user.isAdmin || false,
        },
        redirectTo,
      },
    });
  } catch (error: any) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ------------------- RESEND OTP -------------------
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.otp = generateOTP();
    user.otpExpiry = getOtpExpiry();
    await user.save();

    console.log(`New OTP for ${phoneNumber}: ${user.otp}`);
    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: { phoneNumber, otp: user.otp },
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};
