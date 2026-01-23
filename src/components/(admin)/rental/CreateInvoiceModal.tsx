"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { createStoreInvoice } from "@/api/storeInvoice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { TextField, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  storeName: string;
}

type FormValues = {
  monthYear: Date | null;
  contractFee: number;
  electricityFee: number;
  waterFee: number;
  dueDate: Date | null;
  note: string;
};

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  storeId,
  storeName,
}: CreateInvoiceModalProps) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      monthYear: null,
      contractFee: 0,
      electricityFee: 0,
      waterFee: 0,
      dueDate: null,
      note: "",
    },
  });

  const electricityFee = watch("electricityFee") || 0;
  const waterFee = watch("waterFee") || 0;
  const totalAmount = electricityFee + waterFee;

  React.useEffect(() => {
    if (isOpen) {
      const now = new Date();

now.setMonth(now.getMonth() - 1);
const month = now.getMonth() + 1;
const year = now.getFullYear();
      const defaultNote = `Thanh toán hóa đơn phí điện nước tháng ${month}/${year}`;
      reset({
        monthYear: null,
        contractFee: 0,
        electricityFee: 0,
        waterFee: 0,
        dueDate: null,
        note: defaultNote,
      });
    }
  }, [isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (payload: {
      storeId: number;
      monthYear: string;
      contractFee?: number;
      electricityFee?: number;
      waterFee?: number;
      dueDate?: string;
      note?: string;
    }) => createStoreInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-invoices"] });
      toast.success("Tạo hóa đơn thành công!");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi tạo hóa đơn");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const payload = {
      storeId,
      monthYear: values.monthYear ? values.monthYear.toISOString() : "",
      electricityFee: values.electricityFee,
      waterFee: values.waterFee,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      note: values.note,
    };
    mutation.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <Typography variant="h6" mb={2}>
        Tạo hóa đơn cho cửa hàng: {storeName}
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
            name="monthYear"
            control={control}
            rules={{ required: "Không được bỏ trống tháng/năm" }}
            render={({ field, fieldState }) => (
              <DatePicker
                views={["month", "year"]}
                format="MM/yyyy"
                label="Tháng/Năm"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                slotProps={{
                  popper: { sx: { zIndex: 9999999 } },
                  textField: {
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    fullWidth: true,
                  },
                }}
              />
            )}
          />

          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState }) => (
              <DatePicker
                format="dd/MM/yyyy"
                label="Ngày đến hạn"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                slotProps={{
                  popper: { sx: { zIndex: 9999999 } },
                  textField: {
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>

        <Controller
          name="electricityFee"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phí điện"
              fullWidth
              value={
                field.value
                  ? Number(field.value).toLocaleString("vi-VN")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                field.onChange(raw === "" ? "" : Number(raw));
              }}
            />
          )}
        />

        <Controller
          name="waterFee"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phí nước"
              fullWidth
              value={
                field.value
                  ? Number(field.value).toLocaleString("vi-VN")
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                field.onChange(raw === "" ? "" : Number(raw));
              }}
            />
          )}
        />

        <TextField
          label="Tổng tiền"
          value={totalAmount.toLocaleString("vi-VN")}
          fullWidth
          disabled
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nội dung"
              fullWidth
              multiline
              rows={3}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={mutation.isPending}
          sx={{
            gridColumn: "span 2",
            backgroundColor: "#2563EB",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#3B82F6",
            },
          }}
        >
          {mutation.isPending ? "Đang tạo..." : "Gửi hóa đơn"}
        </Button>
      </form>
    </Modal>
  );
}
