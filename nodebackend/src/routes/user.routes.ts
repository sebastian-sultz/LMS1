import { Router } from 'express';
import { 
  setupProfile, 
  uploadKyc, 
  getProfile 
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { authSchemas } from '../middleware/validation.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.post(
  '/setup-profile',
  validateRequest(authSchemas.setupProfile),
  setupProfile
);

router.post(
  '/upload-kyc',
  validateRequest(authSchemas.kycDocument),
  uploadKyc
);

router.get('/profile', getProfile);

export default router;