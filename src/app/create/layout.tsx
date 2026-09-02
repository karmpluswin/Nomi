import { auth } from "@clerk/nextjs/server";

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  return <>{children}</>;
}