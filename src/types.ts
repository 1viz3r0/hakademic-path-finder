export type EducationLevel = 'UG' | 'PG' | '12TH' | 'DIPLOMA';

export interface DegreeOption {
  id: string;
  name: string;
  fullName: string;
  category: 'Engineering' | 'Computer Applications' | 'Sciences' | 'Management' | 'Commerce' | 'Arts & Design' | 'Other';
}

export type TechnicalSkillId =
  | 'cybersecurity'
  | 'web_development'
  | 'networking'
  | 'data_analytics'
  | 'cloud_computing'
  | 'ai_ml'
  | 'database'
  | 'ui_ux'
  | 'digital_marketing'
  | 'programming_software';

export interface TechnicalSkill {
  id: TechnicalSkillId;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  domains: DomainOption[];
}

export interface DomainOption {
  id: string;
  name: string;
  description: string;
  popularRoles: string[];
  keyTools: string[];
}

export type WorkMode = 'All' | 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceRange = 'All' | 'Fresher (0-1 yr)' | '1-3 Years' | '3-5 Years' | '5+ Years';
export type PostedTimeFilter = 'all' | 'today' | '3days' | '7days' | '30days';

export type JobSource =
  | 'LinkedIn'
  | 'Internshala'
  | 'Naukri'
  | 'Indeed'
  | 'Unstop'
  | 'Wellfound'
  | 'Official Portal';

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogoText?: string;
  companyType: 'Product' | 'Services' | 'Startup' | 'MNC' | 'Govt/PSU';
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  jobType?: 'Full-time' | 'Contract' | 'Internship' | 'Trainee' | string;
  experienceRequired: string;
  educationRequired: string;
  skills: string[];
  salary?: string;
  postedDate: string; // e.g. "Today (4h ago)", "1 day ago"
  postedDaysAgo: number; // 0 for today, 1, 2, etc.
  applicationDeadline?: string;
  source: JobSource;
  applyUrl: string;
  isVerified: boolean;
  technicalSkillId?: TechnicalSkillId;
  domainId?: string;
  educationLevel: EducationLevel[];
  description: string;
  keyResponsibilities: string[];
  openingsCount?: number;
}

export type FlowStep = 'age' | 'education' | 'degree' | 'skill' | 'domain' | 'salary' | 'jobs';

export type ExpectedSalaryRange =
  | 'below_2_lpa'
  | '2_to_3_lpa'
  | '3_to_5_lpa'
  | '5_to_7_lpa'
  | '7_to_10_lpa'
  | '10_to_15_lpa'
  | '15_to_20_lpa'
  | '20_plus_lpa';

export interface SalaryOption {
  id: ExpectedSalaryRange;
  label: string;
  minLpa: number;
  maxLpa: number;
  description: string;
  badge?: string;
}

export interface UserCareerProfile {
  age: number | null;
  education: EducationLevel | null;
  degree: string | null;
  technicalSkill: TechnicalSkillId | null;
  domain: string | null;
  expectedSalary: ExpectedSalaryRange | null;
  experience: ExperienceRange;
  preferredLocation: string;
  workMode: WorkMode;
}
