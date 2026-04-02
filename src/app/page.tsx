import { Shield } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center p-6 bg-background">
      {/* Atmospheric background — soft gradient orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-navy/5 blur-[120px]" />
        <div className="absolute top-[60%] left-[70%] w-[35%] h-[35%] rounded-full bg-teal/8 blur-[100px]" />
      </div>

      <main className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-xl bg-surface-low">
            <Shield className="size-7 text-navy fill-navy/10" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl tracking-tighter text-navy">
            Aseguradora XYZ
          </h1>
        </div>

        {/* Login Card */}
        <section className="w-full bg-card rounded-xl p-8 shadow-ambient border border-outline-variant/10">
          <div className="mb-8">
            <h2 className="font-heading font-bold text-xl text-navy mb-1">
              Bienvenido de nuevo
            </h2>
            <p className="text-on-surface-variant text-sm">
              Ingrese sus credenciales para acceder al panel técnico.
            </p>
          </div>

          <LoginForm />
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-outline text-[11px] font-medium tracking-wide">
            © 2024 Aseguradora XYZ. Todos los derechos reservados.
            <br />
            <span className="opacity-60">
              Sistema de Gestión Técnica v2.4.0
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
