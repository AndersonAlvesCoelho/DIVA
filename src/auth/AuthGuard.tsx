import { useIsAuthenticated } from "@azure/msal-react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/", "/auth-redirect"];

export default function AuthGuard() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [unauthorized, setUnauthorized] = useState(false);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      setUnauthorized(true);
      const timer = setTimeout(() => {
        navigate({ to: "/" });
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setUnauthorized(false);
    }
  }, [isAuthenticated, isPublic, navigate]);

  if (unauthorized) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: "#1a4731" }}
      >
        <div className="flex items-end gap-1.5">
          <div
            className="h-9 w-9 rounded-full"
            style={{ backgroundColor: "#1a4731", border: "2px solid #fff" }}
          />
          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: "#b7e4c7" }} />
          <div className="h-7 w-7 rounded-full" style={{ backgroundColor: "#52b788" }} />
        </div>

        <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "#fee2e2" }}
          >
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <h2 className="text-sm font-semibold text-foreground">Acesso não autorizado</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Você precisa estar autenticado para acessar esta página.
            <br />
            Redirecionando para o login em instantes...
          </p>

          <div className="mt-4">
            <Link to="/" className="text-xs font-medium text-primary hover:underline">
              Ir para o login agora
            </Link>
          </div>
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          AeroHoras · ICMBio · DIVA
        </p>
      </div>
    );
  }

  return <Outlet />;
}
