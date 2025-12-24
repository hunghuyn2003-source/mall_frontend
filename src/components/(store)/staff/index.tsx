"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import ListStaffTable from "./ListStaffTable";
import CreateStaffModal from "./CreateStaffModal";
import UpdateStaffModal from "./UpdateStaffModal";
import { useModal } from "@/hooks/useModal";

interface Props {
  storeId: number;
}

export default function Staff({ storeId }: Props) {
  const createModal = useModal();
  const updateModal = useModal();
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const handleEdit = (staff: any) => {
    setSelectedStaff(staff);
    updateModal.openModal();
  };

  const handleCreate = () => {
    createModal.openModal();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Danh sách nhân viên">
          <ListStaffTable
            storeId={storeId}
            onEdit={handleEdit}
            onCreate={handleCreate}
          />
        </ComponentCard>
      </div>
      <CreateStaffModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        storeId={storeId}
      />
      <UpdateStaffModal
        isOpen={updateModal.isOpen}
        onClose={updateModal.closeModal}
        staff={selectedStaff}
      />
    </div>
  );
}
