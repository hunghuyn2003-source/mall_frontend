import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { listOwner } from "@/api/user";
import { createStore } from "@/api/store";
import { CreateStore } from "@/type/store";
import { User, Check } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Button } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import CreateOwnerModal from "./CreateOwnerModal";
import Floor1Select from "./Floor1Select";
import Floor2Select from "./Floor2Select";
import ComponentCard from "@/components/common/ComponentCard";
import { ROLE_LABEL } from "@/helper/Label";
import { MenuItem } from "@mui/material";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const steps = ["Chủ sở hữu", "Hợp đồng", "Cửa hàng"];

export default function CreateStoreModal({ onClose, isOpen }: Props) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [step, setStep] = useState(1);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<CreateStore>({
    defaultValues: {
      ownerId: 0,
      areaId: 0,
      storeName: "",
      storeType: "",
      startDate: "",
      endDate: "",
      premisesFee: 0,
      serviceFee: 0,
      contractFile: "",
    },
  });

  const formData = watch();

  const { data: owner } = useQuery({
    queryKey: ["owners", page, debouncedSearch],
    queryFn: () => listOwner({ page, limit, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });
  const owners = owner?.data || [];
  const meta = owner?.meta;

  const mutation = useMutation({
    mutationFn: (payload: CreateStore) => createStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      toast.success("Tạo cửa hàng thành công!");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Đã có lỗi xảy ra");
    },
  });

  const handleOwnerCreated = (ownerId: number) => {
    setValue("ownerId", ownerId);
  };

  const canGoToStep2 = formData.ownerId > 0;
  const canGoToStep3 =
    formData.areaId > 0 &&
    formData.startDate !== "" &&
    formData.endDate !== "" &&
    formData.premisesFee > 0;
  const canSubmit = formData.storeName !== "" && formData.storeType !== "";

  const handleNext = () => {
    if (step === 1 && canGoToStep2) setStep(2);
    else if (step === 2 && canGoToStep3) setStep(3);
  };

  const handlePrev = () => setStep((s) => s - 1);

  const handleFloorChange = (floor: number) => {
    setSelectedArea(null);
    setValue("areaId", 0);
    setCurrentFloor(floor);
  };

  const onSubmit = (data: CreateStore) => {
    if (!canSubmit) return;
    mutation.mutate(data);
  };

  useEffect(() => {
    if (selectedArea !== null) {
      setValue("areaId", selectedArea);
    }
  }, [selectedArea, setValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
        <div>
          <h2 className="mb-8 text-2xl font-normal text-gray-800 dark:text-white">
            Tạo cửa hàng
          </h2>

          {/* Step Progress */}
          <div className="mb-8 flex">
            {steps.map((label, i) => {
              const active = step === i + 1;
              const done = step > i + 1;
              return (
                <div key={i} className="flex w-full flex-col items-center">
                  <span
                    className={`mr-4 mb-2 text-sm font-medium ${
                      active || done ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                  <div className="ml-40 flex w-full items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                        done
                          ? "bg-blue-600 text-white"
                          : active
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {done ? <Check size={18} /> : i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`mx-2 h-1 flex-1 ${
                          step > i + 1 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <ComponentCard title="Chủ sở hữu">
                  <div className="mb-4 flex items-center justify-between">
                    <input
                      value={search}
                      onChange={(e) => {
                        setPage(1); // reset page khi search
                        setSearch(e.target.value);
                      }}
                      placeholder="Tìm theo tên, email hoặc SĐT..."
                      className="w-[280px] rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />

                    <button
                      onClick={() => setIsOwnerModalOpen(true)}
                      className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      + &nbsp; Tạo chủ sở hữu
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                      <div className="min-w-[500px]">
                        <table className="w-full">
                          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                            <tr>
                              <th className="px-5 py-3 text-start font-medium text-gray-500">
                                Tên
                              </th>

                              <th className="px-5 py-3 text-start font-medium text-gray-500">
                                Số điện thoại
                              </th>

                              <th className="px-5 py-3 text-start font-medium text-gray-500">
                                Chức vụ
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {(owners || []).map((owner: any) => (
                              <tr
                                key={owner.id}
                                className={`cursor-pointer ${
                                  formData.ownerId === owner.id
                                    ? "bg-blue-100 dark:bg-blue-900"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                                onClick={() => setValue("ownerId", owner.id)}
                              >
                                {/* Tên + Avatar */}
                                <td className="flex items-center gap-3 px-4 py-3">
                                  <div className="h-10 w-10 overflow-hidden rounded-full">
                                    {owner?.avatar ? (
                                      <img
                                        src={owner.avatar}
                                        alt="avatar"
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                                        <User className="h-5 w-5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="px-4 py-3">
                                    <div className="flex flex-col">
                                      <span className="font-medium text-gray-900">
                                        {owner.name}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {owner.email || "—"}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Phone */}
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {owner.phone || "—"}
                                </td>

                                <td className="px-4 py-3 font-medium">
                                  {ROLE_LABEL[owner.role] || owner.role}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 p-0">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span className="text-sm text-gray-600">
                      Trang {meta?.page} / {meta?.totalPages}
                    </span>

                    <button
                      disabled={page === meta?.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </ComponentCard>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <ComponentCard title="Hợp đồng">
                  <div className="space-y-3 rounded-xl">
                    <div className="flex gap-4">
                      <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              label="Ngày bắt đầu"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(value) =>
                                field.onChange(value ? value.toISOString() : "")
                              }
                              slotProps={{
                                popper: { sx: { zIndex: 9999999 } },
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      />

                      <Controller
                        name="endDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              label="Ngày kết thúc"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(value) =>
                                field.onChange(value ? value.toISOString() : "")
                              }
                              slotProps={{
                                popper: { sx: { zIndex: 9999999 } },
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Controller
                        name="premisesFee"
                        control={control}
                        rules={{ required: true, min: 1 }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Số tiền thuê"
                            type="number"
                            fullWidth
                          />
                        )}
                      />

                      <Controller
                        name="serviceFee"
                        control={control}
                        rules={{ required: true, min: 1 }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phí dịch vụ (tùy chọn)"
                            type="number"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                  </div>
                </ComponentCard>

                <ComponentCard title="Mặt bằng">
                  <div className="mb-4 flex gap-2">
                    {[1, 2, 3].map((floor) => (
                      <button
                        key={floor}
                        className={`rounded px-4 py-2 ${
                          currentFloor === floor
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handleFloorChange(floor)}
                      >
                        Tầng {floor}
                      </button>
                    ))}
                  </div>
                  {currentFloor === 1 && (
                    <Floor1Select
                      selectedAreaId={selectedArea}
                      onAreaSelect={setSelectedArea}
                    />
                  )}
                  {currentFloor === 2 && (
                    <Floor2Select
                      selectedAreaId={selectedArea}
                      onAreaSelect={setSelectedArea}
                    />
                  )}
                </ComponentCard>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <Controller
                    name="storeName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} label="Tên cửa hàng" fullWidth />
                    )}
                  />
                </div>

                <Controller
                  name="storeType"
                  control={control}
                  rules={{ required: "Vui lòng chọn loại cửa hàng" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      label="Loại cửa hàng"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      SelectProps={{
                        MenuProps: {
                          sx: {
                            zIndex: 9999999,
                          },
                          PaperProps: {
                            sx: {
                              zIndex: 9999999,
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Chọn loại cửa hàng</MenuItem>
                      <MenuItem value="fashion">Thời trang</MenuItem>
                      <MenuItem value="food">Ăn uống</MenuItem>
                      <MenuItem value="electronics">Điện tử</MenuItem>
                      <MenuItem value="electronics">Đồ chơi</MenuItem>
                      <MenuItem value="cosmetics">Mỹ phẩm</MenuItem>
                      <MenuItem value="supermarket">Khu vui chơi</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </TextField>
                  )}
                />
              </div>
            )}

            {/* Bottom Buttons */}
            <div className="mt-6 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <ChevronLeft size={18} /> Quay lại
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 ? !canGoToStep2 : !canGoToStep3}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
                    (step === 1 && !canGoToStep2) ||
                    (step === 2 && !canGoToStep3)
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Tiếp theo <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`rounded-lg px-4 py-2 text-white ${
                    !canSubmit
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Hoàn tất
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <CreateOwnerModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        onCreated={handleOwnerCreated}
      />
    </>
  );
}
