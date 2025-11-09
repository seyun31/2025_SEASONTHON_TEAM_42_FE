import { JobSummary } from '@/types/job';
import JobCardClient from './JobCardClient';

interface JobCardProps {
  job: JobSummary;
  onToggleScrap: (jobId: string) => void;
  isOpen?: boolean;
  onToggle?: (jobId: string) => void;
  priority?: boolean;
}

export default function JobCard({
  job,
  onToggleScrap,
  isOpen,
  onToggle,
  priority,
}: JobCardProps) {
  return (
    <JobCardClient
      job={job}
      onToggleScrap={onToggleScrap}
      isOpen={isOpen}
      onToggle={onToggle}
      priority={priority}
    />
  );
}
