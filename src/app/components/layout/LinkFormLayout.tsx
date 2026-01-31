import ServerLayout from "@/app/components/layout/ServerLayout";

export default function LinkFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ServerLayout isPublicRoute={true}>{children}</ServerLayout>;
}
