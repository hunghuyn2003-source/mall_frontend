"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateFacility, getFacilityDetail } from "@/api/facility";
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

  const { data: facilityDetail, isLoading } = useQuery({
    queryKey: ["facility", facility?.id],
    queryFn: () => getFacilityDetail(facility.id),
    enabled: isOpen && !!facility?.id,
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      status: "ACTIVE",
      price: 0,
      note: "",
    },
  });

  React.useEffect(() => {
    if (facilityDetail) {
      reset({
        name: facilityDetail.name || "",
        status: facilityDetail.status || "ACTIVE",
        price: facilityDetail.price || 0,
        note: facilityDetail.note || "",
      });
    }
  }, [facilityDetail, reset]);

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

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
        <div className="flex h-64 items-center justify-center">
          <div>Đang tải...</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h2 className="mb-6 text-2xl font-normal text-gray-800 dark:text-white">
        Cập nhật cơ sở vật chất
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="row-3 flex flex-col gap-4">
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
              <TextField
                {...field}
                label="Giá"
                fullWidth
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
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
        </div>

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
