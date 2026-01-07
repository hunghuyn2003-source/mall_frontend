"use client";

import { useDispatch, useSelector } from "react-redux";
import { setActiveStore } from "@/store/StoreSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";

export default function SelectStorePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-normal">Cửa hàng của bạn</h1>
      <div className="grid w-full max-w-md [grid-template-columns:repeat(auto-fit,minmax(11rem,1fr))] justify-center">
        {user.stores.map((store, index) => (
          <div
            key={`${store.id}-${index}`}
            onClick={() => {
              console.log("SelectStore - store được chọn:", store);
              dispatch(setActiveStore(store));
              router.push("/store/statistical");
            }}
            className="mx-auto flex aspect-square w-44 cursor-pointer flex-col items-center justify-center rounded-xl border text-center transition hover:bg-gray-100 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold">{store.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
