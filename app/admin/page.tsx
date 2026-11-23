import { redirect } from "next/navigation";
import { isAdmin } from "@/src/lib/admin-session";
import { blobEnabled, getContent } from "@/src/lib/content-store";
import Editor from "./Editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const content = await getContent();
  return <Editor initial={content} blob={blobEnabled()} />;
}
