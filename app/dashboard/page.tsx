import { redirect } from "next/navigation";
import { useRouter } from "next/router";

export default function Page() {
  redirect("/dashboard/alerts");
  return <>Dashboard page</>;
}
