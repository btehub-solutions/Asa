import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Force all admin pages to render dynamically so Vercel never caches them
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("asa_admin")?.value;
  const envToken = process.env.ADMIN_UPLOAD_TOKEN;

  // Strict component-level auth check as backup for middleware
  if (!envToken || token !== envToken) {
    redirect("/admin-access");
  }

  return <>{children}</>;
}
