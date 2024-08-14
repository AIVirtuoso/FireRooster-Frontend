import { AxiosRequestConfig } from "axios";
import apiClient from "../axios";
import { Category, IGetSubCategoriesByCategory, IUpdateSelectedSubCategoriesResponse } from "./types/settings.type";
import { IGetSubCategoriesByCategoryResponse } from "./types/settings.type";

export const settingsService = {
  async getSubCategoriesByCategory(category: IGetSubCategoriesByCategory) {
    const endPoint = "/api/alerts/all-subcategories";
    try {
      const response =
        await apiClient.post<IGetSubCategoriesByCategoryResponse>(
          endPoint,
          category
        );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateSelectedSubCategories(category: Category[]) {
    const endPoint = "/api/alerts/update-selected-subcategories";
    try {
      const response =
        await apiClient.post<IUpdateSelectedSubCategoriesResponse>(
          endPoint,
          category
        );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
