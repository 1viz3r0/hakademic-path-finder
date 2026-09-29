/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EducationLevel,
  FlowStep,
  JobOpportunity,
  TechnicalSkillId,
  UserCareerProfile,
} from './types';
import { INITIAL_JOBS_DATABASE } from './data/jobsData';
import { PATH_FINDER_JOBS } from './data/pathFinderJobs';
import { Header } from './components/Header';
import { StepBar } from './components/StepBar';
import { AgeStep } from './components/AgeStep';
import { EducationStep } from './components/EducationStep';
import { DegreeStep } from './components/DegreeStep';
import { TechnicalSkillStep } from './components/TechnicalSkillStep';
import { DomainStep } from './components/DomainStep';
import { SalaryStep } from './components/SalaryStep';
import { JobResultsView } from './components/JobResultsView';
import { HackademicLogo } from './components/HackademicLogo';
import { ExpectedSalaryRange } from './types';

export default function App() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('age');
  const [isLightTheme, setIsLightTheme] = useState(false);

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };
  const [profile, setProfile] = useState<UserCareerProfile>({
    age: null,
    education: null,
    degree: null,
    technicalSkill: null,
    domain: null,
    expectedSalary: null,
    experience: 'All',
    preferredLocation: 'All Locations',
    workMode: 'All',
  });

  const [jobs, setJobs] = useState<JobOpportunity[]>([...PATH_FINDER_JOBS, ...INITIAL_JOBS_DATABASE]);

  // Handlers for Age selection
  const handleAgeContinue = (age: number) => {
    setProfile((prev) => ({ ...prev, age }));
    setCurrentStep('education');
  };

  // Handlers for Education selection
  const handleSelectEducation = (level: EducationLevel) => {
    // If switching between direct flow and UG/PG, reset subsequent fields
    setProfile((prev) => ({
      ...prev,
      education: level,
      degree: null,
      technicalSkill: null,
      domain: null,
      expectedSalary: null,
    }));
  };

  const handleEducationContinue = () => {
    if (!profile.education) return;
    if (profile.education === '12TH' || profile.education === 'DIPLOMA') {
      // 12th Pass / Diploma users proceed directly to Technical Skills!
      setCurrentStep('skill');
    } else {
      // UG / PG proceed to degree selection
      setCurrentStep('degree');
    }
  };

  // Handlers for Degree selection
  const handleSelectDegree = (degreeName: string) => {
    setProfile((prev) => ({ ...prev, degree: degreeName }));
  };

  const handleDegreeContinue = () => {
    if (profile.degree) {
      setCurrentStep('skill');
    }
  };

  // Handlers for Technical Skill selection
  const handleSelectSkill = (skillId: TechnicalSkillId) => {
    // When switching technical skill, reset domain so only 1 domain of new skill is chosen
    setProfile((prev) => ({
      ...prev,
      technicalSkill: skillId,
      domain: null,
      expectedSalary: null,
    }));
  };

  const handleSkillContinue = () => {
    if (profile.technicalSkill) {
      setCurrentStep('domain');
    }
  };

  // Handlers for Domain selection (Enforcing SINGLE domain selection)
  const handleSelectDomain = (domainId: string) => {
    // Sets only one domain. Clicking another domain replaces the previous one.
    setProfile((prev) => ({
      ...prev,
      domain: domainId,
      expectedSalary: null,
    }));
  };

  const handleDomainContinue = () => {
    if (profile.domain) {
      setCurrentStep('salary');
    }
  };

  // Handlers for Salary selection
  const handleSelectSalary = (salaryId: ExpectedSalaryRange) => {
    setProfile((prev) => ({ ...prev, expectedSalary: salaryId }));
  };

  const handleSalaryContinue = () => {
    if (profile.expectedSalary) {
      setCurrentStep('jobs');
    }
  };

  // Navigation check for step bar
  const canNavigateTo = (targetStep: FlowStep): boolean => {
    if (targetStep === 'age') return true;

    const hasValidAge = profile.age !== null && profile.age >= 16 && profile.age <= 45;
    if (!hasValidAge) return false;

    if (targetStep === 'education') return true;

    const isDirect = profile.education === '12TH' || profile.education === 'DIPLOMA';

    if (isDirect) {
      if (targetStep === 'skill') return Boolean(profile.education);
      if (targetStep === 'domain') return Boolean(profile.education && profile.technicalSkill);
      if (targetStep === 'salary') return Boolean(profile.education && profile.technicalSkill && profile.domain);
      if (targetStep === 'jobs') return Boolean(profile.education && profile.technicalSkill && profile.domain && profile.expectedSalary);
      return false;
    }

    if (targetStep === 'degree') return Boolean(profile.education);
    if (targetStep === 'skill') return Boolean(profile.education && profile.degree);
    if (targetStep === 'domain') return Boolean(profile.education && profile.degree && profile.technicalSkill);
    if (targetStep === 'salary') return Boolean(profile.education && profile.degree && profile.technicalSkill && profile.domain);
    if (targetStep === 'jobs') return Boolean(profile.education && profile.degree && profile.technicalSkill && profile.domain && profile.expectedSalary);

    return false;
  };

  // Reset all
  const handleReset = () => {
    setProfile({
      age: null,
      education: null,
      degree: null,
      technicalSkill: null,
      domain: null,
      expectedSalary: null,
      experience: 'All',
      preferredLocation: 'All Locations',
      workMode: 'All',
    });
    setCurrentStep('age');
  };

  // Append AI Live jobs
  const handleAppendLiveJobs = (newJobs: JobOpportunity[]) => {
    setJobs((prev) => {
      // deduplicate by id
      const existingIds = new Set(prev.map((j) => j.id));
      const fresh = newJobs.filter((j) => !existingIds.has(j.id));
      return [...fresh, ...prev];
    });
  };

  return (
    <div className={`min-h-screen ${isLightTheme ? 'bg-[#ADD8E6]' : 'bg-slate-950'} ${isLightTheme ? 'text-slate-900' : 'text-slate-100'} flex flex-col font-sans selection:bg-indigo-600 selection:text-white`}>
      {/* Global Application Header */}
      <Header
        profile={profile}
        onReset={handleReset}
        activeStepName={currentStep}
      />

      {/* Sequential Step Progress Bar */}
      <StepBar
        currentStep={currentStep}
        educationLevel={profile.education}
        onNavigateTo={(step) => setCurrentStep(step)}
        canNavigateTo={canNavigateTo}
      />

      {/* Main Flow Container */}
      <main className="flex-1">
        {currentStep === 'age' && (
          <AgeStep
            initialAge={profile.age}
            onContinue={handleAgeContinue}
          />
        )}

        {currentStep === 'education' && (
          <EducationStep
            selectedEducation={profile.education}
            age={profile.age}
            onSelect={handleSelectEducation}
            onBack={() => setCurrentStep('age')}
            onContinue={handleEducationContinue}
          />
        )}

        {currentStep === 'degree' && profile.education && (profile.education === 'UG' || profile.education === 'PG') && (
          <DegreeStep
            educationLevel={profile.education}
            selectedDegree={profile.degree}
            onSelectDegree={handleSelectDegree}
            onBack={() => setCurrentStep('education')}
            onContinue={handleDegreeContinue}
          />
        )}

        {currentStep === 'skill' && (
          <TechnicalSkillStep
            selectedSkill={profile.technicalSkill}
            onSelectSkill={handleSelectSkill}
            onBack={() => {
              if (profile.education === '12TH' || profile.education === 'DIPLOMA') {
                setCurrentStep('education');
              } else {
                setCurrentStep('degree');
              }
            }}
            onContinue={handleSkillContinue}
            degreeName={profile.degree}
            educationLevel={profile.education}
          />
        )}

        {currentStep === 'domain' && profile.technicalSkill && (
          <DomainStep
            skillId={profile.technicalSkill}
            selectedDomainId={profile.domain}
            onSelectDomain={handleSelectDomain}
            onBack={() => setCurrentStep('skill')}
            onContinue={handleDomainContinue}
          />
        )}

        {currentStep === 'salary' && (
          <SalaryStep
            selectedSalary={profile.expectedSalary}
            onSelectSalary={handleSelectSalary}
            onBack={() => setCurrentStep('domain')}
            onContinue={handleSalaryContinue}
            profile={profile}
          />
        )}

        {currentStep === 'jobs' && (
          <JobResultsView
            profile={profile}
            jobs={jobs}
            onBack={() => setCurrentStep('salary')}
            onEditProfile={() => setCurrentStep('age')}
            onAppendLiveJobs={handleAppendLiveJobs}
          />
        )}
      </main>

      {/* Global Compact Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-full p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/25 transition-all ease-in-out"
              aria-label={isLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
              style={{ flexShrink: 0 }}
            >
              <svg
                className={isLightTheme ? 'text-slate-900' : 'text-slate-900'}
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {isLightTheme ? (
                  <path d="M20.9 9.9A12.9 12.9 0 0 1 3.1 1.2C1.6 1.2.1 2.4.1 4c0 2.3.8 5.2 2.1 7.3L1.2 23c.8.4 2 1 3.4 1h13.4c1.4 0 2.5-.7 3.4-1.1l.9-5.4a12.94 12.94 0 0 1 2.2-5.3zM9.8 11.8l1.7 4.1 5.3-3.2L9.8 11.8zm-3.1.8l-1.6 3.8 3.2-1.8L6.7 12.6z" />
                ) : (
                  <path d="M20.9 9.9A12.9 12.9 0 0 1 3.1 1.2C1.6 1.2.1 2.4.1 4c0 2.3.8 5.2 2.1 7.3L1.2 23c.8.4 2 1 3.4 1h13.4c1.4 0 2.5-.7 3.4-1.1l.9-5.4a12.94 12.94 0 0 1 2.2-5.3zM9.8 11.8l1.7 4.1 5.3-3.2L9.8 11.8zm-3.1.8l-1.6 3.8 3.2-1.8L6.7 12.6z" />
                )}
              </svg>
            </button>
            <HackademicLogo size={28} showText={false} />
            <span className="font-bold text-slate-300 tracking-wider">HACKADEMIC</span>
            <span className="text-slate-600">·</span>
            <span>Real-time verified job listings aggregated directly from LinkedIn, Naukri, Indeed, Internshala, Unstop & official company career sites.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 flex-shrink-0">
            <span>Verified Active Listings</span>
            <span>·</span>
            <span>Zero Expired Postings</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
