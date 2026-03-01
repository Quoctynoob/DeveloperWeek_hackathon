"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signupSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    // TODO: wire up auth logic
    console.log(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-black tracking-tight">VentureScope</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-black text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-black text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-black text-sm font-medium">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-black font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
