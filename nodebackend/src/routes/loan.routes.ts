import { Router, Response, RequestHandler } from 'express';
import axios, { AxiosError } from 'axios';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';
import { IUser } from '../models/User.model';

const router = Router();
const GO_SERVICE_URL = process.env.GO_SERVICE_URL || 'http://localhost:8080';

router.use(authenticate as RequestHandler); 

const handleAxiosError = (error: unknown, res: Response, fallbackMsg: string) => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError;
    console.error('Axios error:', axiosErr.response?.data || axiosErr.message);
    const status = axiosErr.response?.status || 500;
    const message = (axiosErr.response?.data as any)?.message || axiosErr.message || fallbackMsg;
    return res.status(status).json({ success: false, message });
  }
  console.error('Unexpected error:', error);
  return res.status(500).json({ success: false, message: fallbackMsg });
};

// User: Apply for a loan
router.post('/apply', (async (req, res) => {
  const authReq = req as AuthenticatedRequest; 
  const user: IUser = authReq.user;

  try {
    if (!user.isProfileSetup || !user.isKycDone) {
      return res.status(403).json({ success: false, message: 'Complete profile and KYC to apply for loans' });
    }

    const { amount, repaymentTerm, loanType } = req.body;
    if (!amount || !repaymentTerm || !loanType) {
      return res.status(400).json({ success: false, message: 'Missing required fields: amount, repaymentTerm, loanType' });
    }

    if (!user.profile?.fullName) {
      return res.status(400).json({ success: false, message: 'User profile name is missing' });
    }

    const response = await axios.post(`${GO_SERVICE_URL}/loans/apply`, {
      user_id: user._id.toString(),
      name: user.profile.fullName,
      amount,
      term: repaymentTerm,
      type: loanType,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to apply for loan');
  }
}) as RequestHandler); 

// User: Get my loans
router.get('/my-loans', (async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const user: IUser = authReq.user;

  try {
    const response = await axios.get(`${GO_SERVICE_URL}/loans/user/${user._id.toString()}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch loans');
  }
}) as RequestHandler);

// User/Admin: Get repayments for a specific loan
router.get('/:loanId/repayments', (async (req, res) => {
  const { loanId } = req.params;

  try {
    const response = await axios.get(`${GO_SERVICE_URL}/repayments/${loanId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch repayments');
  }
}) as RequestHandler);

// Admin: Get all loans
router.get('/all', (async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const user: IUser = authReq.user;

  try {
    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const response = await axios.get(`${GO_SERVICE_URL}/loans`);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch all loans');
  }
}) as RequestHandler);

// Admin: Approve loan
router.post('/:loanId/approve', (async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const user: IUser = authReq.user;

  try {
    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const { loanId } = req.params;
    const response = await axios.post(`${GO_SERVICE_URL}/loans/${loanId}/approve`);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to approve loan');
  }
}) as RequestHandler);

// Admin: Reject loan
router.post('/:loanId/reject', (async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const user: IUser = authReq.user;

  try {
    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const { loanId } = req.params;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason required' });
    }
    const response = await axios.post(`${GO_SERVICE_URL}/loans/${loanId}/reject`, { reason });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to reject loan');
  }
}) as RequestHandler);

export default router;