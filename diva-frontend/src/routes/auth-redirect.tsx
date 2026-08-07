import { msalInstance } from "@/auth/AuthProvider";
import LogoLoader from "@/components/LogoLoader";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/auth-redirect")({
  component: AuthRedirect,
});

function AuthRedirect() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    msalInstance
      .handleRedirectPromise()
      .then((result) => {
        if (result?.account) {
          msalInstance.setActiveAccount(result.account);
        }
        setStatus("success");
        setTimeout(() => navigate({ to: "/os" }), 800);
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
        setTimeout(() => navigate({ to: "/" }), 3000);
      });
  }, [navigate]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ backgroundColor: "#1a4731" }}
    >
      {/* Card */}
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-white px-8 py-10 shadow-2xl">
        {status === "loading" && (
          <>
            <LogoLoader />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Autenticando</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Verificando suas credenciais Microsoft 365...
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "#d1fae5" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "#006633" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Autenticado com sucesso</p>
              <p className="mt-1 text-xs text-muted-foreground">Redirecionando para o sistema...</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "#fee2e2" }}
            >
              <svg
                className="h-6 w-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Falha na autenticação</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Redirecionando para a tela de login...
              </p>
            </div>
          </>
        )}
      </div>

      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
        Altas Horas · ICMBio · DIVA
      </p>
    </div>
  );
}
