import apiClient from "../axios";
import { GetUserResponse } from "./types/account.type";

interface CheckoutData {
  email: String;
  plan_id: String;
}

const accountService = {
  async getProfile() {
    const userApi = "/api/auth/user/";
    try {
      const response = await apiClient.get<GetUserResponse>(`${userApi}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default accountService;
