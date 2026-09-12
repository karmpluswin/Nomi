"use client";

import * as React from "react";
import { Check, KeyRound, LogOut } from "lucide-react";

import {
  PROVIDERS,
  useProviderConnection,
  type ProviderId,
} from "@/lib/provider-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProviderKeyCard() {
  const { isConnected, provider, connect, disconnect } =
    useProviderConnection();
  const [selected, setSelected] = React.useState<ProviderId>("gemini");
  const [keyInput, setKeyInput] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "validating" | "error">(
    "idle",
  );
  const [validationMessage, setValidationMessage] = React.useState("");

  const handleConnect = () => {
    const trimmedKey = keyInput.trim();
    if (!trimmedKey) return;

    if (selected === "cloudflare") {
      const normalizedKey = trimmedKey.replace(/^Bearer\s+/i, "").trim();
      const separatorIndex = normalizedKey.lastIndexOf(":");
      const accountId =
        separatorIndex > 0 ? normalizedKey.slice(0, separatorIndex).trim() : "";
      const apiToken =
        separatorIndex >= 0
          ? normalizedKey.slice(separatorIndex + 1).trim()
          : "";

      if (!accountId || !apiToken) {
        setValidationMessage(
          'Cloudflare requires the format "accountId:apiToken".',
        );
        setStatus("error");
        return;
      }
    }

    setValidationMessage("");
    setStatus("validating");
    setTimeout(() => {
      connect(selected, trimmedKey);
      setStatus("idle");
      setKeyInput("");
    }, 600);
  };

  if (isConnected && provider) {
    const label = PROVIDERS.find((p) => p.id === provider)?.label;
    return (
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-card-sm)] border border-foreground bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Connected — {label}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={disconnect}
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-[var(--radius-card-sm)] border border-border bg-card p-4"
      suppressHydrationWarning
    >
      <div className="flex items-center gap-2">
        <KeyRound className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">
          Connect your AI provider
        </span>
      </div>

            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="AI provider">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={selected === p.id}
            onClick={() => setSelected(p.id)}
            className={
              "rounded-[var(--radius-control)] border px-3 py-1.5 font-mono text-xs transition-colors duration-[var(--duration-hover)] " +
              (selected === p.id
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-muted-foreground")
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Input
          type="password"
          value={keyInput}
          onChange={(e) => {
            setKeyInput(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setValidationMessage("");
            }
          }}
          placeholder={PROVIDERS.find((p) => p.id === selected)?.keyHint}
          autoComplete="off"
        />
        {validationMessage && (
          <p className="text-[11px] text-destructive">{validationMessage}</p>
        )}
        <p className="font-mono text-[11px] text-muted-foreground">
          Stored in memory for this session only — never saved, never sent
          anywhere but your chosen provider.
        </p>
      </div>

      <Button
        size="sm"
        className="w-fit gap-1.5"
        disabled={!keyInput.trim() || status === "validating"}
        onClick={handleConnect}
      >
        {status === "validating" ? "Connecting…" : "Connect"}
      </Button>
    </div>
  );
}
