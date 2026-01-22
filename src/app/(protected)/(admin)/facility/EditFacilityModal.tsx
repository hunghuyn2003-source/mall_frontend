"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFacility } from "@/api/facility";
import { Modal } from "@/components/ui/modal";
import { TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

interface Props {
  facility: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditFacilityModal({
  facility,
  isOpen,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: facility?.name || "",
      status: facility?.status || "ACTIVE",
      price: facility?.price || 0,
      note: facility?.note || "",
    },
  });

  React.useEffect(() => {
    if (facility) {
      reset({
        name: facility.name,
        status: facility.status,
        price: facility.price,
        note: facility.note || "",
      });
    }
  }, [facility, reset]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateFacility(facility.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Cập nhật cơ sở vật chất thành công");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi cập nhật");
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h2 className="mb-4 text-xl font-bold">Cập nhật cơ sở vật chất</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Tên cơ sở vật chất" fullWidth />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Trạng thái" fullWidth>
              <MenuItem value="ACTIVE">Hoạt động</MenuItem>
              <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
              <MenuItem value="BROKEN">Hư hỏng</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Giá" fullWidth type="number" />
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Ghi chú"
              fullWidth
              multiline
              rows={2}
            />
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
            {mutation.isPending ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
