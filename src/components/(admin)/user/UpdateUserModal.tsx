"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateUser, getUser } from "@/api/user";
import { Modal } from "@/components/ui/modal";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

type FormValues = {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  avatar: string;
};

export default function UpdateUserModal({ isOpen, onClose, user }: Props) {
  const queryClient = useQueryClient();

  const { data: userDetail } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUser(user.id),
    enabled: !!user?.id && isOpen,
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      role: "ADMIN",
      isActive: true,
      avatar: "",
    },
  });

  useEffect(() => {
    if (userDetail) {
      reset({
        name: userDetail.name || "",
        email: userDetail.email || "",
        role: userDetail.role || "ADMIN",
        isActive: userDetail.isActive ?? true,
        avatar: userDetail.avatar || "",
      });
    }
  }, [userDetail, reset]);

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      toast.success("Cập nhật tài khoản thành công!");
      onClose();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật tài khoản",
      );
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate({
      id: user.id,
      data: values,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px]">
      <Typography variant="h6" mb={2}>
        Cập nhật tài khoản
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
              <MenuItem value="STOREOWNER">Chủ gian hàng</MenuItem>
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
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
              SelectProps={{
                MenuProps: {
                  sx: { zIndex: 999999 },
                  PaperProps: { sx: { zIndex: 999999 } },
                },
              }}
            >
              <MenuItem value="true">Kích hoạt</MenuItem>
              <MenuItem value="false">Khóa tài khoản</MenuItem>
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
          {mutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>
    </Modal>
  );
}
