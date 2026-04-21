"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authSchema, AuthSchema } from "../schemas/auth.schema";
import { login, register } from "../services/auth.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AuthSchema) => {
  try {
    if (isLogin) {
      await login(values.email, values.password);
      toast.success("Login berhasil");

      router.replace("/dashboard");
      router.refresh();
    } else {
     
      await register(values.email, values.password);

    
      await login(values.email, values.password);

      toast.success("Akun berhasil dibuat");


      router.replace("/dashboard");
      router.refresh();
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("Terjadi kesalahan");
    }
  }
};

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {isLogin ? "Login" : "Register"} Kredit Motor
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage name="email" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage name="password" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
        </Form>

        <p className="text-sm mt-4 text-center">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Daftar" : "Login"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}