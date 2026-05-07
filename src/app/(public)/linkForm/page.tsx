import LinkForm from "@/app/components/projectManager/linkForm";
import ServerLayout from "@/app/components/layout/ServerLayout";
export default function LinkFormPage() {
  return (
    <ServerLayout isPublicRoute={true}>
      <LinkForm />
    </ServerLayout>
  );
}
