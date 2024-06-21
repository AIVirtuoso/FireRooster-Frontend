import apiClient from "../axios";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface LoginData {
  email: String;
  password: String;
}

interface SignupData {
  email: String;
  first_name: String;
  last_name: String;
  password: String;
  password2: string;
}

const authService = {
  async signUp(data: SignupData) {
    const register = "/api/auth/register/";
    try {
      const response = await axios.post(`${BASE_URL}${register}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logIn(data: LoginData) {
    const login = "/api/auth/token/";
    try {
      const response = await axios.post(`${BASE_URL}${login}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logOut() {
    const logout = "/api/auth/logout/";
    try {
      const response = await apiClient.post(`${logout}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
