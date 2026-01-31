import ServerLayout from "@/app/components/layout/ServerLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ServerLayout isLoginPage={true}>{children}</ServerLayout>;
}