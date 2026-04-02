"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    // Simulated auth — navigate to launcher after brief delay
    setTimeout(() => {
      router.push("/launcher");
    }, 600);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username */}
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant"
        >
          Usuario
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="nombre.apellido"
          required
          className="h-12 border-0 border-b-2 border-transparent bg-surface-low rounded-lg px-4 text-sm text-on-surface placeholder:text-outline-variant focus:border-teal focus:ring-0 focus-visible:ring-0 focus-visible:border-teal transition-all"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant"
        >
          Contraseña
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="h-12 border-0 border-b-2 border-transparent bg-surface-low rounded-lg px-4 text-sm text-on-surface placeholder:text-outline-variant focus:border-teal focus:ring-0 focus-visible:ring-0 focus-visible:border-teal transition-all"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full premium-gradient text-white font-heading font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-navy/5 disabled:opacity-70 cursor-pointer"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Ingresando…
          </span>
        ) : (
          "Iniciar Sesión"
        )}
      </button>

      {/* Forgot password */}
      <div className="text-center pt-2">
        <button
          type="button"
          className="text-navy font-sans text-xs font-semibold hover:text-teal transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Olvidé mi contraseña
        </button>
      </div>
    </form>
  );
}
