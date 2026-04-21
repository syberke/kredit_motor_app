import { createServerSupabase } from "@/lib/supabase-server";
import LogoutButton from "@/features/auth/components/logout-button";
import SimulationForm from "@/features/credit/components/simulation-form";
import ApplicationList from "@/features/credit/components/application-list";
export default async function DashboardPage() {
const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h2 className="text-lg font-medium">
        Welcome, {user?.email}
        
      </h2>
          <h1 className="text-xl font-bold mb-4">
        Simulasi Cicilan Motor
      </h1>

      <SimulationForm />
      <LogoutButton />
      <ApplicationList/>
    </div>
  );
}