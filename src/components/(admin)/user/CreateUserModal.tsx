"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api/user";
import { CreateUser } from "@/type/user";
import { Modal } from "@/components/ui/modal";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  type FormValues = CreateUser & {
    confirmPassword: string;
  };

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
      avatar: "",
    },
  });

  const password = watch("password");

  const mutation = useMutation({
    mutationFn: (payload: CreateUser) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Tạo tài khoản thành công!");
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản",
      );
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const { confirmPassword, ...payload } = values;
    mutation.mutate(payload);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] p-6">
      <Typography variant="h6" mb={2}>
        Tạo tài khoản mới
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
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

        <Controller
          name="email"
          control={control}
          rules={{
            required: "Không được bỏ trống email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email không hợp lệ",
            },
          }}
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

        <Controller
          name="password"
          control={control}
          rules={{
            required: "Không được bỏ trống mật khẩu",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
          }}
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

        <Controller
          name="role"
          control={control}
          rules={{ required: "Vui lòng chọn vai trò" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              select
              label="Vai trò"
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
              <MenuItem value="ADMIN">Ban quản lý</MenuItem>
              <MenuItem value="STOREOWNER">Chủ cửa hàng</MenuItem>
              <MenuItem value="STORESTAFF">Nhân viên cửa hàng</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Avatar URL (không bắt buộc)"
              fullWidth
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
          {mutation.isPending ? "Đang tạo..." : "Tạo"}
        </Button>
      </form>
    </Modal>
  );
}
