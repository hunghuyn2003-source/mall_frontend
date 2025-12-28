"use client";
import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import ListStoreTable from "./ListStoreTable";

import { useModal } from "../../../hooks/useModal";

export default function Store() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const handleEdit = (store: any) => {
    setSelectedStore(store);
    openModal();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Danh sách cửa hàng">
          <ListStoreTable onEdit={handleEdit} />
        </ComponentCard>
      </div>

    </div>
  );
}
