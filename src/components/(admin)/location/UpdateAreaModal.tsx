"use client";

import React, { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { updateArea } from "@/api/location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { TextField, Button } from "@mui/material";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  area: any;
  floorId: number;
}

type FormValues = {
  code: string;
  acreage: number;
  price: number;
};

export default function UpdateAreaModal({
  isOpen,
  onClose,
  area,
  floorId,
}: Props) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      code: "",
      acreage: 0,
      price: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: FormValues) => updateArea(area?.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas", floorId] });
      queryClient.invalidateQueries({ queryKey: ["used-areas", floorId] });
      toast.success("Cập nhật khu vực thành công!");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra khi cập nhật");
    },
  });

  useEffect(() => {
    if (area && isOpen) {
      reset({
        code: area.code || "",
        acreage: area.acreage || 0,
        price: area.price || 0,
      });
    }
  }, [area, isOpen, reset]);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <div>
        <h2 className="mb-6 text-2xl font-normal text-gray-800 dark:text-white">
          Cập nhật khu vực
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="gap-2 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="code"
              control={control}
              rules={{ required: "Không được bỏ trống mã khu vực" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Mã khu vực"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="acreage"
              control={control}
              rules={{
                required: "Không được bỏ trống diện tích",
                min: { value: 1, message: "Diện tích phải lớn hơn 0" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Diện tích (m²)"
                  type="number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              rules={{
                required: "Không được bỏ trống giá thuê",
                min: { value: 1, message: "Giá thuê phải lớn hơn 0" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Giá thuê"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "#D1D5DB",
                color: "#6B7280",
                "&:hover": {
                  borderColor: "#9CA3AF",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#2563EB",
                "&:hover": { backgroundColor: "#3B82F6" },
              }}
            >
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
