import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authGuard } from '@shared/guards/auth.guard';

const router: Router = Router();

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Handle Razorpay webhook
 * @access  Public (Razorpay)
 */
router.post('/webhook', (req, res, next) => paymentController.handleWebhook(req, res, next));

/**
 * @route   POST /api/v1/payments/initiate
 * @desc    Initiate payment for appointment
 * @access  Private
 */
router.post('/initiate', authGuard, (req, res, next) =>
    paymentController.initiatePayment(req, res, next)
);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify payment after transaction
 * @access  Private
 */
router.post('/verify', authGuard, (req, res, next) =>
    paymentController.verifyPayment(req, res, next)
);

/**
 * @route   GET /api/v1/payments
 * @desc    Get payment history
 * @access  Private
 */
router.get('/', authGuard, (req, res, next) => paymentController.getPaymentHistory(req, res, next));

/**
 * @route   POST /api/v1/payments/:id/refund
 * @desc    Refund payment
 * @access  Private (Admin/Salon Owner)
 */
router.post('/:id/refund', authGuard, (req, res, next) =>
    paymentController.refundPayment(req, res, next)
);

/**
 * @route   GET /api/v1/payments/salon/:salonId/statistics
 * @desc    Get salon payment statistics
 * @access  Private (Salon Owner)
 */
router.get('/salon/:salonId/statistics', authGuard, (req, res, next) =>
    paymentController.getSalonStatistics(req, res, next)
);

export const paymentRoutes: Router = router;
