"use client";

import React, { useMemo } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { updateRental, getRental } from "@/api/rental";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAreasByFloor } from "@/api/location";
import { Modal } from "@/components/ui/modal";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { RENTAL_STATUS_LABEL, STORE_TYPE_LABEL } from "@/helper/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Floor1Select from "../store/Floor1Select";
import Floor2Select from "../store/Floor2Select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rental: any;
}

type FormValues = {
  startDate: string;
  endDate: string;
  premisesFee: number;
  serviceFee: number;
  status: string;
  areaId: number;
};

export default function UpdateRentalModal({ isOpen, onClose, rental }: Props) {
  const queryClient = useQueryClient();
  const [currentFloor, setCurrentFloor] = React.useState<number | null>(1);
  const [selectedAreaId, setSelectedAreaId] = React.useState<number | null>(
    null,
  );

  const { data: rentalDetail, isLoading } = useQuery({
    queryKey: ["rental", rental?.id],
    queryFn: () => {
      console.log("Fetching rental for id:", rental?.id);
      return getRental(rental.id);
    },
    enabled: isOpen && !!rental?.id,
  });

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      startDate: "",
      endDate: "",
      premisesFee: 0,
      serviceFee: 0,
      status: "",
    },
  });

  // Get areas data for current floor
  const { data: areasData } = useQuery({
    queryKey: ["areas", currentFloor],
    queryFn: () => getAreasByFloor(currentFloor || 1),
    enabled: isOpen && currentFloor !== null,
  });

  // Create areasMap
  const areasMap = useMemo<
    Map<number, { code: string; price: number; acreage: number }>
  >(() => {
    const map = new Map<
      number,
      { code: string; price: number; acreage: number }
    >();
    areasData?.areas?.forEach(
      (area: { id: number; code: string; price: number; acreage: number }) => {
        map.set(area.id, {
          code: area.code,
          price: area.price,
          acreage: area.acreage,
        });
      },
    );
    return map;
  }, [areasData]);

  const mutation = useMutation({
    mutationFn: (payload: FormValues) => updateRental(rental.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      toast.success("Cập nhật hợp đồng thành công!");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra khi cập nhật");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate({
      ...values,
      areaId: selectedAreaId ?? rentalDetail?.area?.id,
    });
  };

  React.useEffect(() => {
    if (rentalDetail) {
      reset({
        status: rentalDetail.status || "",
        startDate: rentalDetail.startDate || "",
        endDate: rentalDetail.endDate || "",
        premisesFee: rentalDetail.premisesFee || 0,
        serviceFee: rentalDetail.serviceFee || 0,
      });
      setCurrentFloor(rentalDetail.area.floor.level);
      setSelectedAreaId(rentalDetail.area.id);
    }
  }, [rentalDetail, reset]);

  // Auto-fill premisesFee when area is selected
  React.useEffect(() => {
    if (selectedAreaId !== null && selectedAreaId !== rentalDetail?.area?.id) {
      const area = areasMap.get(selectedAreaId);
      if (area) {
        setValue("premisesFee", area.price);
      }
    }
  }, [selectedAreaId, areasMap, setValue, rentalDetail?.area?.id]);

  // Clear selected area and restore original premisesFee when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedAreaId(null);
      // Restore original premisesFee from rentalDetail
      if (rentalDetail?.premisesFee) {
        setValue("premisesFee", rentalDetail.premisesFee);
      }
    }
  }, [isOpen, rentalDetail, setValue]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1200px]">
      <Typography variant="h6" mb={4}>
        Cập nhật hợp đồng
      </Typography>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cột 1: Thông tin cửa hàng và hợp đồng */}
        <div className="space-y-6">
          {/* Thông tin cửa hàng */}
          <ComponentCard title="Thông tin cửa hàng">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 4,
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  src={rentalDetail?.store?.avatar || ""}
                  alt={rentalDetail?.store?.name}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    fontWeight: 600,
                    bgcolor: "primary.main",
                  }}
                >
                  {rentalDetail?.store?.name?.charAt(0) || ""}
                </Avatar>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Mã hợp đồng:{" "}
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {rentalDetail?.code || "-"}
                  </Typography>
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Chủ sở hữu:{" "}
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {rentalDetail?.owner?.name || "-"}
                  </Typography>
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Tên cửa hàng:{" "}
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {rentalDetail?.store?.name || "-"}
                  </Typography>
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Loại cửa hàng:{" "}
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {STORE_TYPE_LABEL[rentalDetail?.store?.type] || "-"}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </ComponentCard>

          {/* Form cập nhật hợp đồng */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div>Loading...</div>
            </div>
          ) : (
            <ComponentCard title="Cập nhật hợp đồng">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="startDate"
                      control={control}
                      rules={{ required: "Không được bỏ trống ngày bắt đầu" }}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          label="Ngày bắt đầu"
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
                      )}
                    />

                    <Controller
                      name="endDate"
                      control={control}
                      rules={{ required: "Không được bỏ trống ngày kết thúc" }}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          label="Ngày kết thúc"
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
                      )}
                    />
                  </LocalizationProvider>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    name="premisesFee"
                    control={control}
                    rules={{
                      required: "Không được bỏ trống phí thuê",
                      min: { value: 1, message: "Phí thuê phải lớn hơn 0" },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Phí thuê mặt bằng"
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

                  <Controller
                    name="serviceFee"
                    control={control}
                    rules={{
                      required: "Không được bỏ trống phí thuê",
                      min: { value: 1, message: "Phí thuê phải lớn hơn 0" },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Phí dịch vụ"
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

                <div className="grid grid-cols-1 gap-4">
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Vui lòng chọn trạng thái" }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="Trạng thái"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        SelectProps={{
                          MenuProps: {
                            sx: { zIndex: 9999999 },
                            PaperProps: { sx: { zIndex: 9999999 } },
                          },
                        }}
                      >
                        <MenuItem value="">Chọn trạng thái</MenuItem>
                        {Object.entries(RENTAL_STATUS_LABEL).map(
                          ([key, label]) => (
                            <MenuItem key={key} value={key}>
                              {label}
                            </MenuItem>
                          ),
                        )}
                      </TextField>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#2563EB",
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "#3B82F6" },
                    mt: 2,
                  }}
                >
                  Lưu
                </Button>
              </form>
            </ComponentCard>
          )}
        </div>

        {/* Cột 2: Mặt bằng */}
        <div>
          <ComponentCard title="Mặt bằng">
            <div className="mb-4 flex gap-2">
              {[1, 2, 3].map((floor) => (
                <button
                  type="button"
                  key={floor}
                  className={`rounded px-4 py-2 ${
                    currentFloor === floor
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                  onClick={() => {
                    setCurrentFloor(floor);
                    setSelectedAreaId(null);
                  }}
                >
                  Tầng {floor}
                </button>
              ))}
            </div>

            <div className="overflow-auto rounded-lg border border-gray-200">
              {currentFloor === 1 && (
                <Floor1Select
                  selectedAreaId={selectedAreaId}
                  onAreaSelect={setSelectedAreaId}
                  currentRentalAreaId={rentalDetail?.area?.id || null}
                />
              )}
              {currentFloor === 2 && (
                <Floor2Select
                  selectedAreaId={selectedAreaId}
                  onAreaSelect={setSelectedAreaId}
                  currentRentalAreaId={rentalDetail?.area?.id || null}
                />
              )}
              {currentFloor === 3 && (
                <div className="p-4 text-center">
                  <Typography variant="body1" color="text.secondary">
                    Sơ đồ tầng 3 đang được cập nhật
                  </Typography>
                </div>
              )}
            </div>
          </ComponentCard>
        </div>
      </div>
    </Modal>
  );
}
