"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

export const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium">{children}</label>
);

export const FormControl = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

type FormMessageProps = {
  name: string;
};

export const FormMessage = ({ name }: FormMessageProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name as keyof typeof errors];

  if (!error) return null;

  return (
    <p className="text-sm text-red-500">
      {(error as { message?: string })?.message || "Field tidak valid"}
    </p>
  );
};