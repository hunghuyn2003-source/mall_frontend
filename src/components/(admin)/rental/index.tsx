"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import ListRentalTable from "./ListRentalTable";
import UpdateRentalModal from "./UpdateRentalModal";
import { useModal } from "@/hooks/useModal";

export default function Rental() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedRental, setSelectedRental] = useState<any>(null);

  const handleEdit = (rental: any) => {
    setSelectedRental(rental);
    openModal();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Danh sách hợp đồng">
          <ListRentalTable onEdit={handleEdit} />
        </ComponentCard>
      </div>
      <UpdateRentalModal
        isOpen={isOpen}
        onClose={closeModal}
        rental={selectedRental}
      />
    </div>
  );
}
