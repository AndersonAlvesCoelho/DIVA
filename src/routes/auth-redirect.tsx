import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { msalInstance } from "../auth/AuthProvider";

export const Route = createFileRoute("/auth-redirect")({
  component: AuthRedirect,
});

function AuthRedirect() {
  useEffect(() => {
    msalInstance
      .handleRedirectPromise()
      .then(() => {
        if (window.opener) {
          window.close();
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Autenticando...</p>
    </div>
  );
}
