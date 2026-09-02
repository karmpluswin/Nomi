import Link from "next/link";

import { Mascot } from "@/components/nomi/mascot";

const FOOTER_LINKS = [
  { label: "Examples", href: "#examples" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Providers", href: "#providers" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-(--container-default) flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
        >
          <Mascot size={16} />
          Nomi
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-[var(--duration-hover)] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className=" text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nomi. Free, bring your own key.
        </p>
      </div>
    </footer>
  );
}
