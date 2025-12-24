import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Chat from "@/components/(admin)/chat";

export default function StoreChatPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Cuộc trò chuyện" />
      <Chat />
    </div>
  );
}
