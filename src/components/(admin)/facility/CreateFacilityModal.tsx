"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createFacility } from "@/api/facility";
import { getAreasByFloor } from "@/api/location";
import { Modal } from "@/components/ui/modal";
import { TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFacilityModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const [currentFloor, setCurrentFloor] = React.useState(1);
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      areaId: 0,
      price: 0,
      note: "",
    },
  });

  const formData = watch();

  const { data: areasData } = useQuery({
    queryKey: ["areas", currentFloor],
    queryFn: () => getAreasByFloor(currentFloor),
    enabled: isOpen,
  });

  const areas = areasData?.areas || [];

  const mutation = useMutation({
    mutationFn: (payload: any) => createFacility(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Tạo cơ sở vật chất thành công");
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
        Thêm cơ sở vật chất
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-2">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Tên là bắt buộc" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Tên cơ sở vật chất"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Tầng</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((floor) => (
              <button
                key={floor}
                type="button"
                onClick={() => {
                  setCurrentFloor(floor);
                  setValue("areaId", 0);
                }}
                className={`rounded px-3 py-2 ${
                  currentFloor === floor
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Tầng {floor}
              </button>
            ))}
          </div>
        </div>
        <div className="row-3 flex flex-col gap-4">
          <Controller
            name="areaId"
            control={control}
            rules={{ required: "Khu vực là bắt buộc" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Chọn khu vực"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                SelectProps={{
                  displayEmpty: true,

                  MenuProps: {
                    sx: { zIndex: 9999999 },
                    PaperProps: { sx: { zIndex: 9999999 } },
                  },
                }}
              >
                <MenuItem value="">Chọn khu vực</MenuItem>
                {areas.map((area: any) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.code}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={{ required: "Giá là bắt buộc", min: 1 }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Giá"
                fullWidth
                type="number"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
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
            {mutation.isPending ? "Đang xử lý..." : "Thêm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
