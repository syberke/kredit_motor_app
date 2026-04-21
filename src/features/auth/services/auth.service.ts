import { supabase } from "@/lib/supabase-browser";

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("SESSION:", data.session);

  if (error) throw new Error(error.message);
  if (!data.session) throw new Error("Session tidak terbentuk");

  return data;
};

export const register = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};