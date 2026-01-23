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
      name: "",
      position: "",
      email: "",
      phone: "",
      salary: 0,
      birth: "",
      gender: "MALE",
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
      <h2 className="mb-6 text-2xl font-normal text-gray-800 dark:text-white">
        Thêm nhân sự
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="row-3 flex flex-col gap-4 space-y-4"
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: "Tên là bắt buộc" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Tên"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

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
            <TextField
              {...field}
              select
              label="Giới tính"
              fullWidth
              SelectProps={{
                MenuProps: {
                  sx: { zIndex: 9999999 },
                  PaperProps: { sx: { zIndex: 9999999 } },
                },
              }}
            >
              <MenuItem value="MALE">Nam</MenuItem>
              <MenuItem value="FEMALE">Nữ</MenuItem>
            </TextField>
          )}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Đang xử lý..." : "Thêm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
