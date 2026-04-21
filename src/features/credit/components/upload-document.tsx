"use client";

import { useState } from "react";
import { uploadDocument } from "../services/upload.service";
import { supabase } from "@/lib/supabase-browser";

export default function UploadDocument() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await uploadDocument(file, user.id);

    alert("Upload berhasil");
    setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {loading && <p>Uploading...</p>}
    </div>
  );
}