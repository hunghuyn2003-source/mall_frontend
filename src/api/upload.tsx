import instance from "@/utils/axios";

export type UploadFolder = "users" | "stores";

export const uploadImage = async (
  file: File,
  folder: UploadFolder,
): Promise<{ url: string; message: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await instance.post(
    `/api/v1/upload/image?folder=${folder}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};
