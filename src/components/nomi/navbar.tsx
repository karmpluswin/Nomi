"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Pyramid } from "lucide-react";
import { Mascot } from "@/components/nomi/mascot";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Examples", href: "#examples" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Providers", href: "#providers" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-(--container-default) items-center justify-between px-6 md:px-8">
        {/* Left — wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          <Mascot size={20} />
          Nomi
        </Link>

        {/* Center — desktop nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-[var(--duration-hover)] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

                <div className="hidden items-center gap-3 md:flex">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Button size="sm" asChild>
            <Link href="/create">Create an ad ↗</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-11 items-center justify-center rounded-[var(--radius-control)] text-foreground transition-colors duration-[var(--duration-hover)] hover:bg-muted md:hidden"
        >
          {mobileOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.24,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden border-b border-border md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-[var(--radius-control)] px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
                                          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="h-11 justify-start px-2">
                      Sign in
                    </Button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <UserButton />
                    <span className="text-sm text-muted-foreground">
                      Account
                    </span>
                  </div>
                </Show>
                <Button className="h-11" asChild>
                  <Link href="/create">Create an ad ↗</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
