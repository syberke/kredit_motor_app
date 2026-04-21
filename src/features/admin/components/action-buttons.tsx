"use client";

import { updateStatus } from "@/app/actions/admin";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ActionButtons({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handle = (status: "approved" | "rejected") => {
    startTransition(async () => {
      await updateStatus(id, status);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => handle("approved")}
        className="bg-green-500 text-white px-2 py-1 rounded"
      >
        Approve
      </button>

      <button
        disabled={pending}
        onClick={() => handle("rejected")}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Reject
      </button>
    </div>
  );
}