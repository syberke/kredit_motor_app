import { supabase } from "@/lib/supabase-browser";

export const uploadDocument = async (
  file: File,
  userId: string
) => {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (error) throw new Error(error.message);

  return filePath;
};