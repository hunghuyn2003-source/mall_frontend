import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/auth";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
