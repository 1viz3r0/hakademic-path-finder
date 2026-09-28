import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Lock, Layers, Search, Sparkles } from 'lucide-react';
import { TECHNICAL_SKILLS } from '../data/careerData';
import { TechnicalSkillId } from '../types';

interface DomainStepProps {
  skillId: TechnicalSkillId;
  selectedDomainId: string | null;
  onSelectDomain: (domainId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const DomainStep: React.FC<DomainStepProps> = ({
  skillId,
  selectedDomainId,
  onSelectDomain,
  onBack,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentSkill = TECHNICAL_SKILLS.find((s) => s.id === skillId);
  const domains = currentSkill ? currentSkill.domains : [];

  const filteredDomains = useMemo(() => {
    if (!searchQuery.trim()) return domains;
    const q = searchQuery.toLowerCase();
    return domains.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.popularRoles.some((r) => r.toLowerCase().includes(q)) ||
        d.keyTools.some((t) => t.toLowerCase().includes(q))
    );
  }, [domains, searchQuery]);

  const selectedDomainObj = domains.find((d) => d.id === selectedDomainId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Technical Skills</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-rose-400 font-medium bg-rose-950/50 border border-rose-900/50 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Select Exactly 1 Specialization</span>
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>{currentSkill?.name} Specializations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Select Your Domain Specialization
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
          Choose the specific domain specialization within <strong className="text-slate-200">{currentSkill?.name}</strong>. Job recommendations will be specifically matched to this track.
        </p>

        {/* Filter bar */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${domains.length} specializations... (e.g. ${domains[0]?.name || 'role'})`}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mt-2 text-[11px] text-slate-500 font-mono">
          Showing {filteredDomains.length} of {domains.length} specializations
        </div>
      </div>

      {/* Grid of Domains for the selected Skill */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDomains.map((domain) => {
          const isSelected = selectedDomainId === domain.id;

          return (
            <div
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/50 transition-colors">
                    <Shield className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-400">
                        Select
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {domain.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {domain.description}
                </p>

                {/* Popular Roles list */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/70 text-[11px]">
                  <span className="text-slate-500 font-mono block mb-1">
                    Target Roles:
                  </span>
                  <div className="text-slate-300 flex flex-wrap gap-x-1.5 gap-y-0.5">
                    {domain.popularRoles.map((role, rIdx) => (
                      <span key={role} className="text-slate-300">
                        {role}
                        {rIdx < domain.popularRoles.length - 1 && <span className="text-slate-600 ml-1.5">·</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Tools */}
                <div className="mt-2.5 text-[11px]">
                  <span className="text-slate-500 font-mono block mb-0.5">
                    Key Tools:
                  </span>
                  <p className="text-slate-400 font-mono truncate" title={domain.keyTools.join(', ')}>
                    {domain.keyTools.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[10px]">
                  {isSelected ? 'Active specialization' : 'Click to activate'}
                </span>
                <span className={`font-semibold text-xs ${isSelected ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {isSelected ? 'Active' : 'Choose'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDomains.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 mt-4">
          <p className="text-slate-400 text-xs">No specialization matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-indigo-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-10 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Selected Domain Specialization:
          </span>
          {selectedDomainObj ? (
            <p className="text-base font-bold text-white mt-0.5">
              {currentSkill?.name} <span className="text-slate-600">→</span> <span className="text-indigo-400">{selectedDomainObj.name}</span>
            </p>
          ) : (
            <p className="text-xs text-amber-400/90 mt-0.5">
              Please choose 1 specialization above to view matching jobs.
            </p>
          )}
        </div>

        <button
          onClick={onContinue}
          disabled={!selectedDomainId}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:cursor-not-allowed hover:translate-x-0.5"
        >
          <span>Continue to Salary Expectation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
