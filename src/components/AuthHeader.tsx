import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export function AuthHeader() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  if (loading) return null;

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-card px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
      >
        <LogIn className="h-3.5 w-3.5" /> Sign in
      </Link>
    );
  }

  const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Account";

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/account"
        className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
      >
        <UserIcon className="h-3 w-3" /> <span className="max-w-[9rem] truncate">{name}</span>
      </Link>
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent"
        aria-label="Sign out"
      >
        <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}

