"use client";

import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/AuthSlide";
import { setActiveStore } from "@/store/StoreSlice";
import Image from "next/image";

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const user = data.user;

      toast.success("Đăng nhập thành công");
      dispatch(setUser(user));

      if (
        (user.role === "STOREOWNER" || user.role === "STORESTAFF") &&
        (!user.stores || user.stores.length === 0)
      ) {
        toast.error("Tài khoản chưa được gán cửa hàng");
        return;
      }

      switch (user.role) {
        case "ADMIN":
          router.push("/");
          break;

        case "STOREOWNER":
          router.push("/store/statistical");
          break;

        case "STORESTAFF":
          router.push("/staff/sell");
          break;

        default:
          router.push("/login");
      }
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Đăng nhập thất bại");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    loginMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role,
    });
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div>
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/MallLogo.png"
                alt="Mall Logo"
                width={180}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
              />

              <TextField
                name="password"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
              />

              <FormControl fullWidth required>
                <InputLabel id="role-label">Vai trò</InputLabel>
                <Select
                  labelId="role-label"
                  value={role}
                  label="Vai trò"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="ADMIN"> Ban quản lý</MenuItem>
                  <MenuItem value="STOREOWNER">Chủ gian hàng</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  gridColumn: "span 2",
                  backgroundColor: "#2563EB",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#3B82F6",
                  },
                }}
              >
                Đăng nhập
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
