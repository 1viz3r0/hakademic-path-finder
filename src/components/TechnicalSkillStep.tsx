import React from 'react';
import {
  ShieldAlert,
  Code2,
  Network,
  BarChart3,
  Cloud,
  Cpu,
  Database,
  Palette,
  TrendingUp,
  Terminal,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { TECHNICAL_SKILLS } from '../data/careerData';
import { EducationLevel, TechnicalSkillId } from '../types';

interface TechnicalSkillStepProps {
  selectedSkill: TechnicalSkillId | null;
  onSelectSkill: (skillId: TechnicalSkillId) => void;
  onBack: () => void;
  onContinue: () => void;
  degreeName: string | null;
  educationLevel: EducationLevel | null;
}

export const TechnicalSkillStep: React.FC<TechnicalSkillStepProps> = ({
  selectedSkill,
  onSelectSkill,
  onBack,
  onContinue,
  degreeName,
  educationLevel,
}) => {
  const getSkillIcon = (id: TechnicalSkillId) => {
    switch (id) {
      case 'cybersecurity':
        return <ShieldAlert className="w-6 h-6 text-rose-400" />;
      case 'web_development':
        return <Code2 className="w-6 h-6 text-indigo-400" />;
      case 'networking':
        return <Network className="w-6 h-6 text-emerald-400" />;
      case 'data_analytics':
        return <BarChart3 className="w-6 h-6 text-amber-400" />;
      case 'cloud_computing':
        return <Cloud className="w-6 h-6 text-sky-400" />;
      case 'ai_ml':
        return <Cpu className="w-6 h-6 text-violet-400" />;
      case 'database':
        return <Database className="w-6 h-6 text-cyan-400" />;
      case 'ui_ux':
        return <Palette className="w-6 h-6 text-pink-400" />;
      case 'digital_marketing':
        return <TrendingUp className="w-6 h-6 text-orange-400" />;
      case 'programming_software':
        return <Terminal className="w-6 h-6 text-teal-400" />;
    }
  };

  const isDirect = educationLevel === '12TH' || educationLevel === 'DIPLOMA';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isDirect ? 'Back to Education' : 'Back to Degree'}</span>
        </button>

        {degreeName ? (
          <span className="text-xs text-slate-400 font-mono">
            Candidate Degree: <strong className="text-slate-200">{degreeName}</strong>
          </span>
        ) : educationLevel ? (
          <span className="text-xs text-slate-400 font-mono">
            Candidate Education: <strong className="text-slate-200">{educationLevel === '12TH' ? '12th Pass' : 'Diploma'}</strong>
          </span>
        ) : null}
      </div>

      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Select Your Technical Skill Track
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Choose the foundational technical discipline aligned with your degree and career focus. The next step will reveal only domains specific to this skill.
        </p>
      </div>

      {/* Grid of 6 Technical Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {TECHNICAL_SKILLS.map((skill) => {
          const isSelected = selectedSkill === skill.id;

          return (
            <div
              key={skill.id}
              onClick={() => onSelectSkill(skill.id)}
              className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-indigo-950/60' : 'bg-slate-800/80'}`}>
                    {getSkillIcon(skill.id)}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  {skill.domains.length} specialized domains
                </span>
                <span className={`font-semibold ${isSelected ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {selectedSkill && (
        <div className="mt-8 p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Selected Track
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              {TECHNICAL_SKILLS.find((s) => s.id === selectedSkill)?.name}
            </p>
            <p className="text-xs text-indigo-300 mt-0.5">
              Next: Select 1 dedicated domain within {TECHNICAL_SKILLS.find((s) => s.id === selectedSkill)?.name}.
            </p>
          </div>

          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:translate-x-0.5"
          >
            <span>Proceed to Specialized Domains</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
