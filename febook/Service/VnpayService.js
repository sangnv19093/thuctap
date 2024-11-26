import axios from 'axios';

const VNPAY_API_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

const createPaymentUrl = async (orderInfo) => {
  try {
    // Thêm logic để tạo URL thanh toán tại đây
    // Sử dụng axios để gửi dữ liệu tới VNPAY
    const response = await axios.post(VNPAY_API_URL, orderInfo);
    return response.data;
  } catch (error) {
    console.error('Error creating VNPAY payment URL:', error);
    throw error;
  }
};

export { createPaymentUrl };