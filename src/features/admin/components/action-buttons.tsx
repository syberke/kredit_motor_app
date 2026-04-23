"use client";

import { updateStatus } from "@/app/actions/admin";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ActionButtonsProps = {
  id: string;
  onSuccess?: () => void;
};

export default function ActionButtons({ id, onSuccess }: ActionButtonsProps) {
  const [pending, startTransition] = useTransition();

  const handle = (status: "approved" | "rejected") => {
    startTransition(async () => {
      try {
        await updateStatus(id, status);
        toast.success(
          status === "approved"
            ? "Pengajuan berhasil disetujui"
            : "Pengajuan ditolak"
        );
        onSuccess?.();
      } catch {
        toast.error("Gagal memperbarui status");
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() => handle("approved")}
        className="bg-green-600 hover:bg-green-700"
      >
        {pending ? "Memproses..." : "Setujui"}
      </Button>

      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => handle("rejected")}
      >
        Tolak
      </Button>
    </div>
  );
}