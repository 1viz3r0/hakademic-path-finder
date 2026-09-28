import sqlDump from '../../db/path_finder_schema_and_seed.sql?raw';
import { EducationLevel, JobOpportunity, TechnicalSkillId } from '../types';
import { parseSqlInserts } from './sqlDumpParser';
import { TECHNICAL_SKILLS } from './careerData';

const rows = parseSqlInserts(sqlDump);

const careers = (rows.careers || []).map((r) => ({
  careerId: Number(r[0]),
  careerName: String(r[1]),
  domainId: Number(r[2]),
  description: String(r[3] || ''),
  typicalWork: String(r[4] || ''),
  workEnvironment: String(r[6] || ''),
  higherStudy: String(r[10] || ''),
  advancement: String(r[11] || ''),
  notes: String(r[12] || ''),
}));

const careerEducation = (rows.career_education || []).map((r) => ({
  careerId: Number(r[0]),
  educationLevel: String(r[1] || ''),
}));

const careerSkills = (rows.career_skills || []).map((r) => ({
  careerId: Number(r[0]),
  skillId: Number(r[1]),
}));

const skills = (rows.skills || []).map((r) => ({
  skillId: Number(r[0]),
  skillName: String(r[1]),
}));

const opportunities = (rows.career_opportunities || []).map((r) => ({
  opportunityId: Number(r[0]),
  careerId: Number(r[1]),
  roleName: String(r[2]),
  seniority: String(r[3] || 'Entry'),
  industry: String(r[4] || 'Technology'),
  opportunityType: String(r[5] || 'Job'),
  typicalExperience: String(r[6] || '0-2 years'),
  workMode: String(r[7] || 'Office / hybrid'),
  description: String(r[8] || ''),
}));

const skillNamesByCareer = new Map<number, string[]>();
for (const link of careerSkills) {
  const skill = skills.find((s) => s.skillId === link.skillId);
  if (!skill) continue;
  const list = skillNamesByCareer.get(link.careerId) || [];
  list.push(skill.skillName);
  skillNamesByCareer.set(link.careerId, list);
}

const educationByCareer = new Map<number, EducationLevel[]>();
for (const row of careerEducation) {
  const mapped: EducationLevel | null =
    row.educationLevel === '12th'
      ? '12TH'
      : row.educationLevel === 'Diploma'
        ? 'DIPLOMA'
        : row.educationLevel === 'Bachelor'
          ? 'UG'
          : row.educationLevel === 'Master'
            ? 'PG'
            : null;
  if (!mapped) continue;
  const list = educationByCareer.get(row.careerId) || [];
  if (!list.includes(mapped)) list.push(mapped);
  educationByCareer.set(row.careerId, list);
}

const CAREER_TO_SKILL: Record<number, TechnicalSkillId> = {
  1: 'programming_software',
  2: 'web_development',
  3: 'programming_software',
  4: 'cloud_computing',
  5: 'cloud_computing',
  6: 'data_analytics',
  7: 'data_analytics',
  8: 'ai_ml',
  9: 'ai_ml',
  10: 'ai_ml',
  11: 'cybersecurity',
  12: 'cybersecurity',
  13: 'networking',
  14: 'cybersecurity',
  23: 'digital_marketing',
  24: 'digital_marketing',
  26: 'digital_marketing',
  27: 'ui_ux',
  28: 'ui_ux',
};

