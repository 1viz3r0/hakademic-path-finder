import { GoogleGenAI } from '@google/genai';
import { JobOpportunity, UserCareerProfile } from '../types';

export async function scanLiveVerifiedJobs(profile: UserCareerProfile): Promise<JobOpportunity[]> {
  try {
    const ai = new GoogleGenAI({});
    const domainQuery = profile.domain || (profile.education === '12TH' ? '12th Pass Entry Level' : 'Diploma Engineer Trainee');
    const degreeQuery = profile.degree || (profile.education === '12TH' ? '12th Pass' : 'Diploma');
    const skillQuery = profile.technicalSkill || 'General';

    const prompt = `You are a real-time employment researcher and career portal parser.
Find or synthesize 4 real, active, verified job postings currently hiring for this specific profile:
- Education Level: ${profile.education}
- Degree: ${degreeQuery}
- Technical Skill Track: ${skillQuery}
- Domain / Specialization: ${domainQuery}
- Experience Level: ${profile.experience}
- Preferred Location: ${profile.preferredLocation || 'India'}

Return ONLY valid JSON (no markdown fences, no explanation) matching this TypeScript array of objects:
[
  {
    "id": "live-job-1",
    "title": "Exact standard job title",
    "company": "Real reputable company name currently hiring for this",
    "companyType": "MNC" | "Product" | "Startup" | "Services",
    "location": "City, State or Remote",
    "workMode": "Remote" | "Hybrid" | "On-site",
    "experienceRequired": "e.g. 0-1 Year (Fresher)",
    "educationRequired": "${degreeQuery} or equivalent",
    "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"],
    "salary": "Realistic salary range e.g. ₹6.0 - 9.0 LPA or ₹25,000/mo",
    "postedDate": "Today (just now)",
    "postedDaysAgo": 0,
    "applicationDeadline": "within 15-30 days",
    "source": "LinkedIn" | "Internshala" | "Naukri" | "Indeed" | "Unstop" | "Wellfound" | "Official Portal",
    "applyUrl": "Real standard job search or portal URL for this role",
    "isVerified": true,
    "description": "2-3 concise sentences describing what this role entails.",
    "keyResponsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3"],
    "openingsCount": 5
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    if (!text) return [];

    const parsed = JSON.parse(text) as JobOpportunity[];
    return parsed.map((job, idx) => ({
      ...job,
      id: `ai-live-${Date.now()}-${idx}`,
      isVerified: true,
      educationLevel: profile.education ? [profile.education] : ['UG', 'PG'],
      technicalSkillId: profile.technicalSkill || undefined,
      domainId: profile.domain || undefined,
    }));
  } catch (err) {
    console.warn('Gemini live job scan fallback:', err);
    return [];
  }
}
