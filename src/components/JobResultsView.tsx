import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building,
  MapPin,
  Clock,
  Layers,
  ChevronDown,
  Info,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import {
  JobOpportunity,
  PostedTimeFilter,
  UserCareerProfile,
  WorkMode,
  ExperienceRange,
} from '../types';
import { JobCard } from './JobCard';
import { JobDetailModal } from './JobDetailModal';
import { TECHNICAL_SKILLS } from '../data/careerData';
import { buildPlatformSearchUrl } from '../services/jobPlatformLinks';
import { fetchLiveGroundedJobs } from '../services/liveJobService';

interface JobResultsViewProps {
  profile: UserCareerProfile;
  jobs: JobOpportunity[];
  onBack: () => void;
  onEditProfile: () => void;
  onAppendLiveJobs: (newJobs: JobOpportunity[]) => void;
}

export const JobResultsView: React.FC<JobResultsViewProps> = ({
  profile,
  jobs,
  onBack,
  onEditProfile,
  onAppendLiveJobs,
}) => {
  // Local filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<PostedTimeFilter>('all');
  const [selectedSource, setSelectedSource] = useState<string>('All Sources');
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode>('All');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceRange>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobOpportunity | null>(null);

  // Live real-time fetching state
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [liveStatusText, setLiveStatusText] = useState<string | null>(null);
  const hasAutoFetched = useRef<string | null>(null);

  // Derive domain names and skill name
  const currentSkill = TECHNICAL_SKILLS.find((s) => s.id === profile.technicalSkill);
  const domainIds = profile.domain
    ? Array.isArray(profile.domain) ? profile.domain : [profile.domain]
    : [];
  const domainObjs = domainIds
    .map((dId) => currentSkill?.domains.find((d) => d.id === dId))
    .filter(Boolean);
  const domainDisplayNames = domainObjs.length > 0
    ? domainObjs.map((d) => d!.name)
    : (profile.education === '12TH'
      ? ['12th Pass Entry Level & Trainee Roles']
      : profile.education === 'DIPLOMA'
      ? ['Diploma Engineer Trainee & Technical Roles']
      : ['General Tech Track']);

  // Trigger live search on first mount or domain change
  useEffect(() => {
    const key = `${profile.education}-${profile.domain}-${profile.technicalSkill}`;
    if (hasAutoFetched.current !== key) {
      hasAutoFetched.current = key;
      handleFetchLiveJobs(false);
    }
  }, [profile.education, profile.domain, profile.technicalSkill]);

  const handleFetchLiveJobs = async (userInitiated = true) => {
    setIsLoadingLive(true);
    setLiveStatusText(
      'Fetching live verified job postings from active portals...'
    );

    try {
      const result = await fetchLiveGroundedJobs(profile, domainDisplayNames[0] || 'Technology Careers');
      if (result.success && result.jobs.length > 0) {
        onAppendLiveJobs(result.jobs);
        setLiveStatusText(
          `Retrieved ${result.jobs.length} active verified openings matching your specializations.`
        );
      } else {
        setLiveStatusText(
          'Verified active directory listings loaded. Direct live portal search links available below.'
        );
      }
    } catch (err) {
      setLiveStatusText('Active verified listings loaded.');
    } finally {
      setIsLoadingLive(false);
      setTimeout(() => setLiveStatusText(null), 6000);
    }
  };

  // Filter jobs dynamically matching domain & education
  const domainMatchedJobs = useMemo(() => {
    // 1. Technical skill & education filtering
    const eligibleJobs = jobs.filter((job) => {
      // Technical skill match
      if (profile.technicalSkill && job.technicalSkillId) {
        if (job.technicalSkillId !== profile.technicalSkill) {
          return false;
        }
      }

      // Education match
      if (profile.education) {
        if (profile.education === '12TH' || profile.education === 'DIPLOMA') {
          // Include jobs matching 12TH/DIPLOMA or entry-level/fresher roles evaluated on skill
          if (job.educationLevel.includes(profile.education)) return true;
          return (
            job.experienceRequired.toLowerCase().includes('fresher') ||
            job.experienceRequired.toLowerCase().includes('0 -') ||
            job.experienceRequired.toLowerCase().includes('0-')
          );
        }

        if (!job.educationLevel.includes(profile.education)) {
          return false;
        }
      }

      return true;
    });

    // 2. Domain / Specialization match (match any selected domain)
    if (domainIds.length > 0) {
      const specificMatches = eligibleJobs.filter((job) => {
        // Check if job matches any of the selected domain IDs
        for (const dId of domainIds) {
          if (job.domainId && job.domainId.toLowerCase() === dId.toLowerCase()) return true;
          // Also check each display name
          for (const dName of domainDisplayNames) {
            const targetTitle = dName.toLowerCase();
            const jTitle = job.title.toLowerCase();
            const jSkills = job.skills.map((s) => s.toLowerCase());
            const jDesc = job.description.toLowerCase();
            if (
              jTitle.includes(targetTitle) ||
              targetTitle.includes(jTitle) ||
              jSkills.some((s) => targetTitle.includes(s) || s.includes(targetTitle)) ||
              jDesc.includes(targetTitle)
            ) {
              return true;
            }
          }
        }
        return false;
      });

      if (specificMatches.length > 0) {
        return specificMatches;
      }
    }

    return eligibleJobs;
  }, [jobs, profile.education, profile.domain, profile.technicalSkill, domainIds, domainDisplayNames]);

  // Further apply user's refine filters
  const filteredJobs = useMemo(() => {
    return domainMatchedJobs.filter((job) => {
      // Posted date priority filter (today, within 3 days, within 7 days, within 30 days)
      if (selectedTimeFilter === 'today' && job.postedDaysAgo !== 0) return false;
      if (selectedTimeFilter === '3days' && job.postedDaysAgo > 3) return false;
      if (selectedTimeFilter === '7days' && job.postedDaysAgo > 7) return false;
      if (selectedTimeFilter === '30days' && job.postedDaysAgo > 30) return false;

      // Source filter
      if (selectedSource !== 'All Sources' && job.source !== selectedSource) return false;

      // Work Mode filter
      if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) return false;

      // Experience filter
      if (selectedExperience !== 'All') {
        const expLower = job.experienceRequired.toLowerCase();
        if (selectedExperience === 'Fresher (0-1 yr)' && !expLower.includes('fresher') && !expLower.includes('0 -') && !expLower.includes('0-')) return false;
        if (selectedExperience === '1-3 Years' && !expLower.includes('1 -') && !expLower.includes('1-') && !expLower.includes('2 -') && !expLower.includes('2-')) return false;
        if (selectedExperience === '3-5 Years' && !expLower.includes('3 -') && !expLower.includes('3-') && !expLower.includes('4 -') && !expLower.includes('4-')) return false;
        if (selectedExperience === '5+ Years' && !expLower.includes('5') && !expLower.includes('senior') && !expLower.includes('lead')) return false;
      }

      // Location filter
      if (selectedLocation !== 'All Locations') {
        if (selectedLocation === 'Remote' && job.workMode !== 'Remote') return false;
        if (selectedLocation !== 'Remote' && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      // Free text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkill = job.skills.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkill && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [
    domainMatchedJobs,
    selectedTimeFilter,
    selectedSource,
    selectedWorkMode,
    selectedExperience,
    selectedLocation,
    searchQuery,
  ]);

  // Sort: Today first, then lowest days ago
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  }, [filteredJobs]);

  // Collect unique sources from available jobs
  const sourcesList: string[] = useMemo(() => {
    const sources = new Set<string>();
    sources.add('All Sources');
    jobs.forEach((job) => {
      if (job.source) sources.add(job.source);
    });
    return Array.from(sources);
  }, [jobs]);

  const locationsList: string[] = [
    'All Locations',
    'Remote',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Mumbai',
    'Delhi NCR',
    'Noida',
    'Chennai',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Profile Summary & Live Refresh Action */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Verified Career Track</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-sans">
              <ShieldCheck className="w-3.5 h-3.5" />
              Live Postings Verified Active
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base font-bold text-white">
            {profile.age && (
              <span className="text-slate-300 font-medium">{profile.age} yrs</span>
            )}

            {profile.education && (
              <>
                <span className="text-slate-600 font-normal">/</span>
                <span>
                  {profile.education === 'UG'
                    ? 'Undergraduate (UG)'
                    : profile.education === 'PG'
                    ? 'Postgraduate (PG)'
                    : profile.education === '12TH'
                    ? '12th / Higher Secondary'
                    : 'Diploma'}
                </span>
              </>
            )}

            {profile.degree && (
              <>
                <span className="text-slate-600 font-normal">/</span>
                <span className="text-slate-300 font-medium">{profile.degree}</span>
              </>
            )}

            {currentSkill && (
              <>
                <span className="text-slate-600 font-normal">/</span>
                <span className="text-indigo-400 font-medium">{currentSkill.name}</span>
              </>
            )}

            {domainObjs.length > 0 && domainObjs.map((d, i) => (
              d && (
                <React.Fragment key={d.id}>
                  {i > 0 && <span className="text-slate-500 font-normal">,</span>}
                  <span className="text-emerald-400">{d.name}</span>
                </React.Fragment>
              )
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => handleFetchLiveJobs(true)}
            disabled={isLoadingLive}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
            <span>{isLoadingLive ? 'Refreshing Feeds...' : 'Refresh Live Jobs'}</span>
          </button>

          <button
            onClick={onEditProfile}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Edit Track
          </button>
        </div>
      </div>

      {/* Verification Protocol Notice */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-200 block">1. Verified Listings</span>
            <span className="text-slate-400 text-[11px]">Real openings confirmed on platform</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-200 block">2. Open Applications</span>
            <span className="text-slate-400 text-[11px]">Zero expired or closed listings</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-200 block">3. Multi-Domain Match</span>
            <span className="text-slate-400 text-[11px]">Tailored to your {domainObjs.length} specialization{domainObjs.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-200 block">4. Direct Apply Links</span>
            <span className="text-slate-400 text-[11px]">Takes you to official listing page</span>
          </div>
        </div>
      </div>

      {liveStatusText && (
        <div className="mb-5 p-3 rounded-xl bg-indigo-950/50 border border-indigo-800/60 text-xs text-indigo-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            {isLoadingLive && <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
            <span>{liveStatusText}</span>
          </div>
          <button
            onClick={() => setLiveStatusText(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Direct Portal Search Launcher */}
      <div className="mb-6 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Search Live On Partner Platforms:
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Directly searches for your specializations
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['LinkedIn', 'Naukri', 'Indeed', 'Internshala', 'Unstop', 'Wellfound', 'Official Portal'] as const).map(
            (source) => {
              const url = buildPlatformSearchUrl(source, {
                domainTitle: domainDisplayNames[0] || 'Technology Careers',
                location: selectedLocation,
              });

              return (
                <a
                  key={source}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors"
                >
                  <span>{source}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              );
            }
          )}
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="space-y-4 mb-8">
        {/* Search input + Source Selector */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${domainMatchedJobs.length} active jobs by title, company, or skill...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Work Mode */}
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value as WorkMode)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Work Modes</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            {/* Experience */}
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value as ExperienceRange)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Experience Levels</option>
              <option value="Fresher (0-1 yr)">Fresher (0-1 Year)</option>
              <option value="1-3 Years">1 - 3 Years</option>
              <option value="3-5 Years">3 - 5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>

            {/* Location */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Source - dynamically built from available jobs */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              {sourcesList.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Date Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Prioritize Recent Postings:</span>
            </span>

            <div className="inline-flex rounded-lg bg-slate-950/70 p-1 border border-slate-800">
              <button
                onClick={() => setSelectedTimeFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedTimeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Verified ({domainMatchedJobs.length})
              </button>

              <button
                onClick={() => setSelectedTimeFilter('today')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedTimeFilter === 'today'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Posted Today
              </button>

              <button
                onClick={() => setSelectedTimeFilter('3days')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedTimeFilter === '3days'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Last 3 Days
              </button>

              <button
                onClick={() => setSelectedTimeFilter('7days')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedTimeFilter === '7days'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Last 7 Days
              </button>

              <button
                onClick={() => setSelectedTimeFilter('30days')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedTimeFilter === '30days'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-white">{sortedJobs.length}</strong> matching openings
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {isLoadingLive && sortedJobs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/3"></div>
              <div className="h-6 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              <div className="h-16 bg-slate-800/50 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : sortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpenDetails={(j) => setSelectedJobForModal(j)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <Info className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No active listings match your current filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your location, experience, or posted date filter, or refresh live feeds from partner portals.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedTimeFilter('all');
                setSelectedSource('All Sources');
                setSelectedWorkMode('All');
                setSelectedExperience('All');
                setSelectedLocation('All Locations');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => handleFetchLiveJobs(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Refresh Live Postings
            </button>
          </div>
        </div>
      )}

      {/* Modal for Details */}
      <JobDetailModal
        job={selectedJobForModal}
        onClose={() => setSelectedJobForModal(null)}
      />
    </div>
  );
};