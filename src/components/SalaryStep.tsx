import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, IndianRupee, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { ExpectedSalaryRange, UserCareerProfile } from '../types';
import { SALARY_OPTIONS } from '../utils/salaryUtils';
import { TECHNICAL_SKILLS } from '../data/careerData';

interface SalaryStepProps {
  selectedSalary: ExpectedSalaryRange | null;
  onSelectSalary: (salaryId: ExpectedSalaryRange) => void;
  onBack: () => void;
  onContinue: () => void;
  profile: UserCareerProfile;
}

export const SalaryStep: React.FC<SalaryStepProps> = ({
  selectedSalary,
  onSelectSalary,
  onBack,
  onContinue,
  profile,
}) => {
  const currentSkill = TECHNICAL_SKILLS.find((s) => s.id === profile.technicalSkill);
  const currentDomainObj = currentSkill?.domains.find((d) => d.id === profile.domain);
  const selectedSalaryObj = SALARY_OPTIONS.find((s) => s.id === selectedSalary);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Specialization</span>
        </button>

        {/* Pathway summary pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
          <span>{currentSkill?.name || 'Skill'}</span>
          <span className="text-slate-600">→</span>
          <strong className="text-cyan-400">{currentDomainObj?.name || 'Domain'}</strong>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50 mb-3">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Compensation Preference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Expected Salary / LPA Package
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Select your target package in <strong className="text-slate-200">Lakhs Per Annum (LPA)</strong>. The system will prioritize relevant <span className="text-cyan-400 font-medium">{currentDomainObj?.name || 'specialization'}</span> roles matching your package or higher.
        </p>
      </div>

      {/* Grid of Salary Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SALARY_OPTIONS.map((option) => {
          const isSelected = selectedSalary === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelectSalary(option.id)}
              className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'
                  }`}>
                    <IndianRupee className="w-4 h-4" />
                  </div>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {option.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {option.label}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {option.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {option.minLpa === 0 ? 'Up to ₹2L' : option.maxLpa === 999 ? '₹20L+' : `₹${option.minLpa}L - ₹${option.maxLpa}L`}
                </span>
                <span className={`font-semibold text-xs ${isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {isSelected ? 'Active Target' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality & Transparency Guarantee Notice */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <strong className="text-slate-200 block mb-0.5">Strict Salary Transparency Policy</strong>
          <span>
            The system prioritizes verified jobs offering your selected salary or higher. If a company listing does not disclose compensation, it is clearly labeled <strong className="text-slate-300">“Salary not disclosed”</strong> without synthetic or estimated figures.
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Target Compensation:
          </span>
          {selectedSalaryObj ? (
            <p className="text-base font-bold text-white mt-0.5">
              Target Package: <span className="text-emerald-400 font-mono">{selectedSalaryObj.label}</span>
              <span className="text-slate-400 font-normal text-xs ml-2">
                (Prioritizing {selectedSalaryObj.label} or higher)
              </span>
            </p>
          ) : (
            <p className="text-xs text-amber-400/90 mt-0.5">
              Please choose your expected salary package above to continue.
            </p>
          )}
        </div>

        <button
          onClick={onContinue}
          disabled={!selectedSalary}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:cursor-not-allowed hover:translate-x-0.5"
        >
          <span>Find Matching Opportunities</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
