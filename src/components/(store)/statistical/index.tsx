"use client";

import React from "react";
import StoreOwnerOverview from "./StoreOwnerOverview";
import StoreOwnerRevenueChart from "./StoreOwnerRevenueChart";

export default function Statistical() {
  return (
    <div className="space-y-6">
      <StoreOwnerOverview />
      <StoreOwnerRevenueChart />
    </div>
  );
}
