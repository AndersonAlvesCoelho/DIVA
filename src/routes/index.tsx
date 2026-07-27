import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock3, Plane, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 23 23" className="h-5 w-5" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/os" });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
      navigate({ to: "/os" });
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ backgroundColor: "#061D2B" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/3 h-[520px] w-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,148,201,0.28), rgba(0,148,201,0) 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,84,128,0.55), rgba(0,84,128,0) 70%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-sidebar-primary text-primary-foreground shadow-lg">
            <Plane className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold text-sidebar-foreground">AeroHoras</div>
            <div className="text-xs text-sidebar-foreground/60">
              DIVA — Divisão de Operações Aéreas
            </div>
          </div>
        </div>

        <div className="relative max-w-lg">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
            Instituto Chico Mendes · ICMBio
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-sidebar-foreground">
            Controle total das suas horas de voo, por contrato.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            Registre operações aéreas de fiscalização, prevenção e combate a incêndios com
            rastreabilidade completa por Ordem de Serviço, aeronave e piloto.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <Feature
              icon={<Clock3 className="h-4 w-4" />}
              title="Horas em tempo real"
              desc="Cálculo automático de tempo de voo e decimais por trecho."
            />
            <Feature
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Rastreabilidade SEI"
              desc="Vínculo direto com o processo SEI e contrato vigente."
            />
          </div>
        </div>

        <p className="relative text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} ICMBio · Ministério do Meio Ambiente e Mudança do Clima
        </p>
      </aside>

      {/* Right */}
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_8px_24px_-8px_rgba(6,29,43,0.12)]">
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                Acesso institucional
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Bem-vindo de volta</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Autentique-se com sua conta corporativa @icmbio.gov.br para continuar.
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-[10px] px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#05131D" }}
            >
              <MicrosoftLogo />
              Entrar com Microsoft
            </button>

            <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
              Ao continuar você concorda com os{" "}
              <a href="#" className="font-medium text-primary hover:underline">
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a href="#" className="font-medium text-primary hover:underline">
                Política de Privacidade
              </a>{" "}
              do sistema.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Suporte técnico:{" "}
            <a href="mailto:diva.suporte@icmbio.gov.br" className="font-medium text-foreground">
              diva.suporte@icmbio.gov.br
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div>
      <div className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-sidebar-accent text-sidebar-primary">
        {icon}
      </div>
      <div className="text-sm font-semibold text-sidebar-foreground">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-sidebar-foreground/60">{desc}</div>
    </div>
  );
}
