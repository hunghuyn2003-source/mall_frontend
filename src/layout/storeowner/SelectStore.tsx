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
    <div className="grid grid-cols-3 gap-4 p-10">
      {user.stores.map((store) => (
        <div
          key={store.id}
          className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100"
          onClick={() => {
            dispatch(setActiveStore(store));
            router.push("/dashboard");
          }}
        >
          <h3 className="font-semibold">{store.name}</h3>
          <p className="text-sm text-gray-500">{store.type}</p>
        </div>
      ))}
    </div>
  );
}
