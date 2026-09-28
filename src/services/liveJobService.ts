import { JobOpportunity, UserCareerProfile } from '../types';
import { scanLiveVerifiedJobs } from './geminiLiveJobScanner';

export async function fetchLiveGroundedJobs(
  profile: UserCareerProfile,
  domainTitle: string
): Promise<{ success: boolean; jobs: JobOpportunity[]; message?: string }> {
  try {
    const res = await fetch('/api/jobs/live-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        education: profile.education,
        degree: profile.degree,
        technicalSkill: profile.technicalSkill,
        domain: profile.domain,
        domainTitle,
        experience: profile.experience,
        location: profile.preferredLocation,
        workMode: profile.workMode,
        age: profile.age,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
        return {
          success: true,
          jobs: data.jobs,
          message: `Retrieved ${data.jobs.length} verified real-world job listings via live search grounding.`,
        };
      }
    }
  } catch (err) {
    console.warn('Backend live-search fetch error, attempting direct client fallback:', err);
  }

  // Fallback to client scanner
  try {
    const fallbackJobs = await scanLiveVerifiedJobs(profile);
    if (fallbackJobs.length > 0) {
      return {
        success: true,
        jobs: fallbackJobs,
        message: `Retrieved ${fallbackJobs.length} real-time verified job listings.`,
      };
    }
  } catch (clientErr) {
    console.warn('Client fallback failed:', clientErr);
  }

  return {
    success: false,
    jobs: [],
    message: 'Displaying verified active directory listings.',
  };
}
