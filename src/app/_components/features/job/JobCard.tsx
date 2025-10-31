import { JobSummary } from '@/types/job';
import JobCardClient from './JobCardClient';

interface JobCardProps {
  job: JobSummary;
  onToggleScrap: (jobId: string) => void;
}

export default function JobCard({ job, onToggleScrap }: JobCardProps) {
  return <JobCardClient job={job} onToggleScrap={onToggleScrap} />;
}
