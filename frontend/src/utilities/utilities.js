import { useEffect, useState } from "react";
import { AxiosInstance } from "../api/axiosInstance";

export const useAPi = (endpoint) => {
  const [data, setData] = useState(null);
  async function getData() {
    let response = await AxiosInstance.get(endpoint);
    setData(response.data);
  }

  useEffect(() => {
    getData();
  }, [endpoint]);

  return data;
};
