import { useUser } from "@/context/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/utils/helper";
import { Link } from "@tanstack/react-router";
import { LogOut, Plane } from "lucide-react";

export function TopNav() {
  const { logout } = useAuth();
  const { user, isLoading, photoUrl } = useUser();

  const initials = user?.displayName ? getInitials(user.displayName) : "?";
  const firstName = user?.displayName?.split(" ")[0] ?? "";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-6">
        <Link to="/os" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">Altas Horas</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              ICMBio · DIVA
            </span>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {!isLoading && user && (
            <>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-foreground">{user.displayName}</div>
                <div className="text-xs text-muted-foreground">
                  {user.mail ?? user.userPrincipalName}
                </div>
              </div>

              <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={user.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            </>
          )}

          <button
            onClick={logout}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Sair"
            title={`Sair (${firstName})`}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
