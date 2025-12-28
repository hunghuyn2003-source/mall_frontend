"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  updateProduct,
  getProduct,
  listProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "@/api/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatNumber } from "@/helper/format";

const parseNumber = (value: string) => {
  const cleaned = value.replace(/\./g, "");
  if (cleaned === "") return "";
  const num = Number(cleaned);
  return isNaN(num) ? "" : num;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  storeId: number;
}

type FormValues = {
  name: string;
  price: number;
  stock: number;
  productCategoryId: number;
  originalPrice?: number;
};

export default function UpdateProductModal({
  isOpen,
  onClose,
  product,
  storeId,
}: Props) {
  const queryClient = useQueryClient();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");

  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["product", product?.id],
    queryFn: () => getProduct(product.id),
    enabled: isOpen && !!product?.id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["productCategories", storeId],
    queryFn: () => listProductCategories({ limit: 100, storeId }),
    enabled: isOpen,
  });
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || [];

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      productCategoryId: 0,
      originalPrice: 0,
    },
  });

  useEffect(() => {
    if (productDetail) {
      reset({
        name: productDetail.name || "",
        price: productDetail.price || 0,
        stock: productDetail.stock || 0,
        productCategoryId: productDetail.productCategory?.id || 0,
        originalPrice: productDetail.originalPrice || "",
      });
    }
  }, [productDetail, reset]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateProduct(product.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      toast.success("Cập nhật sản phẩm thành công!");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      editingCategory
        ? updateProductCategory(editingCategory.id, payload)
        : createProductCategory({ ...payload, storeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] });
      toast.success(
        editingCategory
          ? "Cập nhật danh mục thành công!"
          : "Tạo danh mục thành công!",
      );
      setCategoryDialogOpen(false);
      setCategoryName("");
      setEditingCategory(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteProductCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] });
      toast.success("Xóa danh mục thành công!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Có lỗi xảy ra khi xóa");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate(values);
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleCategorySave = () => {
    if (!categoryName.trim()) {
      toast.error("Tên danh mục không được trống");
      return;
    }
    categoryMutation.mutate({ name: categoryName });
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
        <div className="flex h-32 items-center justify-center">Loading...</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <Typography variant="h6" mb={2}>
        Cập nhật sản phẩm
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          rules={{ required: "Không được bỏ trống tên sản phẩm" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Tên sản phẩm"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Category select with actions */}
        <div className="mt-4 flex items-center gap-2">
          <Controller
            name="productCategoryId"
            control={control}
            rules={{ required: "Vui lòng chọn danh mục" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Danh mục"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                SelectProps={{
                  MenuProps: {
                    sx: { zIndex: 9999999 },
                  },
                }}
              >
                <MenuItem value={0}>Chọn danh mục</MenuItem>
                {categories.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <IconButton
            onClick={openCreateCategory}
            color="primary"
            title="Thêm danh mục"
          >
            <Plus size={20} />
          </IconButton>
          <IconButton
            onClick={() => {
              const selectedCat = categories.find(
                (c: any) => c.id === control._formValues.productCategoryId,
              );
              if (selectedCat) openEditCategory(selectedCat);
            }}
            color="warning"
            title="Sửa danh mục"
          >
            <Edit size={20} />
          </IconButton>
          <IconButton
            onClick={() => {
              const selectedId = control._formValues.productCategoryId;
              if (selectedId > 0) handleDeleteCategory(selectedId);
            }}
            color="error"
            title="Xóa danh mục"
          >
            <Trash2 size={20} />
          </IconButton>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="price"
            control={control}
            rules={{
              required: "Không được bỏ trống giá",
              min: { value: 0, message: "Giá phải >= 0" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Giá"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={formatNumber(field.value)}
                onChange={(e) => field.onChange(parseNumber(e.target.value))}
              />
            )}
          />

          <Controller
            name="stock"
            control={control}
            rules={{
              required: "Không được bỏ trống tồn kho",
              min: { value: 0, message: "Tồn kho phải >= 0" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Tồn kho"
                type="number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            )}
          />
        </div>

        <Controller
          name="originalPrice"
          control={control}
          render={({ field }) => (
            <TextField
              label="Giá gốc"
              fullWidth
              value={formatNumber(field.value || 0)}
              onChange={(e) => field.onChange(parseNumber(e.target.value))}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#2563EB",
            borderRadius: 2,
            "&:hover": { backgroundColor: "#3B82F6" },
          }}
        >
          Cập nhật
        </Button>
      </form>

      {/* Category Dialog */}
      <Dialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        sx={{ zIndex: 99999 }}
      >
        <DialogTitle>
          {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Tên danh mục"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCategorySave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Modal>
  );
}
