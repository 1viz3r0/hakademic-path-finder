import { JobSource } from '../types';

export interface PlatformSearchUrlOptions {
  domainTitle: string;
  skillName?: string;
  location?: string;
  experience?: string;
  education?: string;
}

export function buildPlatformSearchUrl(platform: string, options: PlatformSearchUrlOptions): string {
  const queryTerms = [options.domainTitle, options.location !== 'All Locations' ? options.location : '']
    .filter(Boolean)
    .join(' ');
  const encodedQuery = encodeURIComponent(queryTerms || 'Jobs');
  const encodedLocation = encodeURIComponent(options.location && options.location !== 'All Locations' ? options.location : 'India');

  switch (platform) {
    case 'LinkedIn':
      return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(options.domainTitle)}&location=${encodedLocation}&sortBy=DD`;
    case 'Naukri':
      return `https://www.naukri.com/${encodeURIComponent(options.domainTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}-jobs${options.location && options.location !== 'All Locations' ? `-in-${encodeURIComponent(options.location.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}` : ''}?sort=date`;
    case 'Indeed':
      return `https://in.indeed.com/jobs?q=${encodeURIComponent(options.domainTitle)}&l=${encodedLocation}&sort=date`;
    case 'Internshala':
      return `https://internshala.com/jobs/${encodeURIComponent(options.domainTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}-jobs`;
    case 'Unstop':
      return `https://unstop.com/jobs?searchTerm=${encodeURIComponent(options.domainTitle)}`;
    case 'Wellfound':
      return `https://wellfound.com/jobs?query=${encodeURIComponent(options.domainTitle)}`;
    case 'Official Portal':
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(`careers ${options.domainTitle} hiring now active verified apply online`)}`;
  }
}

export function getSourceColor(source: string): { bg: string; text: string; border: string } {
  switch (source) {
    case 'LinkedIn':
      return { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/40' };
    case 'Naukri':
      return { bg: 'bg-sky-950/40', text: 'text-sky-400', border: 'border-sky-800/40' };
    case 'Indeed':
      return { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-800/40' };
    case 'Internshala':
      return { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-800/40' };
    case 'Unstop':
      return { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/40' };
    case 'Wellfound':
      return { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' };
    case 'Official Portal':
      return { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-800/40' };
    default:
      return { bg: 'bg-slate-950/40', text: 'text-slate-400', border: 'border-slate-800/40' };
  }
}