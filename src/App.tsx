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
import { JobResultsView } from './components/JobResultsView';

export default function App() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('age');
  const [domains, setDomains] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserCareerProfile>({
    age: null,
    education: null,
    degree: null,
    technicalSkill: null,
    domain: null,
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
    setProfile((prev) => ({
      ...prev,
      technicalSkill: skillId,
      domain: null,
    }));
  };

  const handleSkillContinue = () => {
    if (profile.technicalSkill) {
      setCurrentStep('domain');
    }
  };

  // Handlers for Domain selection (Max 3 domains)
  const handleSelectDomain = (domainId: string) => {
    setProfile((prev) => {
      const currentDomains = prev.domain
        ? Array.isArray(prev.domain) ? prev.domain : [prev.domain]
        : [];

      // Toggle: remove if already selected
      if (currentDomains.includes(domainId)) {
        const newDomains = currentDomains.filter(d => d !== domainId);
        return {
          ...prev,
          domain: newDomains.length === 1 ? newDomains[0] : newDomains.length > 0 ? newDomains : null,
        };
      }

      // Max 3 enforcement
      if (currentDomains.length >= 3) {
        return prev;
      }

      // Add new domain
      const newDomains = [...currentDomains, domainId];
      return {
        ...prev,
        domain: newDomains.length === 1 ? newDomains[0] : newDomains,
      };
    });
  };

  const handleDomainContinue = () => {
    const currentDomains = profile.domain
      ? Array.isArray(profile.domain) ? profile.domain : [profile.domain]
      : [];
    if (currentDomains.length > 0) {
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
      if (targetStep === 'jobs') return Boolean(profile.education && profile.technicalSkill && profile.domain);
      return false;
    }

    if (targetStep === 'degree') return Boolean(profile.education);
    if (targetStep === 'skill') return Boolean(profile.education && profile.degree);
    if (targetStep === 'domain') return Boolean(profile.education && profile.degree && profile.technicalSkill);
    if (targetStep === 'jobs') return Boolean(profile.education && profile.degree && profile.technicalSkill && profile.domain);

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
    <div className="min-h-screen bg-[#0D1B2A] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
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
            selectedDomainIds={Array.isArray(profile.domain) ? profile.domain : profile.domain ? [profile.domain] : []}
            onSelectDomain={handleSelectDomain}
            onBack={() => setCurrentStep('skill')}
            onContinue={handleDomainContinue}
          />
        )}

        {currentStep === 'jobs' && (
          <JobResultsView
            profile={profile}
            jobs={jobs}
            onBack={() => setCurrentStep('domain')}
            onEditProfile={() => setCurrentStep('age')}
            onAppendLiveJobs={handleAppendLiveJobs}
          />
        )}
      </main>

      {/* Terms and Conditions */}
      <div className="text-center py-6 px-4">
        <button
          onClick={() => window.open('/terms', '_blank')}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
        >
          Terms and Conditions
        </button>
      </div>
    </div>
  );
}