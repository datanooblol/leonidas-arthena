import { ProjectWorkspace } from '@/app/src/components/pages';
import { use } from 'react';

// Server Component (Default in Next.js App Router)
export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const projectId = Number(resolvedParams.projectId);

  return <ProjectWorkspace projectId={projectId} />;
}