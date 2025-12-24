import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hệ thống quản lý Trung tâm Thương mại",
};

export default function SignIn() {
  return <SignInForm />;
}
