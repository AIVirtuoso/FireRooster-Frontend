import apiClient from "../axios";
import { SetProfilePayload, SetProfileResponse, GetProfileResponse } from "./types/profile.type";

export const profileService = {
  async setProfileInfo(payload: SetProfilePayload) {
    const endPoint = "/api/profile/set-profile";
    try {
        const response = await apiClient.post<SetProfileResponse>(endPoint, payload)
        return response.data;
    } catch (error) {
        throw error;
    }
  },
  async getProfileInfo() {
    const endPoint = "/api/profile/get-profile";
    try {
        const response = await apiClient.get<GetProfileResponse>(endPoint)
        return response.data;
    } catch (error) {
        throw error;
    }
  },
};
