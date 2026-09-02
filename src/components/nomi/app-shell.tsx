"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { Mascot } from "@/components/nomi/mascot";
import { Badge } from "@/components/ui/badge";
import { useProviderConnection, PROVIDERS } from "@/lib/provider-context";

function ProviderBadge() {
  const { isConnected, provider } = useProviderConnection();
  const label = PROVIDERS.find((p) => p.id === provider)?.label;

  return (
    <Badge
      variant={isConnected ? "success" : "outline"}
      className="hidden sm:inline-flex"
    >
      {isConnected ? `Connected — ${label}` : "No provider connected"}
    </Badge>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-(--container-wide) items-center justify-between px-6 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
          >
            <Mascot size={20} />
            Nomi
          </Link>

          <div className="flex items-center gap-3">
            <ProviderBadge />
            <UserButton />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <AppShellInner>{children}</AppShellInner>;
}