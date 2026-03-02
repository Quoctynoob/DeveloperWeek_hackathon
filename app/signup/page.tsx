"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaApple, FaGoogle } from "react-icons/fa";
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
  const [step, setStep] = useState<"email" | "password">("email");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const emailValue = watch("email") ?? "";
  const passwordValue = watch("password") ?? "";
  const confirmPasswordValue = watch("confirmPassword") ?? "";

  async function onSubmit(data: SignupFormData) {
    // TODO: wire up auth logic
    console.log(data);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left half */}
      <div className="hidden lg:block w-1/2 bg-black" />

      {/* Right half */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-black tracking-tight">Welcome to lito.ai</h1>
            <p className="mt-1 text-center text-xs text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-black font-medium underline">
                Sign in
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-black text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="lito@example.com"
                {...register("email")}
                className="border-gray-300 focus:border-black focus:ring-black"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div
              className={`space-y-1.5 transition-[opacity,transform] duration-400 ease-out -mx-0.75 px-0.75 pb-0.75 ${
                step === "password" ? "opacity-100 translate-y-0 mt-3 max-h-40" : "opacity-0 -translate-y-1 mt-0 max-h-0 overflow-hidden pointer-events-none"
              }`}
            >
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
            </div>

            <div
              className={`space-y-1.5 transition-[opacity,transform] duration-400 ease-out -mx-0.75 px-0.75 pb-0.75 ${
                passwordValue.trim() ? "opacity-100 translate-y-0 mt-3 max-h-40" : "opacity-0 -translate-y-1 mt-0 max-h-0 overflow-hidden pointer-events-none"
              }`}
            >
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

            {step === "email" ? (
              <Button
                type="button"
                disabled={!emailValue.trim()}
                onClick={() => setStep("password")}
                className="mt-3 w-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !passwordValue.trim() ||
                  !confirmPasswordValue.trim()
                }
                className="mt-3 w-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            )}
          </form>

          {/* Separator */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 text-black hover:bg-gray-50 transition-colors"
            >
              <FaApple className="mr-1 h-4 w-4" />
              Login with Apple
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 text-black hover:bg-gray-50 transition-colors"
            >
              <FaGoogle className="mr-1 h-4 w-4" />
              Login with Google
            </Button>
          </div>

          {/* Terms */}
          <p className="mt-5 text-center text-xs text-gray-400">
            By clicking continue, you agree to
            <br />
            our{" "}
            <a href="#" className="text-black underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-black underline hover:text-gray-700">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
