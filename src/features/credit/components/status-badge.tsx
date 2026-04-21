export default function StatusBadge({ status }: { status: string }) {
  const base = "px-2 py-1 text-xs rounded";

  if (status === "approved") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className={`${base} bg-red-100 text-red-700`}>
        Rejected
      </span>
    );
  }

  return (
    <span className={`${base} bg-yellow-100 text-yellow-700`}>
      Pending
    </span>
  );
}