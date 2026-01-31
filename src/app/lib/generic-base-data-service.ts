import axios from "axios";
import { useSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useDataService = (endpoint: string) => {
  const { data: session } = useSession();

  const getAll = async (params = {}) => {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      params,
    });
    return response.data;
  };

  const getById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/${endpoint}/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return response.data;
  };

  const create = async (data: any) => {
    const response = await axios.post(`${BASE_URL}/${endpoint}`, data, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return response.data;
  };

  const update = async (id: string, data: any) => {
    const response = await axios.put(`${BASE_URL}/${endpoint}/${id}`, data, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return response.data;
  };

  const remove = async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/${endpoint}/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return response.data;
  };

  return { getAll, getById, create, update, remove };
};
