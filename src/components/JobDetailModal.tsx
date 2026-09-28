import React from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import { JobOpportunity } from '../types';
import { getSourceColor } from '../services/jobPlatformLinks';

interface JobDetailModalProps {
  job: JobOpportunity | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  const sourceStyle = getSourceColor(job.source);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-base flex-shrink-0">
              {job.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-300">{job.company}</span>
                <span className="text-slate-600">·</span>
                <span className={`text-xs font-medium ${sourceStyle.text}`}>via {job.source}</span>
                {job.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Active Listing
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {job.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Key Quick Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-mono">Location</span>
              <span className="text-slate-200 font-medium">{job.location}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-mono">Work Mode</span>
              <span className="text-slate-200 font-medium">{job.workMode}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-mono">Job Type</span>
              <span className="text-indigo-300 font-medium">{job.jobType || 'Full-time'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-mono">Experience</span>
              <span className="text-slate-200 font-medium">{job.experienceRequired}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-mono">Salary Package</span>
              <span className="text-emerald-400 font-semibold">{job.salary || 'Competitive Industry'}</span>
            </div>
          </div>

          {/* Education Required */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Required Education</span>
            </h4>
            <p className="text-sm text-slate-200 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
              {job.educationRequired}
            </p>
          </div>

          {/* Role Overview */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1.5">
              Role Summary & Mission
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-emerald-400" />
                <span>Day-to-day Responsibilities</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {job.keyResponsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Required */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">
              Key Technical Stack & Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-mono bg-slate-800 text-slate-200 rounded-md border border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Status, Posting time & Deadline */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">Posted Timeline:</span>
              <span className="text-slate-300 font-medium">{job.postedDate}</span>
            </div>
            {job.applicationDeadline && (
              <div className="space-y-1">
                <span className="text-slate-500 block text-[11px]">Application Deadline:</span>
                <span className="text-amber-400 font-semibold">{job.applicationDeadline}</span>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">Verification Status:</span>
              <span className="text-emerald-400 font-medium">Original source active & hiring</span>
            </div>
          </div>
        </div>

        {/* Footer with Apply Link */}
        <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Directly redirects to original verified listing on <strong className="text-slate-200">{job.source}</strong>.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Apply on {job.source}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
