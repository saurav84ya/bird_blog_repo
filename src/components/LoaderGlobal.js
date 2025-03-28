"use client";

import { useLoadingStore } from "@/store/loadingStore";

export default function LoaderGlobal() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null; // Loader tabhi dikhe jab loading ho

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
