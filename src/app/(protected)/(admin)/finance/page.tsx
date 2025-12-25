import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Finance from "@/components/(admin)/finance";

export default function FinancePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tài chính" />
      <Finance />
    </div>
  );
}
