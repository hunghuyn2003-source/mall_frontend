"use client";

import React from "react";
import AdminOverview from "./AdminOverview";
import PaymentHistory from "./PaymentHistory";

export default function Statistical() {
  return (
    <div className="space-y-6">
      <AdminOverview />
      <PaymentHistory />
    </div>
  );
}
