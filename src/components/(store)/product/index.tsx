"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import ListProductTable from "./ListProductTable";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import { useModal } from "@/hooks/useModal";

interface Props {
  storeId: number;
}

export default function Product({ storeId }: Props) {
  const createModal = useModal();
  const updateModal = useModal();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    updateModal.openModal();
  };

  const handleCreate = () => {
    createModal.openModal();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Danh sách sản phẩm">
          <ListProductTable
            storeId={storeId}
            onEdit={handleEdit}
            onCreate={handleCreate}
          />
        </ComponentCard>
      </div>
      <CreateProductModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        storeId={storeId}
      />
      <UpdateProductModal
        isOpen={updateModal.isOpen}
        onClose={updateModal.closeModal}
        product={selectedProduct}
        storeId={storeId}
      />
    </div>
  );
}
