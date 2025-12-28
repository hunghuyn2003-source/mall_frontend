import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Statistical from "@/components/(admin)/statistical";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div >
      <PageBreadcrumb pageTitle="" />
      <Statistical />
    </div>
  );
}
