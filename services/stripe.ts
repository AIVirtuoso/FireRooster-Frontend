import apiClient from "../axios";
import axios from "../axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface CheckoutData {
  email: String;
  plan_id: String;
}

const stripeService = {
  async checkout(data: CheckoutData) {
    const checkoutApi = "/api/stripe/checkout";
    try {
      const response = await apiClient.post(`${checkoutApi}`, data);
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default stripeService;
