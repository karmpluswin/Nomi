import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const signInUrl = `${protocol}://${host}/sign-in`;

  await auth.protect({ unauthenticatedUrl: signInUrl });
  return <>{children}</>;
}