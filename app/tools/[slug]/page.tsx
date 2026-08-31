import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolsRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/exam/${slug}`);
}
