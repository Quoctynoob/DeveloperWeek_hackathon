"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    // TODO: wire up auth logic
    console.log(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-black tracking-tight">VentureScope</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-black text-sm font-medium">
                Password
              </Label>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">
                Forgot password?
              </a>
            </div>
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-black font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
