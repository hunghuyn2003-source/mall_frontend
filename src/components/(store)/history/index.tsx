"use client";

import { useState } from "react";

import { useModal } from "@/hooks/useModal";
import ComponentCard from "@/components/common/ComponentCard";
import ListInvoice from "./ListInvoice";
import InvoiceDetailModal from "./InvoiceDetailModal";

export default function History({ storeId }: { storeId: number }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handleViewDetail = (invoice: any) => {
    setSelectedInvoice(invoice);
    openModal();
  };

  return (
    <div>
      <ComponentCard title="Danh sách hóa đơn">
        <ListInvoice storeId={storeId} onViewDetail={handleViewDetail} />
      </ComponentCard>

      <InvoiceDetailModal
        isOpen={isOpen}
        onClose={closeModal}
        invoice={selectedInvoice}
      />
    </div>
  );
}
