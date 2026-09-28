import React from 'react';
import {
  ExternalLink,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  ChevronRight,
  IndianRupee,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { JobOpportunity } from '../types';
import { getSourceColor } from '../services/jobPlatformLinks';
import { TECHNICAL_SKILLS } from '../data/careerData';
import { parseSalary } from '../utils/salaryUtils';

interface JobCardProps {
  job: JobOpportunity;
  onOpenDetails: (job: JobOpportunity) => void;
  expectedSalaryId?: string | null;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onOpenDetails, expectedSalaryId }) => {
  const sourceStyle = getSourceColor(job.source);

  // Derive Technical Skill name & Specialization/Domain name
  const skillObj = TECHNICAL_SKILLS.find((s) => s.id === job.technicalSkillId);
  const technicalSkillName = skillObj?.name || 'Technology';
  const domainObj = skillObj?.domains.find((d) => d.id === job.domainId);
  const specializationName = domainObj?.name || (job.domainId ? job.domainId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Specialized Track');

  // Parse salary disclosure
  const parsedSalary = parseSalary(job.salary);

  const getPostedBadge = (days: number, postedText: string) => {
    if (days === 0) {
      return (
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{postedText.includes('Today') ? postedText : 'Posted Today'}</span>
        </span>
      );
    }
    if (days <= 3) {
      return <span className="text-sky-400 font-medium">{postedText}</span>;
    }
    return <span className="text-slate-400 font-medium">{postedText}</span>;
  };

  return (
    <article className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all hover:bg-slate-900 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Top Header: Company, Source, Verification & Posted Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-inner">
              {job.company.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                {job.company}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-slate-300 font-medium">{job.companyType}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className={`font-medium ${sourceStyle.text}`}>
                  via {job.source}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {job.isVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Active</span>
              </span>
            )}
            <div className="text-[11px] text-slate-400 font-mono">
              {getPostedBadge(job.postedDaysAgo, job.postedDate)}
            </div>
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
          {job.title}
        </h3>

        {/* Technical Skill & Specialization / Domain Badge Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700/80 text-slate-300 text-[11px]">
            <span className="text-slate-500 font-mono">Skill:</span>
            <span className="font-semibold text-slate-200">{technicalSkillName}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-800/60 text-cyan-300 text-[11px]">
            <span className="text-cyan-500 font-mono">Specialization:</span>
            <span className="font-semibold text-cyan-200">{specializationName}</span>
          </div>
        </div>

        {/* Prominent Salary / Package (LPA) Display */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
              parsedSalary.isDisclosed ? 'bg-emerald-950 border border-emerald-800/60 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                Salary / Package (LPA)
              </span>
              {parsedSalary.isDisclosed ? (
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {parsedSalary.formattedDisplay}
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400 italic">
                  Salary not disclosed
                </span>
              )}
            </div>
          </div>

          {parsedSalary.isDisclosed ? (
            <span className="text-[10px] font-mono text-emerald-500/90 bg-emerald-950/50 border border-emerald-900/60 px-2 py-0.5 rounded">
              Advertised Package
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1" title="Salary not publicly disclosed by employer">
              <Info className="w-3 h-3 text-slate-500" />
              <span>Not Disclosed</span>
            </span>
          )}
        </div>

        {/* Location, Work Mode & Job Type */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{job.location}</span>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <span>Work Mode: <strong className="text-white font-medium">{job.workMode}</strong></span>
          </div>
          {job.jobType && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{job.jobType}</span>
            </>
          )}
        </div>

        {/* Requirements Details: Experience Required */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-mono">
              Experience Required
            </span>
            <span className="text-slate-200 font-medium">
              {job.experienceRequired}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-mono">
              Education Required
            </span>
            <span className="text-slate-300 font-medium truncate block" title={job.educationRequired}>
              {job.educationRequired}
            </span>
          </div>
        </div>

        {/* Key Competencies / Skills */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-mono mb-1">
            Required Competencies:
          </span>
          <div className="text-slate-300 text-xs flex flex-wrap gap-x-2 gap-y-1 font-mono">
            {job.skills.map((skill, sIdx) => (
              <span key={skill} className="text-slate-300">
                {skill}
                {sIdx < job.skills.length - 1 && <span className="text-slate-600 ml-2">/</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Application Deadline */}
        {job.applicationDeadline && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400/90 font-mono">
            <Clock className="w-3 h-3" />
            <span>Deadline: {job.applicationDeadline}</span>
          </div>
        )}
      </div>

      {/* Action Footer: View Details & Apply Now */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={() => onOpenDetails(job)}
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-slate-800"
        >
          <span>Job Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer hover:translate-x-0.5"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
};
