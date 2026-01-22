"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMallStaff } from "@/api/mall-staff";
import { Modal } from "@/components/ui/modal";
import { TextField, MenuItem } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMallStaffModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      position: "",
      email: "",
      phone: "",
      salary: 0,
      birth: "",
      gender: "Male",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => createMallStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall-staff"] });
      toast.success("Tạo nhân sự thành công");
      onClose();
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi tạo");
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h2 className="mb-4 text-xl font-bold">Thêm nhân sự</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="position"
          control={control}
          rules={{ required: "Chức vụ là bắt buộc" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Chức vụ"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{ required: "Email là bắt buộc" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              type="email"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          rules={{ required: "Số điện thoại là bắt buộc" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Số điện thoại"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="salary"
          control={control}
          rules={{ required: "Lương là bắt buộc" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Lương"
              fullWidth
              type="number"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="birth"
          control={control}
          rules={{ required: "Ngày sinh là bắt buộc" }}
          render={({ field, fieldState }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Ngày sinh"
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) =>
                  field.onChange(value ? value.toISOString() : "")
                }
                slotProps={{
                  popper: { sx: { zIndex: 9999999 } },
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Giới tính" fullWidth>
              <MenuItem value="Male">Nam</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
            </TextField>
          )}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Đang xử lý..." : "Thêm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
