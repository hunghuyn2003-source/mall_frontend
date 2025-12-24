"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { updateStore } from "@/api/store";
import { uploadImage } from "@/api/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { toast } from "react-toastify";
import { STORE_TYPE_LABEL } from "@/helper/Label";
import ComponentCard from "@/components/common/ComponentCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  store: any;
}

type FormValues = {
  name: string;
  type: string;
  avatar?: File | null;
};

export default function UpdateStoreModal({ isOpen, onClose, store }: Props) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string>(store?.avatar || "");

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "",
      avatar: null,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file, "stores"),
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi upload ảnh",
      );
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => updateStore(store.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Cập nhật cửa hàng thành công!");
      onClose();
      setAvatarFile(null);
      setPreview(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra khi cập nhật");
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      let avatarUrl = store?.avatar || "";

      if (avatarFile) {
        const uploadResult = await uploadMutation.mutateAsync(avatarFile);
        avatarUrl = uploadResult.url;
      }

      mutation.mutate({
        name: values.name,
        type: values.type,
        avatar: avatarUrl,
      });
    } catch (error) {
      // Error already handled in uploadMutation
    }
  };

  React.useEffect(() => {
    if (store && isOpen) {
      reset({
        name: store.name || "",
        type: store.type || "",
        avatar: store.avatar || "",
      });
      setPreview(store.avatar || null);
      setAvatarFile(null);
    }
  }, [store, isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <h2 className="mb-6 text-xl font-semibold">Cập nhật cửa hàng</h2>

      <ComponentCard title="Thông tin cửa hàng">
        <div className="mb-6 flex flex-col items-center gap-3">
          <label className="cursor-pointer">
            {preview || store?.avatar ? (
              <img
                src={preview || store.avatar}
                alt={store?.name}
                className="h-24 w-24 rounded-full border object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-semibold text-white">
                {store?.name?.charAt(0) || "?"}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setAvatarFile(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </label>

          <span className="text-sm text-gray-500">Bấm vào ảnh để thay đổi</span>
        </div>

        <div className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Không được bỏ trống tên cửa hàng" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tên cửa hàng <span className="text-red-500">*</span>
                </label>
                <input
                  {...field}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="type"
            control={control}
            rules={{ required: "Vui lòng chọn loại cửa hàng" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Loại cửa hàng <span className="text-red-500">*</span>
                </label>
                <select
                  {...field}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Chọn loại</option>
                  {Object.entries(STORE_TYPE_LABEL).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending || uploadMutation.isPending}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending || uploadMutation.isPending
              ? "Đang xử lý..."
              : "Lưu"}
          </button>
        </div>
      </ComponentCard>
    </Modal>
  );
}
