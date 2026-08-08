import { useState } from 'react';
import { createRazorpayOrder, verifyRazorpayPayment } from '../lib/api';

export function useRazorpayCheckout() {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const initiateCheckout = async ({ 
    enquiryId, 
    categorySlug, 
    tier, 
    quantity, 
    customerDetails, // { name, email, phone }
    accentColor,
    onSuccess,
    onError,
    onCancel
  }) => {
    setPaymentLoading(true);
    setPaymentError('');

    try {
      // 1. Create order on server
      const orderRes = await createRazorpayOrder(
        enquiryId,
        categorySlug,
        tier,
        Number(quantity)
      );

      // Support both `orderId` and `razorpayOrderId` based on backend response keys
      const orderId = orderRes.orderId || orderRes.razorpayOrderId;
      if (!orderRes.success || !orderId) {
        throw new Error(orderRes.error || 'Failed to create payment order.');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderRes.key,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'Sai Meera Printing',
        description: orderRes.description || `${categorySlug} × ${quantity}`,
        order_id: orderId,
        prefill: {
          name: customerDetails?.name || '',
          email: customerDetails?.email || '',
          contact: customerDetails?.phone || ''
        },
        theme: {
          color: accentColor || '#eab308'
        },
        handler: async function (response) {
          try {
            setPaymentLoading(true);
            // 3. Verify payment server-side
            const verifyRes = await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            
            if (verifyRes.success) {
              setPaymentSuccess(true);
              setPaymentId(response.razorpay_payment_id);
              if (onSuccess) onSuccess(response.razorpay_payment_id);
            } else {
              throw new Error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verify failed:', err);
            setPaymentError(err.message || 'Payment verification failed.');
            if (onError) onError(err);
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setPaymentError('Payment was cancelled.');
            if (onCancel) onCancel();
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setPaymentError(response.error.description || 'Payment failed.');
        setPaymentLoading(false);
        if (onError) onError(new Error(response.error.description));
      });
      rzp.open();

    } catch (err) {
      setPaymentError(err.message);
      setPaymentLoading(false);
      if (onError) onError(err);
    }
  };

  const resetPaymentState = () => {
    setPaymentLoading(false);
    setPaymentError('');
    setPaymentSuccess(false);
    setPaymentId('');
  };

  return {
    initiateCheckout,
    paymentLoading,
    setPaymentLoading,
    paymentError,
    paymentSuccess,
    paymentId,
    setPaymentError,
    setPaymentStatus: (status) => {
      if (status === 'success') setPaymentSuccess(true);
      else if (status === null) resetPaymentState();
    },
    resetPaymentState
  };
}
