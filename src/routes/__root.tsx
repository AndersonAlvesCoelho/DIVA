import AuthGuard from "@/auth/AuthGuard";
import { AuthProvider } from "@/auth/AuthProvider";
import NotFoundComponent from "@/components/NotFoundComponent";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <UserProvider>
        <Toaster />
        <AuthGuard />
      </UserProvider>
    </AuthProvider>
  );
}
