import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import api, { attachAuthInterceptor } from "./axios.js";

// Hook: ensures every axios request from this component onward carries the Clerk JWT
export default function useApi() {
  const { getToken } = useAuth();

  useEffect(() => {
    attachAuthInterceptor(getToken);
  }, [getToken]);

  return api;
}
