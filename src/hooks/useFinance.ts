"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getPayments,
  createPaymentNotification,
  
} from "@/api/finance";
import { CreatePaymentDto, GetPaymentsParams, CreatePaymentNotificationDto } from "@/type/finance";

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePaymentDto) => createPayment(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useGetPayments(params: GetPaymentsParams = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreatePaymentNotification() {
  return useMutation({
    mutationFn: (dto: CreatePaymentNotificationDto) =>
      createPaymentNotification(dto),
  });
}

