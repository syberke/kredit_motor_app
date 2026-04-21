import AdminList from "@/features/admin/components/admin-list";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <AdminList />
    </div>
  );
}