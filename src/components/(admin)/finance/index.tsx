"use client";

import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import ListPaymentTable from "./ListPaymentTable";
import CreateNotificationModal from "./CreateNotificationModal";
import { useModal } from "../../../hooks/useModal";

export default function Finance() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Danh sách thanh toán">
          <ListPaymentTable onCreateNotification={openModal} />
        </ComponentCard>
      </div>
      <CreateNotificationModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
