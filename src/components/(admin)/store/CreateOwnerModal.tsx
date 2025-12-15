"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { createOwner } from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { CreateOwner } from "@/type/user";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function CreateOwnerModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (ownerId: number) => void;
}) {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  type FormValues = Omit<CreateOwner, "birth"> & {
    birth: Date | null;
    confirmPassword: string;
  };

  const { control, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      birth: null,
      gender: "",
      address: "",
      avatar: "",
    },
  });

  const password = watch("password");

  const mutation = useMutation({
    mutationFn: (payload: CreateOwner) => createOwner(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      toast.success("Tạo chủ sở hữu thành công!");
      onCreated(res.id);
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra khi tạo chủ sở hữu");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const payload: CreateOwner = {
      ...values,
      birth: values.birth ? values.birth.toISOString() : "",
    };
    mutation.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-6">
      <Typography variant="h6" mb={2}>
        Tạo tài khoản chủ sở hữu
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

        {/* Email */}
        <Controller
          name="email"
          control={control}
          rules={{ required: "Không được bỏ trống email" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          rules={{ required: "Không được bỏ trống mật khẩu" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type={showPassword ? "text" : "password"}
              label="Mật khẩu"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Vui lòng xác nhận mật khẩu",
            validate: (value) => value === password || "Mật khẩu không khớp",
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type={showConfirmPassword ? "text" : "password"}
              label="Xác nhận mật khẩu"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
                  sx: { zIndex: 999999 }, // nâng z-index Popover
                  PaperProps: { sx: { zIndex: 999999 } }, // nâng z-index Paper bên trong
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
            <TextField {...field} label="Địa chỉ (không bắt buộc)" fullWidth />
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
          Tạo
        </Button>
      </form>
    </Modal>
  );
}
