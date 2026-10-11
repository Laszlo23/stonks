import { redirect } from "next/navigation";

export default async function DeskNumber({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  redirect(`${base}/desk?id=${id}`);
}
