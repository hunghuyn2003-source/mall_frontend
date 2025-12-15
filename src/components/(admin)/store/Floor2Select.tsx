import React, { useState } from "react";

interface FloorPlanSelectorProps {
  selectedAreaId: number | null;
  onAreaSelect: (areaId: number) => void;
  currentRentalAreaId?: number | null;
}

const Floor2Select: React.FC<FloorPlanSelectorProps> = ({
  selectedAreaId,
  onAreaSelect,
  currentRentalAreaId,
}) => {
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);

  const handleAreaClick = (areaId: number) => {
    onAreaSelect(areaId);
  };

  const getAreaFill = (areaId: number): string => {
    if (areaId === currentRentalAreaId) return "#16a34a"; // green for current rental
    if (selectedAreaId === areaId) return "#1E40AF"; // blue for selected
    if (hoveredArea === areaId) return "#60a5fa";
    return "#C0C0C0";
  };

  const getAreaStroke = (areaId: number): string => {
    return selectedAreaId === areaId || areaId === currentRentalAreaId
      ? "#16a34a"
      : "#0369a1";
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
          viewBox="0 0 2349 1516"
          className="h-auto w-full"
          style={{ maxHeight: "600px" }}
        >
          <rect width="2349" height="1516" fill="white" />

          {/* B-5 (ID: 15 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(15)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(15)}
          >
            <rect
              x="1499"
              width="149.51"
              height="324"
              transform="rotate(90 1499 0)"
              fill={getAreaFill(15)}
              stroke={getAreaStroke(15)}
              strokeWidth={getStrokeWidth(15)}
            />
            <text
              x="1681"
              y="180"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-5
            </text>
          </g>

          {/* B-15 (ID: 25 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(25)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(25)}
          >
            <rect
              x="1119"
              y="675"
              width="147"
              height="619"
              transform="rotate(90 1119 675)"
              fill={getAreaFill(25)}
              stroke={getAreaStroke(25)}
              strokeWidth={getStrokeWidth(25)}
            />
            <text
              x="809"
              y="760"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-15
            </text>
          </g>

          {/* B-17 (ID: 27 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(27)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(27)}
          >
            <rect
              x="1119"
              y="952"
              width="252"
              height="505"
              transform="rotate(90 1119 952)"
              fill={getAreaFill(27)}
              stroke={getAreaStroke(27)}
              strokeWidth={getStrokeWidth(27)}
            />
            <text
              x="867"
              y="1090"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-17
            </text>
          </g>

          {/* B-16 (ID: 26 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(26)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(26)}
          >
            <rect
              x="593"
              y="952"
              width="252"
              height="593"
              transform="rotate(90 593 952)"
              fill={getAreaFill(26)}
              stroke={getAreaStroke(26)}
              strokeWidth={getStrokeWidth(26)}
            />
            <text
              x="300"
              y="1090"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-16
            </text>
          </g>

          {/* B-2 (ID: 12 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(12)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(12)}
          >
            <rect
              x="372"
              y="157"
              width="127"
              height="382"
              transform="rotate(90 372 157)"
              fill={getAreaFill(12)}
              stroke={getAreaStroke(12)}
              strokeWidth={getStrokeWidth(12)}
            />
            <text
              x="181"
              y="240"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-2
            </text>
          </g>

          {/* B-1 (ID: 11 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(11)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(11)}
          >
            <rect
              x="1499"
              width="149.51"
              height="324"
              transform="rotate(90 1499 0)"
              fill={getAreaFill(11)}
              stroke={getAreaStroke(11)}
              strokeWidth={getStrokeWidth(11)}
            />
            <text
              x="1330"
              y="90"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-1
            </text>
          </g>

          {/* B-4 (ID: 14 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(14)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(14)}
          >
            <rect
              x="377"
              y="459"
              width="127"
              height="382"
              transform="rotate(90 377 459)"
              fill={getAreaFill(14)}
              stroke={getAreaStroke(14)}
              strokeWidth={getStrokeWidth(14)}
            />
            <text
              x="186"
              y="540"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-4
            </text>
          </g>

          {/* B-3 (ID: 13 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(13)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(13)}
          >
            <rect
              x="375"
              y="302"
              width="127"
              height="382"
              transform="rotate(90 375 302)"
              fill={getAreaFill(13)}
              stroke={getAreaStroke(13)}
              strokeWidth={getStrokeWidth(13)}
            />
            <text
              x="184"
              y="385"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-3
            </text>
          </g>

          {/* B-11 (ID: 21 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(21)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(21)}
          >
            <rect
              x="1631"
              y="281"
              width="186"
              height="456"
              transform="rotate(90 1631 281)"
              fill={getAreaFill(21)}
              stroke={getAreaStroke(21)}
              strokeWidth={getStrokeWidth(21)}
            />
            <text
              x="1403"
              y="375"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-11
            </text>
          </g>

          {/* B-12 (ID: 22 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(22)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(22)}
          >
            <rect
              x="1646"
              y="602"
              width="232"
              height="324"
              transform="rotate(90 1646 602)"
              fill={getAreaFill(22)}
              stroke={getAreaStroke(22)}
              strokeWidth={getStrokeWidth(22)}
            />
            <text
              x="1480"
              y="740"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-12
            </text>
          </g>

          {/* B-14 (ID: 24 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(24)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(24)}
          >
            <rect
              x="1819.51"
              y="1111"
              width="149.51"
              height="263"
              transform="rotate(-180 1819.51 1111)"
              fill={getAreaFill(24)}
              stroke={getAreaStroke(24)}
              strokeWidth={getStrokeWidth(24)}
            />
            <text
              x="1745"
              y="1000"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-14
            </text>
          </g>

          {/* B-13 (ID: 23 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(23)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(23)}
          >
            <rect
              x="1646"
              y="848"
              width="261"
              height="324"
              transform="rotate(90 1646 848)"
              fill={getAreaFill(23)}
              stroke={getAreaStroke(23)}
              strokeWidth={getStrokeWidth(23)}
            />
            <text
              x="1480"
              y="1000"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-13
            </text>
          </g>

          {/* B-6 (ID: 16 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(16)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(16)}
          >
            <rect
              x="1836"
              width="149.51"
              height="309"
              transform="rotate(90 1836 0)"
              fill={getAreaFill(16)}
              stroke={getAreaStroke(16)}
              strokeWidth={getStrokeWidth(16)}
            />
            <text
              x="1681"
              y="90"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-6
            </text>
          </g>

          {/* B-7 (ID: 17 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(17)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(17)}
          >
            <rect
              x="2349"
              y="180"
              width="400"
              height="513"
              transform="rotate(90 2349 180)"
              fill={getAreaFill(17)}
              stroke={getAreaStroke(17)}
              strokeWidth={getStrokeWidth(17)}
            />
            <text
              x="2093"
              y="360"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-7
            </text>
          </g>

          {/* A-4 (ID: 4 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(4)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(4)}
          >
            <rect
              x="2349"
              y="606"
              width="286"
              height="319"
              transform="rotate(90 2349 606)"
              fill={getAreaFill(4)}
              stroke={getAreaStroke(4)}
              strokeWidth={getStrokeWidth(4)}
            />
            <text
              x="2206"
              y="715"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-4
            </text>
          </g>

          {/* B-8 (ID: 18 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(18)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(18)}
          >
            <rect
              x="2349"
              y="606"
              width="286"
              height="319"
              transform="rotate(90 2349 606)"
              fill={getAreaFill(18)}
              stroke={getAreaStroke(18)}
              strokeWidth={getStrokeWidth(18)}
            />
            <text
              x="2206"
              y="715"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-8
            </text>
          </g>

          {/* B-9 (ID: 19 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(19)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(19)}
          >
            <rect
              x="2349"
              y="918"
              width="286"
              height="319"
              transform="rotate(90 2349 918)"
              fill={getAreaFill(19)}
              stroke={getAreaStroke(19)}
              strokeWidth={getStrokeWidth(19)}
            />
            <text
              x="2206"
              y="1025"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-9
            </text>
          </g>

          {/* B-10 (ID: 20 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(20)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(20)}
          >
            <rect
              x="2349"
              y="1230"
              width="286"
              height="319"
              transform="rotate(90 2349 1230)"
              fill={getAreaFill(20)}
              stroke={getAreaStroke(20)}
              strokeWidth={getStrokeWidth(20)}
            />
            <text
              x="2206"
              y="1340"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-10
            </text>
          </g>

          {/* B-18 (ID: 28 trong DB) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(28)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(28)}
          >
            <rect
              x="1119"
              y="1234"
              width="286"
              height="1124"
              transform="rotate(90 1119 1234)"
              fill={getAreaFill(28)}
              stroke={getAreaStroke(28)}
              strokeWidth={getStrokeWidth(28)}
            />
            <text
              x="557"
              y="1370"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              B-18
            </text>
          </g>

          {/* Central oval area (non-interactive) */}
          <ellipse
            cx="776"
            cy="345"
            rx="253.5"
            ry="248.5"
            fill="white"
            stroke="#605959"
            strokeWidth="3"
          />

          {/* Restroom 1 (non-interactive) */}
          <rect
            x="706.5"
            y="245.5"
            width="138"
            height="149"
            rx="19.5"
            fill="white"
            stroke="black"
          />
          <path
            d="M812.551 300.805L812.55 318.497L739.452 378L739.452 362.625L812.551 300.805Z"
            fill="#605959"
          />
          <ellipse cx="766.5" cy="291" rx="9.5" ry="10" fill="#605959" />
          <ellipse cx="766.5" cy="329.5" rx="9.5" ry="22.5" fill="#605959" />

          {/* Restroom 2 (non-interactive) */}

          <rect
            x="13.5"
            y="673.5"
            width="138"
            height="149"
            rx="19.5"
            fill="#313030"
            stroke="black"
          />
          {/* Thêm chữ WC màu trắng */}
          <text
            x="82.5"
            y="770"
            fill="white"
            fontSize="70"
            fontWeight="bold"
            textAnchor="middle"
          >
            WC
          </text>
          {/* Central circle (non-interactive) */}
          <ellipse
            cx="1545"
            cy="1320"
            rx="148.5"
            ry="148.5"
            fill="white"
            stroke="#605959"
            strokeWidth="3"
          />

          {/* Restroom 3 (non-interactive) */}
          <rect
            x="1476.5"
            y="1245.5"
            width="138"
            height="149"
            rx="19.5"
            fill="white"
            stroke="black"
          />
          <path
            d="M1582.55 1300.8L1582.55 1318.5L1509.45 1378L1509.45 1362.63L1582.55 1300.8Z"
            fill="#605959"
          />
          <ellipse cx="1536.5" cy="1291" rx="9.5" ry="10" fill="#605959" />
          <ellipse cx="1536.5" cy="1329.5" rx="9.5" ry="22.5" fill="#605959" />
        </svg>

        {/* Legend */}
        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-300"></div>
            <span className="text-gray-700 dark:text-gray-300">
              Vị trí trống
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">
              Đã có cửa hàng
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-800"></div>
            <span className="text-gray-700 dark:text-gray-300">
              Vị trí đang chọn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Floor2Select;
