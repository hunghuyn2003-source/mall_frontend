import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import StoreInvoicesPage from "@/components/(store)/paymentObligaton/InvoiceList";

export default function StoreInvoicePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Hóa đơn thanh toán" />
      <StoreInvoicesPage />
    </div>
  );
}
