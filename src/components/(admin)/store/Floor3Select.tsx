import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsedAreasByFloor, getAreasByFloor } from "@/api/location";

interface FloorPlanSelectorProps {
  selectedAreaId: number | null;
  onAreaSelect: (areaId: number) => void;
  currentRentalAreaId?: number | null;
  showLegend?: boolean;
  allowSelect?: boolean;
}

const Floor3Select: React.FC<FloorPlanSelectorProps> = ({
  selectedAreaId,
  onAreaSelect,
  currentRentalAreaId,
  showLegend = true,
  allowSelect = true,
}) => {
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["used-areas", 3],
    queryFn: () => getUsedAreasByFloor(3),
  });

  const { data: areasData } = useQuery({
    queryKey: ["areas", 3],
    queryFn: () => getAreasByFloor(3),
  });

  const usedAreaIds = React.useMemo<number[]>(() => {
    return data?.usedAreas?.map((a: { id: number }) => a.id) ?? [];
  }, [data]);

  const areasMap = React.useMemo<
    Map<number, { code: string; price: number; acreage: number }>
  >(() => {
    const map = new Map<
      number,
      { code: string; price: number; acreage: number }
    >();
    areasData?.areas?.forEach(
      (area: { id: number; code: string; price: number; acreage: number }) => {
        map.set(area.id, {
          code: area.code,
          price: area.price,
          acreage: area.acreage,
        });
      },
    );
    return map;
  }, [areasData]);

  const handleAreaClick = (areaId: number) => {
    if (!allowSelect) return;
    if (usedAreaIds.includes(areaId)) return;
    onAreaSelect(areaId);
  };

  const getAreaFill = (areaId: number): string => {
    if (areaId === currentRentalAreaId) return "#3B82F6"; // blue-500

    if (usedAreaIds.includes(areaId)) return "#93C5FD"; // blue-300

    if (selectedAreaId === areaId) return "#1E40AF"; // blue-800

    if (hoveredArea === areaId) return "#E5E4E2"; // hover

    return "#D1D5DB"; // gray-300
  };

  const getAreaStroke = (areaId: number): string => {
    if (areaId === currentRentalAreaId) return "#2563EB"; // blue-600
    if (usedAreaIds.includes(areaId)) return "#2563EB"; // blue-600
    if (selectedAreaId === areaId) return "#2563EB"; // blue-600
    return "#0369a1";
  };

  const getStrokeWidth = (areaId: number): string => {
    return selectedAreaId === areaId || areaId === currentRentalAreaId
      ? "4"
      : "2";
  };

  return (
    <div className="w-full">
      <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
        <svg
          viewBox="0 0 2992 1602"
          className="h-auto w-full"
          style={{ maxHeight: "600px" }}
        >
          <rect width="2992" height="1602" fill="white" />


          <g
            className={`${allowSelect ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
            onMouseEnter={() => setHoveredArea(31)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(31)}
          >
            <rect
              x="50"
              y="50"
              width="900"
              height="400"
              fill={getAreaFill(31)}
              stroke={getAreaStroke(31)}
              strokeWidth={getStrokeWidth(31)}
            />
            <text
              x="500"
              y="300"
              fill="white"
              fontSize="100"
              fontWeight="bold"
              textAnchor="middle"
            >
              {areasMap.get(31)?.code ?? "C1"}
            </text>

          </g>


          <g
            className={`${allowSelect ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
            onMouseEnter={() => setHoveredArea(32)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(32)}
          >
            <rect
              x="50"
              y="1000"
              width="900"
                height="400"
              fill={getAreaFill(32)}
              stroke={getAreaStroke(32)}
              strokeWidth={getStrokeWidth(32)}
            />
            <text
              x="500"
              y="1200"
              fill="white"
              fontSize="100"
              fontWeight="bold"
              textAnchor="middle"
            >
              {areasMap.get(32)?.code ?? "C2"}
            </text>

          </g>

     
          <g
            className={`${allowSelect ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
            onMouseEnter={() => setHoveredArea(33)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(33)}
          >
            <rect
              x="1000"
              y="50"
              width="992"
               height="400"
              fill={getAreaFill(33)}
              stroke={getAreaStroke(33)}
              strokeWidth={getStrokeWidth(33)}
            />
            <text
              x="1496"
              y="300"
              fill="white"
              fontSize="100"
              fontWeight="bold"
              textAnchor="middle"
            >
              {areasMap.get(33)?.code ?? "C3"}
            </text>

          </g>

     
          <g
            className={`${allowSelect ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
            onMouseEnter={() => setHoveredArea(34)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(34)}
          >
            <rect
              x="1000"
              y="1000"
              width="1000"
                height="400"
              fill={getAreaFill(34)}
              stroke={getAreaStroke(34)}
              strokeWidth={getStrokeWidth(34)}
            />
            <text
              x="1480"
              y="1200"
              fill="white"
              fontSize="100"
              fontWeight="bold"
              textAnchor="middle"
            >
              {areasMap.get(34)?.code ?? "C4"}
            </text>

          </g>


          <g
            className={`${allowSelect ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
            onMouseEnter={() => setHoveredArea(35)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(35)}
          >
            <rect
              x="2042"
              y="50"
              width="900"
               height="400"
              fill={getAreaFill(35)}
              stroke={getAreaStroke(35)}
              strokeWidth={getStrokeWidth(35)}
            />
            <text
              x="2492"
              y="300"
              fill="white"
              fontSize="100"
              fontWeight="bold"
              textAnchor="middle"
            >
              {areasMap.get(35)?.code ?? "C5"}
            </text>

          </g>

          <g
            className={`${allowSelect ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
            onMouseEnter={() => setHoveredArea(36)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(36)}
          >
            <rect
              x="2042"
              y="1000"
              width="900"
               height="400"
              fill={getAreaFill(36)}
              stroke={getAreaStroke(36)}
              strokeWidth={getStrokeWidth(36)}
            />
            <text
              x="2492"
              y="1200"
              fill="white"
              fontSize="100"
              fontWeight="bold"
              textAnchor="middle"
            >
              {areasMap.get(36)?.code ?? "C6"}
            </text>

          </g>

        </svg>

        {showLegend && (
          <div className="mt-4 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-blue-500"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Vị trí hiện tại
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-blue-300"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Khu vực đã có người thuê
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-blue-800"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Đang chọn
              </span>
            </div>
          </div>
        )}

        {selectedAreaId && areasMap.get(selectedAreaId) && (
          <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Khu vực</p>
                <p className="text-md font-normal text-gray-900">
                  {areasMap.get(selectedAreaId)?.code}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diện tích</p>
                <p className="text-md font-normal text-gray-900">
                  {areasMap.get(selectedAreaId)?.acreage} m²
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giá thuê</p>
                <p className="text-md font-normal text-gray-900">
                  {areasMap.get(selectedAreaId)?.price.toLocaleString("vi-VN")}{" "}
                  đ
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Floor3Select;