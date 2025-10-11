import { Router } from 'express';
import { 
  signup, 
  verifyOtp, 
  login, 
  resendOtp 
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

router.post(
  '/login',
  validateRequest(authSchemas.login),
  login
);

router.post(
  '/resend-otp',
  validateRequest(authSchemas.signup), // Reuse signup schema for phone validation
  resendOtp
);

export default router;