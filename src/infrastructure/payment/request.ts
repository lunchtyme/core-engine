import axios from 'axios';
import { loadEnv } from '../../utils';

loadEnv(process.env.NODE_ENV!);
export const PaystackRequest = axios.create({
  baseURL: process.env.PAYSTACK_URL!,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
