"use client";

import React from "react";
import AdminOverview from "./AdminOverview";
import AdminRevenueChart from "./AdminRevenueChart";

export default function Statistical() {
  return (
    <div className="space-y-6">
      <AdminOverview />
      <AdminRevenueChart />
    </div>
  );
}
