"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ComponentCard from "@/components/common/ComponentCard";
import ListAreaTable from "./ListAreaTable";
import UpdateAreaModal from "./UpdateAreaModal";
import Floor1Select from "../store/Floor1Select";
import Floor2Select from "../store/Floor2Select";
import Floor3Select from "../store/Floor3Select";
import { useModal } from "@/hooks/useModal";
import { findAllStoresWithActiveRental } from "@/api/store";

export default function Location() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  const { data: storesData } = useQuery({
    queryKey: ["stores-rented", currentFloor],
    queryFn: () => findAllStoresWithActiveRental(currentFloor),
  });

  const stores = storesData || [];

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    openModal();
  };

  const handleFloorChange = (floor: number) => {
    setCurrentFloor(floor);
    setSelectedAreaId(null);
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Sơ đồ mặt bằng">
        <div className="mb-4 flex gap-2">
          {[1, 2, 3].map((floor) => (
            <button
              key={floor}
              className={`rounded px-4 py-2 ${
                currentFloor === floor
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
              onClick={() => handleFloorChange(floor)}
            >
              Tầng {floor}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <div className="w-1/2 overflow-auto rounded-lg border border-gray-200">
            {currentFloor === 1 && (
              <Floor1Select
                selectedAreaId={selectedAreaId}
                onAreaSelect={setSelectedAreaId}
                showLegend={false}
                allowSelect={false}
              />
            )}
            {currentFloor === 2 && (
              <Floor2Select
                selectedAreaId={selectedAreaId}
                onAreaSelect={setSelectedAreaId}
                showLegend={false}
                allowSelect={false}
              />
            )}
            {currentFloor === 3 && (
              <Floor3Select
                selectedAreaId={selectedAreaId}
                onAreaSelect={setSelectedAreaId}
                showLegend={false}
                allowSelect={false}
              />
            )}
          </div>

          {currentFloor && (
            <div className="w-1/2 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Cửa hàng đã thuê
              </h3>
              {stores.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có cửa hàng nào</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {stores.map((store: any) => (
                  <div
  key={store.id}
className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
>

                      <span className="w-14 pl-2 text-sm font-semibold text-gray-700">
                        {store.rentals?.[0]?.area?.code || "N/A"}
                      </span>
                      {store.avatar ? (
                        <img
                          src={store.avatar}
                          alt={store.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                          {store.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <span className="text-sm text-gray-800">
                        {store.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ComponentCard>

      <ComponentCard title="Danh sách khu vực">
        <ListAreaTable floorId={currentFloor} onEdit={handleEdit} />
      </ComponentCard>

      <UpdateAreaModal
        isOpen={isOpen}
        onClose={closeModal}
        area={selectedArea}
        floorId={currentFloor}
      />
    </div>
  );
}
