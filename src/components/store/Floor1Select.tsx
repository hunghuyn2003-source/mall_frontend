import React, { useState } from "react";

interface FloorPlanSelectorProps {
  selectedAreaId: number | null;
  onAreaSelect: (areaId: number) => void;
}

const Floor1Select: React.FC<FloorPlanSelectorProps> = ({
  selectedAreaId,
  onAreaSelect,
}) => {
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);

  const handleAreaClick = (areaId: number) => {
    onAreaSelect(areaId);
  };

  const getAreaFill = (areaId: number): string => {
    if (selectedAreaId === areaId) return "#1E40AF";
    if (hoveredArea === areaId) return "#60a5fa";
    return "#C0C0C0";
  };

  const getAreaStroke = (areaId: number): string => {
    return selectedAreaId === areaId ? "#16a34a" : "#0369a1";
  };

  const getStrokeWidth = (areaId: number): string => {
    return selectedAreaId === areaId ? "4" : "2";
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

          {/* Group 18 - A-8 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(8)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(8)}
          >
            <path
              d="M2991 908H2481L2384 734.007V734H2991V908Z"
              fill={getAreaFill(8)}
              stroke={getAreaStroke(8)}
              strokeWidth={getStrokeWidth(8)}
            />
            <text
              x="2688"
              y="840"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-8
            </text>
          </g>

          {/* Group 12 - A-3 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(3)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(3)}
          >
            <path
              d="M759 1229.69V1602H365V925H587L759 1229.69Z"
              fill={getAreaFill(3)}
              stroke={getAreaStroke(3)}
              strokeWidth={getStrokeWidth(3)}
            />
            <text
              x="562"
              y="1290"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-3
            </text>
          </g>

          {/* Group 13 - A-1 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(1)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(1)}
          >
            <path
              d="M733.002 382.619L732.158 603.867L585.498 906.898L-5 903.995L-2.99902 379L733.002 382.619Z"
              fill={getAreaFill(1)}
              stroke={getAreaStroke(1)}
              strokeWidth={getStrokeWidth(1)}
            />
            <text
              x="364"
              y="640"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-1
            </text>
          </g>

          {/* Group 11 - A-2 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(2)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(2)}
          >
            <rect
              y="925"
              width="348"
              height="677"
              fill={getAreaFill(2)}
              stroke={getAreaStroke(2)}
              strokeWidth={getStrokeWidth(2)}
            />
            <text
              x="174"
              y="1290"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-2
            </text>
          </g>

          {/* Group 14 - A-4 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(4)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(4)}
          >
            <rect
              x="736"
              width="488"
              height="339"
              fill={getAreaFill(4)}
              stroke={getAreaStroke(4)}
              strokeWidth={getStrokeWidth(4)}
            />
            <text
              x="980"
              y="190"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-4
            </text>
          </g>

          {/* Group 15 - A-5 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(5)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(5)}
          >
            <rect
              x="1240"
              width="564"
              height="339"
              fill={getAreaFill(5)}
              stroke={getAreaStroke(5)}
              strokeWidth={getStrokeWidth(5)}
            />
            <text
              x="1522"
              y="190"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-5
            </text>
          </g>

          {/* Group 16 - A-6 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(6)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(6)}
          >
            <rect
              x="1822"
              width="488"
              height="339"
              fill={getAreaFill(6)}
              stroke={getAreaStroke(6)}
              strokeWidth={getStrokeWidth(6)}
            />
            <text
              x="2066"
              y="190"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-6
            </text>
          </g>

          {/* Group 17 - A-7 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(7)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(7)}
          >
            <path
              d="M2991 722H2380.38L2315 617L2315 722H2315V383H2991V722Z"
              fill={getAreaFill(7)}
              stroke={getAreaStroke(7)}
              strokeWidth={getStrokeWidth(7)}
            />
            <text
              x="2653"
              y="575"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-7
            </text>
          </g>

          {/* Central oval area (non-interactive) */}
          <ellipse
            cx="1514"
            cy="908"
            rx="722.5"
            ry="263.5"
            fill="white"
            stroke="#605959"
            strokeWidth="3"
          />

          {/* Group 19 - A-9 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(9)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(9)}
          >
            <path
              d="M2992 1094H2385V1093.99L2482 920H2992V1094Z"
              fill={getAreaFill(9)}
              stroke={getAreaStroke(9)}
              strokeWidth={getStrokeWidth(9)}
            />
            <text
              x="2688"
              y="1025"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-9
            </text>
          </g>

          {/* Group 20 - A-10 */}
          <g
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredArea(10)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => handleAreaClick(10)}
          >
            <path
              d="M2315 1210L2381 1104H2992V1602H2315V1104H2315L2315 1210Z"
              fill={getAreaFill(10)}
              stroke={getAreaStroke(10)}
              strokeWidth={getStrokeWidth(10)}
            />
            <text
              x="2653"
              y="1370"
              fill="white"
              fontSize="48"
              fontWeight="bold"
              textAnchor="middle"
            >
              A-10
            </text>
          </g>

          {/* Restrooms (non-interactive) */}
          <rect
            x="903.5"
            y="818.5"
            width="138"
            height="149"
            rx="19.5"
            fill="white"
            stroke="black"
          />
          <path
            d="M1009.55 873.805L1009.55 891.497L936.452 951L936.452 935.625L1009.55 873.805Z"
            fill="#605959"
          />
          <ellipse cx="963.5" cy="864" rx="9.5" ry="10" fill="#605959" />
          <ellipse cx="963.5" cy="902.5" rx="9.5" ry="22.5" fill="#605959" />

          <rect
            x="2007.5"
            y="818.5"
            width="138"
            height="149"
            rx="19.5"
            fill="white"
            stroke="black"
          />
          <path
            d="M2113.55 873.805L2113.55 891.497L2040.45 951L2040.45 935.625L2113.55 873.805Z"
            fill="#605959"
          />
          <ellipse cx="2067.5" cy="864" rx="9.5" ry="10" fill="#605959" />
          <ellipse cx="2067.5" cy="902.5" rx="9.5" ry="22.5" fill="#605959" />

          {/* Bottom triangle (non-interactive) */}
          <path
            d="M1543.5 1513L1584.64 1579.75H1502.36L1543.5 1513Z"
            fill="#605959"
          />
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

export default Floor1Select;
