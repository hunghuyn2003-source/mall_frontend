import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Rental from "@/components/(admin)/rental";

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Hợp đồng" />
      <Rental />
    </div>
  );
}
