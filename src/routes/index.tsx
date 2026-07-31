import MicrosoftLogo from "@/components/MicrosoftLogo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/os" });
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-8"
      style={{ backgroundColor: "#1a4731" }}
    >
      {/* Círculos decorativos */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20"
        style={{ backgroundColor: "#2d6a4f" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-15"
        style={{ backgroundColor: "#40916c" }}
      />
      <div
        className="pointer-events-none absolute bottom-40 left-12 h-48 w-48 rounded-full opacity-10"
        style={{ backgroundColor: "#52b788" }}
      />
      <div
        className="pointer-events-none absolute right-16 top-24 h-40 w-40 rounded-full opacity-10"
        style={{ backgroundColor: "#74c69d" }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.35)] sm:p-12">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-end gap-1.5">
            <div className="h-9 w-9 rounded-full" style={{ backgroundColor: "#1a4731" }} />
            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: "#b7e4c7" }} />
            <div className="h-7 w-7 rounded-full" style={{ backgroundColor: "#52b788" }} />
          </div>

          <div className="mt-1 space-y-1">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "#1a4731" }}
            >
              Divisão de Operações Aéreas
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Divisão <span style={{ color: "#2d6a4f" }}>Aérea</span>
            </h1>
            <p className="text-sm text-muted-foreground">Registro de horas de voo · ICMBio</p>
          </div>
        </div>

        {/* Divisor */}
        <div className="mb-8 border-t border-border" />

        {/* Texto */}
        <div className="mb-6 space-y-1 text-center">
          <p className="text-base text-foreground">Entre com sua conta corporativa</p>
          <p className="text-sm text-muted-foreground">
            Acesso exclusivo para servidores{" "}
            <span className="font-semibold text-foreground">@icmbio.gov.br</span>
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-6 py-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md active:scale-[0.98]"
        >
          <MicrosoftLogo />
          Entrar com Microsoft 365
        </button>

        {/* Rodapé */}
        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Ao continuar você concorda com os termos de uso do sistema.
          <br />
          Suporte:{" "}
          <a
            href="mailto:diva.suporte@icmbio.gov.br"
            className="font-medium text-foreground hover:underline"
          >
            diva.suporte@icmbio.gov.br
          </a>
        </p>
      </div>

      {/* Texto abaixo do card */}
      <p className="relative z-10 mt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} ICMBio · Ministério do Meio Ambiente
      </p>
    </div>
  );
}
