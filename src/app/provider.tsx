"use client";

import { ReactNode, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "@/store";

import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouterCacheProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AppRouterCacheProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
