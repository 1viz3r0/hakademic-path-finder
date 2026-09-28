import React from 'react';
import { GraduationCap, Award, BookOpen, Wrench, ArrowRight, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';
import { EDUCATION_OPTIONS, EducationOption } from '../data/careerData';
import { EducationLevel } from '../types';

interface EducationStepProps {
  selectedEducation: EducationLevel | null;
  age: number | null;
  onSelect: (level: EducationLevel) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({
  selectedEducation,
  age,
  onSelect,
  onBack,
  onContinue,
}) => {
  const getIcon = (id: EducationLevel) => {
    switch (id) {
      case 'UG':
        return <GraduationCap className="w-6 h-6 text-indigo-400" />;
      case 'PG':
        return <Award className="w-6 h-6 text-violet-400" />;
      case '12TH':
        return <BookOpen className="w-6 h-6 text-amber-400" />;
      case 'DIPLOMA':
        return <Wrench className="w-6 h-6 text-emerald-400" />;
    }
  };

  const isDirect = selectedEducation === '12TH' || selectedEducation === 'DIPLOMA';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Age</span>
        </button>

        {age && (
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Age: <strong className="text-slate-200">{age} years</strong></span>
          </span>
        )}
      </div>

      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Select Your Highest Education Level
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Choose from the 4 primary education pathways to discover verified, real-world job openings tailored precisely to your background.
        </p>
      </div>

      {/* Grid of the 4 Education Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {EDUCATION_OPTIONS.map((option: EducationOption) => {
          const isSelected = selectedEducation === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`relative p-5 sm:p-6 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-indigo-600/20' : 'bg-slate-800/80'}`}>
                    {getIcon(option.id)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">
                      {option.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {option.title}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  {option.tagline}
                </p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {option.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {option.nextStepType === 'degrees'
                    ? 'Degree → Technical Skills → Domain'
                    : 'Technical Skills → Domain → Jobs'}
                </span>
                <span className={`font-medium ${isSelected ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  Select
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {selectedEducation && (
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Selected Pathway
            </p>
            <p className="text-sm font-bold text-white mt-0.5">
              {EDUCATION_OPTIONS.find((e) => e.id === selectedEducation)?.title}
            </p>
            {isDirect ? (
              <p className="text-xs text-emerald-400 mt-0.5">
                Next: Select your Technical Skill track (Web Dev, Networking, Cybersecurity, Data Analytics, Cloud, or AI/ML).
              </p>
            ) : (
              <p className="text-xs text-indigo-300 mt-0.5">
                Next: Select your specific {selectedEducation === 'UG' ? "Bachelor's" : "Master's"} degree.
              </p>
            )}
          </div>

          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:translate-x-0.5"
          >
            <span>{isDirect ? 'Continue to Technical Skills' : 'Continue to Degree Selection'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
