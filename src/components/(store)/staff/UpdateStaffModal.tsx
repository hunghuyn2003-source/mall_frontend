"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { updateStaff, getStaff } from "@/api/staff";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

type FormValues = {
  name: string;
  phone: string;
  birth: Date | null;
  gender: string;
  address: string;
};

export default function UpdateStaffModal({ isOpen, onClose, staff }: Props) {
  const queryClient = useQueryClient();

  const { data: staffDetail, isLoading } = useQuery({
    queryKey: ["staff", staff?.id],
    queryFn: () => getStaff(staff.id),
    enabled: isOpen && !!staff?.id,
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      phone: "",
      birth: null,
      gender: "",
      address: "",
    },
  });

  useEffect(() => {
    if (staffDetail) {
      const user = staffDetail.user;
      reset({
        name: user?.name || "",
        phone: user?.phone || "",
        birth: user?.birth ? new Date(user.birth) : null,
        gender: user?.gender || "",
        address: user?.address || "",
      });
    }
  }, [staffDetail, reset]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateStaff(staff.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      queryClient.invalidateQueries({ queryKey: ["staff", staff.id] });
      toast.success("Cập nhật nhân viên thành công!");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra khi cập nhật nhân viên");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const payload = {
      ...values,
      birth: values.birth ? values.birth.toISOString() : "",
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
        <div className="flex h-32 items-center justify-center">Loading...</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <Typography variant="h6" mb={2}>
        Cập nhật nhân viên
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
        {/* Name */}
        <Controller
          name="name"
          control={control}
          rules={{ required: "Không được bỏ trống tên" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Tên"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        {/* Phone */}
        <Controller
          name="phone"
          control={control}
          rules={{ required: "Không được bỏ trống số điện thoại" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Số điện thoại"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        {/* Birth */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
            name="birth"
            control={control}
            rules={{ required: "Không được bỏ trống ngày sinh" }}
            render={({ field, fieldState }) => (
              <DatePicker
                format="DD/MM/YYYY"
                label="Ngày sinh"
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

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          rules={{ required: "Vui lòng chọn giới tính" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              select
              label="Giới tính"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              SelectProps={{
                MenuProps: {
                  sx: { zIndex: 999999 },
                  PaperProps: { sx: { zIndex: 999999 } },
                },
              }}
            >
              <MenuItem value="">Chọn giới tính</MenuItem>
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </TextField>
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Địa chỉ (không bắt buộc)"
              fullWidth
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            gridColumn: "span 2",
            backgroundColor: "#2563EB",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#3B82F6",
            },
          }}
        >
          Cập nhật
        </Button>
      </form>
    </Modal>
  );
}