const DOMAIN_CAREER_IDS: Record<string, number[]> = {
  ethical_hacking: [12],
  penetration_testing: [12],
  web_application_security: [12],
  network_security_cyber: [13, 11],
  cloud_security_cyber: [14],
  application_security: [12],
  soc_security_operations: [11],
  vulnerability_assessment: [12],
  digital_forensics: [11],
  incident_response: [11],
  malware_analysis: [11],
  threat_intelligence: [11],
  security_auditing: [11, 14],
  grc_compliance: [11],
  identity_access_management: [14, 11],
  devsecops: [14, 4],
  mobile_security: [12, 3],
  api_security: [12],
  frontend_development: [2],
  backend_development: [1, 2],
  full_stack_development: [2, 1],
  react_js: [2],
  angular: [2],
  vue_js: [2],
  node_js: [2, 1],
  python_development_web: [2, 1],
  php_development: [2],
  laravel: [2],
  wordpress: [2],
  ecommerce_development: [2],
  api_development_web: [1, 2],
  web_application_development: [2],
  ui_development_web: [2, 27],
  network_administration: [13],
  network_security_net: [13, 11],
  routing_switching: [13],
  cisco_networking: [13],
  network_troubleshooting: [13],
  firewall_administration: [13, 11],
  vpn_remote_access: [13],
  wireless_networking: [13],
  network_monitoring: [13],
  infrastructure_management: [13, 5],
  data_center_networking: [13],
  cloud_networking: [13, 5],
  voip_network_communication: [13],
  data_analyst: [6],
  business_intelligence: [7],
  data_visualization: [6, 7],
  power_bi: [7, 6],
  tableau: [7, 6],
  excel_analytics: [6],
  sql_analytics: [6],
  python_data_analytics: [6, 8],
  statistical_analysis: [6, 8],
  reporting_dashboards: [7, 6],
  business_analytics: [6, 7],
  data_cleaning: [6],
  data_mining: [6, 8],
  aws: [5],
  microsoft_azure: [5],
  google_cloud: [5],
  cloud_administration: [5],
  cloud_infrastructure: [5],
  cloud_security_cloud: [14, 5],
  cloud_networking_cloud: [5, 13],
  devops_cloud: [4],
  cloud_migration: [5],
  serverless_computing: [5],
  kubernetes: [4, 5],
  docker: [4],
  infrastructure_as_code: [4, 5],
  machine_learning: [9],
  deep_learning: [9, 10],
  generative_ai: [10],
  natural_language_processing: [10, 9],
  computer_vision: [9, 10],
  ai_engineering: [10],
  data_science: [8],
  predictive_analytics: [8, 6],
  ai_automation: [10],
  large_language_models: [10],
  mlops: [9, 4],
  recommendation_systems: [8, 9],
  sql_db: [1, 6],
  mysql_db: [1, 6],
  postgresql_db: [1, 6],
  mongodb_db: [1],
  oracle_database: [1, 6],
  database_administration: [1, 6],
  database_security: [11, 1],
  database_development: [1],
  data_engineering: [6, 8],
  etl: [6, 7],
  data_warehousing: [7, 6],
  database_optimization: [1, 6],
  ui_design: [27],
  ux_design: [27],
  product_design: [27],
  user_research: [27],
  interaction_design: [27],
  wireframing: [27],
  prototyping: [27],
  design_systems: [27],
  mobile_app_design: [27, 3],
  web_design: [27, 2],
  usability_testing: [27],
  seo: [24],
  sem: [23],
  social_media_marketing: [23],
  content_marketing: [26, 23],
  performance_marketing: [23],
  email_marketing: [23],
  affiliate_marketing: [23],
  influencer_marketing: [23],
  google_ads: [23],
  meta_ads: [23],
  analytics_conversion_optimization: [23, 6],
  brand_marketing: [23],
  python_programming: [1, 3],
  java_programming: [1],
  c_programming: [1],
  cpp_programming: [1],
  javascript_programming: [2, 1],
  typescript_programming: [2, 1],
  dotnet_csharp: [1],
  software_development: [1],
  application_development: [1, 3],
  mobile_app_development: [3],
  android_development: [3],
  ios_development: [3],
  api_development_prog: [1, 2],
  software_testing_qa: [1],
  automation_testing: [1],
};

function careerIdsForSkill(skillId: TechnicalSkillId): number[] {
  return Object.entries(CAREER_TO_SKILL)
    .filter(([, skill]) => skill === skillId)
    .map(([id]) => Number(id));
}

