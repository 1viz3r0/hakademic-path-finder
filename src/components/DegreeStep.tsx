import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Search, BookOpen } from 'lucide-react';
import { UG_DEGREES, PG_DEGREES } from '../data/careerData';
import { DegreeOption, EducationLevel } from '../types';

interface DegreeStepProps {
  educationLevel: EducationLevel;
  selectedDegree: string | null;
  onSelectDegree: (degreeName: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const DegreeStep: React.FC<DegreeStepProps> = ({
  educationLevel,
  selectedDegree,
  onSelectDegree,
  onBack,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Strictly filter Bachelor's for UG, Master's for PG
  const rawDegrees: DegreeOption[] = educationLevel === 'UG' ? UG_DEGREES : PG_DEGREES;
  const isUG = educationLevel === 'UG';

  const filteredDegrees = rawDegrees.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Education</span>
        </button>

        <span className="text-xs text-indigo-400 font-medium bg-indigo-950/60 border border-indigo-900/50 px-2.5 py-1 rounded-md">
          {isUG ? "Bachelor's Degree Options Only" : "Master's Degree Options Only"}
        </span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Select Your {isUG ? "Bachelor's" : "Master's"} Degree
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          {isUG
            ? "Showing accredited Bachelor's degrees (UG) recognized by tech, banking, and product recruiters."
            : "Showing accredited Master's degrees and postgraduate diplomas (PG) for advanced hiring tracks."}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md mx-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${isUG ? "Bachelor's" : "Master's"} degrees (e.g. B.Tech, BCA, MCA)...`}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Degrees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredDegrees.map((degree) => {
          const isSelected = selectedDegree === degree.name;

          return (
            <div
              key={degree.id}
              onClick={() => onSelectDegree(degree.name)}
              className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {degree.category}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {degree.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-snug line-clamp-2">
                  {degree.fullName}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Degree Course</span>
                <span className={`font-semibold ${isSelected ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {isSelected ? 'Selected' : 'Choose'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDegrees.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No degrees matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-indigo-400 hover:underline cursor-pointer"
          >
            Clear search filter
          </button>
        </div>
      )}

      {/* Action Footer */}
      {selectedDegree && (
        <div className="mt-8 p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Selected Degree
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              {selectedDegree}
            </p>
            <p className="text-xs text-indigo-300 mt-0.5">
              Next: Select your core Technical Skill track.
            </p>
          </div>

          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:translate-x-0.5"
          >
            <span>Proceed to Technical Skills</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
