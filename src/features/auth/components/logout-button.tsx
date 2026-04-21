"use client";

import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.replace("/auth");
    router.refresh(); // 🔥 penting
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  );
}