function mapWorkMode(raw: string): JobOpportunity['workMode'] {
  const text = raw.toLowerCase();
  if (text.includes('remote') && !text.includes('office') && !text.includes('hybrid') && !text.includes('field')) {
    return 'Remote';
  }
  if (text.includes('hybrid') || (text.includes('remote') && text.includes('office'))) {
    return 'Hybrid';
  }
  if (text.includes('remote')) return 'Remote';
  return 'On-site';
}

function mapJobType(raw: string): string {
  const text = raw.toLowerCase();
  if (text.includes('internship')) return 'Internship';
  if (text.includes('apprentice')) return 'Trainee';
  if (text.includes('contract')) return 'Contract';
  return 'Full-time';
}

function salaryForSeniority(seniority: string, experience: string): string {
  const text = `${seniority} ${experience}`.toLowerCase();
  if (text.includes('experienced') || text.includes('3+')) return '₹10.0 - 16.0 LPA';
  if (text.includes('early career') || text.includes('1-5')) return '₹6.0 - 9.5 LPA';
  if (text.includes('0-3')) return '₹4.0 - 6.5 LPA';
  return '₹3.0 - 5.0 LPA';
}

function companyTypeForIndustry(industry: string): JobOpportunity['companyType'] {
  const text = industry.toLowerCase();
  if (text.includes('startup')) return 'Startup';
  if (text.includes('gov') || text.includes('public')) return 'Govt/PSU';
  if (text.includes('saas') || text.includes('product')) return 'Product';
  if (text.includes('consult')) return 'Services';
  return 'MNC';
}

const jobs: JobOpportunity[] = [];

for (const skill of TECHNICAL_SKILLS) {
  for (const domain of skill.domains) {
    const mappedIds = DOMAIN_CAREER_IDS[domain.id] || careerIdsForSkill(skill.id);
    const uniqueCareerIds = [...new Set(mappedIds.length > 0 ? mappedIds : careerIdsForSkill(skill.id))];

    for (const careerId of uniqueCareerIds) {
      const career = careers.find((c) => c.careerId === careerId);
      if (!career) continue;
      const educationLevel = educationByCareer.get(careerId) || ['UG', 'PG', '12TH', 'DIPLOMA'];
      const skillList = skillNamesByCareer.get(careerId) || [skill.name, domain.name];

      const careerOpps = opportunities.filter((o) => o.careerId === careerId);
      for (const opp of careerOpps) {
        const encoded = encodeURIComponent(`${opp.roleName} ${domain.name} jobs India`);
        jobs.push({
          id: `pathfinder-${opp.opportunityId}-${skill.id}-${domain.id}`,
          title: opp.roleName,
          company: `${career.careerName} Pathway`,
          companyType: companyTypeForIndustry(opp.industry),
          location: 'India (multiple cities)',
          workMode: mapWorkMode(opp.workMode),
          jobType: mapJobType(opp.opportunityType),
          experienceRequired: opp.typicalExperience,
          educationRequired: educationLevel.join(' / '),
          skills: skillList.slice(0, 6),
          salary: salaryForSeniority(opp.seniority, opp.typicalExperience),
          postedDate: 'Today (pathway match)',
          postedDaysAgo: 0,
          applicationDeadline: 'Rolling / Open',
          source: 'Official Portal',
          applyUrl: `https://www.linkedin.com/jobs/search/?keywords=${encoded}`,
          isVerified: true,
          technicalSkillId: skill.id,
          domainId: domain.id,
          educationLevel,
          description: `${career.description} ${opp.description} Typical work: ${career.typicalWork}`,
          keyResponsibilities: [
            career.typicalWork,
            `Advancement: ${career.advancement}`,
            career.notes || `Industry: ${opp.industry}`,
          ],
          openingsCount: 4,
        });
      }
    }
  }
}

export const PATH_FINDER_JOBS: JobOpportunity[] = jobs;
