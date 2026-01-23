"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { salarySettlement, listMallStaff } from "@/api/mall-staff";
import { Modal } from "@/components/ui/modal";
import { TextField, Button, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SalarySettlementModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const [defaultNote, setDefaultNote] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      note: "",
    },
  });

  const { data: staffData } = useQuery({
    queryKey: ["mall-staff-all"],
    queryFn: () => listMallStaff({ page: 1, limit: 50 }),
    enabled: isOpen,
  });

  const staffs = staffData?.data || [];

  const totalSalary = useMemo(() => {
    return staffs
      .filter((staff: any) => selectedStaffIds.includes(staff.id))
      .reduce((sum: number, staff: any) => sum + staff.salary, 0);
  }, [staffs, selectedStaffIds]);

  useEffect(() => {
    if (isOpen && staffs.length > 0) {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      const monthYear = `${lastMonth.getMonth() + 1}/${lastMonth.getFullYear()}`;
      const note = `Thanh toán lương cho toàn bộ nhân viên tháng ${monthYear}`;
      setDefaultNote(note);
      reset({ note });
      setSelectedStaffIds(staffs.map((staff: any) => staff.id));
    }
  }, [isOpen, staffs, reset]);

  const mutation = useMutation({
    mutationFn: ({ note, staffIds }: { note: string; staffIds: number[] }) =>
      salarySettlement(note, staffIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall-staff"] });
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      queryClient.invalidateQueries({ queryKey: ["admin-balance"] });
      toast.success("Quyết toán lương thành công!");
      onClose();
      reset();
      setSelectedStaffIds([]);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi quyết toán lương",
      );
    },
  });

  const onSubmit = (data: { note: string }) => {
    if (selectedStaffIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một nhân viên");
      return;
    }
    mutation.mutate({ note: data.note, staffIds: selectedStaffIds });
  };

  const handleToggleStaff = (staffId: number) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId],
    );
  };

  const handleToggleAll = () => {
    if (selectedStaffIds.length === staffs.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(staffs.map((staff: any) => staff.id));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <Typography variant="h6" mb={2}>
        Quyết toán lương nhân viên
      </Typography>

      <div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="mb-2 flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Số lượng nhân viên đã chọn:
          </span>
          <span className="font-semibold">{selectedStaffIds.length}</span>
        </div>
        <div className="flex justify-between border-t border-blue-200 pt-2 dark:border-blue-800">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Tổng lương:
          </span>
          <span className="text-lg font-bold text-blue-600">
            {totalSalary.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>
 <div className="sticky top-0 border-b border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedStaffIds.length === staffs.length && staffs.length > 0}
                indeterminate={
                  selectedStaffIds.length > 0 && selectedStaffIds.length < staffs.length
                }
                onChange={handleToggleAll}
              />
            }
            label={<span className="font-semibold">Chọn tất cả</span>}
          />
        </div>
      <div className="mb-4 max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
       
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {staffs.map((staff: any) => (
            <div
              key={staff.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedStaffIds.includes(staff.id)}
                    onChange={() => handleToggleStaff(staff.id)}
                  />
                }
                label={
                  <div>
                    <div className="font-medium">{staff.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {staff.position} • {staff.email}
                    </div>
                  </div>
                }
              />
              <span className="font-semibold text-blue-600">
                {staff.salary.toLocaleString("vi-VN")} đ
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
 <Controller
          name="note"
          control={control}
          rules={{ required: "Không được bỏ trống ghi chú" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Nội dung"
              fullWidth
              multiline
              rows={3}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        </div>
       

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={mutation.isPending || selectedStaffIds.length === 0}
          sx={{
            backgroundColor: "#16A34A",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#15803D",
            },
            "&:disabled": {
              backgroundColor: "#9CA3AF",
            },
          }}
        >
          {mutation.isPending ? "Đang xử lý..." : "Xác nhận quyết toán"}
        </Button>
      </form>
    </Modal>
  );
}
