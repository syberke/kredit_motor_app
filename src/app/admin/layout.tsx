import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // ⚠️ role dari auth.users (custom column)
  // Supabase mengembalikan user.user_metadata & app_metadata
  // custom column 'role' di auth.users TIDAK otomatis ada di metadata,
  // jadi kita fetch via RPC sederhana di bawah (lihat service).
  // Untuk MVP, kita pakai RPC get_role.

  const { data: roleData } = await supabase.rpc("get_user_role");

  if (!roleData || roleData !== "admin") {
    redirect("/dashboard");
  }

  return <div className="p-6">{children}</div>;
}