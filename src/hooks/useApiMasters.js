import { useQuery } from "@tanstack/react-query";
import { newRequest } from "../api";

const useApiMaster = (api, key, params = {}, config = {}) => {
  return useQuery({
    queryKey: [key, api, params],
    queryFn: () => newRequest.get(api, { params }).then(res => res.data),

    // If config.enabled is provided, use it
    // Otherwise default to true
    enabled: config.enabled ?? true,
  });
};

export default useApiMaster;
