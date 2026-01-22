"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMallStaff } from "@/api/mall-staff";
import { Modal } from "@/components/ui/modal";
import { TextField, MenuItem } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

interface Props {
  staff: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditMallStaffModal({ staff, isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      position: "",
      email: "",
      phone: "",
      salary: 0,
      birth: "",
      gender: "Male",
      isActive: "true",
    },
  });

  React.useEffect(() => {
    if (isOpen && staff) {
      reset({
        position: staff.position || "",
        email: staff.email || "",
        phone: staff.phone || "",
        salary: staff.salary || 0,
        birth: staff.birth || "",
        gender: staff.gender || "Male",
        isActive: staff.isActive ? "true" : "false",
      });
    }
  }, [isOpen, staff, reset]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateMallStaff(staff.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall-staff"] });
      toast.success("Cập nhật nhân sự thành công");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi cập nhật");
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      isActive: data.isActive === "true",
    };
    mutation.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h2 className="mb-6 text-2xl font-normal text-gray-800 dark:text-white">
        Cập nhật nhân sự
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="row-3 flex flex-col gap-4 space-y-4"
      >
        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Chức vụ" fullWidth />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Email" fullWidth type="email" />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Số điện thoại" fullWidth />
          )}
        />

        <Controller
          name="salary"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Lương" fullWidth type="number" />
          )}
        />

        <Controller
          name="birth"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Ngày sinh"
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) =>
                  field.onChange(value ? value.toISOString() : "")
                }
                slotProps={{
                  popper: { sx: { zIndex: 9999999 } },
                  textField: { fullWidth: true },
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
              <MenuItem value="Male">Nam</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Trạng thái"
              fullWidth
              SelectProps={{
                MenuProps: {
                  sx: { zIndex: 9999999 },
                  PaperProps: { sx: { zIndex: 9999999 } },
                },
              }}
            >
              <MenuItem value="true">Hoạt động</MenuItem>
              <MenuItem value="false">Không hoạt động</MenuItem>
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
            {mutation.isPending ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
