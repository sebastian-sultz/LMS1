// routes/auth.routes.ts - Fixed version
import { Router } from 'express';
import { 
  signup, 
  verifyOtp, 
  resendOtp,
  requestLoginOtp,
  verifyLoginOtp
} from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { authSchemas } from '../middleware/validation.middleware';

const router = Router();

router.post(
  '/signup',
  validateRequest(authSchemas.signup),
  signup
);

router.post(
  '/verify-otp',
  validateRequest(authSchemas.verifyOtp),
  verifyOtp
);

// New unified login routes
router.post(
  '/request-login-otp',
  validateRequest(authSchemas.requestLoginOtp),
  requestLoginOtp
);

router.post(
  '/verify-login-otp',
  validateRequest(authSchemas.verifyLoginOtp),
  verifyLoginOtp
);

router.post(
  '/resend-otp',
  validateRequest(authSchemas.signup), // Reuse signup schema for phone validation
  resendOtp
);

export default router;