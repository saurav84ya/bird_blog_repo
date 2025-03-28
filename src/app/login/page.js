"use client";

import LoginForm from "@/components/LoginForm";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="h-[calc(100dvh-8rem)] flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
