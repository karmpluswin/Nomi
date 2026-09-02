"use client";

import * as React from "react";

export type ProviderId = "gemini" | "openai" | "fal" | "openrouter" | "cloudflare";

export const PROVIDERS: { id: ProviderId; label: string; keyHint: string }[] = [
  { id: "cloudflare", label: "Cloudflare (free)", keyHint: "accountId:apiToken" },
  { id: "gemini", label: "Google Gemini", keyHint: "AIza... or AQ.Ab..." },
  { id: "openai", label: "OpenAI", keyHint: "sk-..." },
  { id: "fal", label: "fal", keyHint: "key_id:key_secret" },
  { id: "openrouter", label: "OpenRouter", keyHint: "sk-or-v1-..." },
];

interface ProviderState {
  provider: ProviderId | null;
  /** In-memory only. Never persisted, never logged, gone on reload. */
  apiKey: string | null;
}

interface ProviderContextValue extends ProviderState {
  isConnected: boolean;
  connect: (provider: ProviderId, apiKey: string) => void;
  disconnect: () => void;
}

const ProviderContext = React.createContext<ProviderContextValue | null>(null);

export function ProviderConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<ProviderState>({
    provider: null,
    apiKey: null,
  });

  const connect = React.useCallback((provider: ProviderId, apiKey: string) => {
    setState({ provider, apiKey });
  }, []);

  const disconnect = React.useCallback(() => {
    setState({ provider: null, apiKey: null });
  }, []);

  const value = React.useMemo(
    () => ({
      ...state,
      isConnected: Boolean(state.provider && state.apiKey),
      connect,
      disconnect,
    }),
    [state, connect, disconnect]
  );

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviderConnection() {
  const ctx = React.useContext(ProviderContext);
  if (!ctx) {
    throw new Error(
      "useProviderConnection must be used within ProviderConnectionProvider"
    );
  }
  return ctx;
}