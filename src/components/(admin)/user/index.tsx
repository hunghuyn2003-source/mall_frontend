"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import ListUserTable from "./ListUserTable";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { useModal } from "@/hooks/useModal";

export default function User() {
  const createModal = useModal();
  const updateModal = useModal();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    updateModal.openModal();
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Quản lý tài khoản">
        <div className="mb-4 flex justify-end">
          <button
            onClick={createModal.openModal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Tạo tài khoản
          </button>
        </div>
        <ListUserTable onEdit={handleEdit} />
      </ComponentCard>

      <CreateUserModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
      />

      <UpdateUserModal
        isOpen={updateModal.isOpen}
        onClose={updateModal.closeModal}
        user={selectedUser}
      />
    </div>
  );
}
