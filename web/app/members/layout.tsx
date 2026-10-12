import { pageMeta } from "@/lib/share";

export const metadata = pageMeta("members");

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
