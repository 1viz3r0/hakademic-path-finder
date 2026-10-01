import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { EducationLevel, FlowStep } from '../types';

interface StepBarProps {
  currentStep: FlowStep;
  educationLevel: EducationLevel | null;
  onNavigateTo: (step: FlowStep) => void;
  canNavigateTo: (step: FlowStep) => boolean;
}

export const StepBar: React.FC<StepBarProps> = ({
  currentStep,
  educationLevel,
  onNavigateTo,
  canNavigateTo,
}) => {
  const isDegreeRequired = educationLevel === 'UG' || educationLevel === 'PG';

  const stepsConfig: { id: FlowStep; label: string; number: number }[] = isDegreeRequired
    ? [
        { id: 'age', label: 'Age', number: 1 },
        { id: 'education', label: 'Education', number: 2 },
        { id: 'degree', label: 'Degree', number: 3 },
        { id: 'skill', label: 'Technical Skill', number: 4 },
        { id: 'domain', label: 'Specialization', number: 5 },
        { id: 'jobs', label: 'Matching Jobs', number: 6 },
      ]
    : [
        { id: 'age', label: 'Age', number: 1 },
        { id: 'education', label: 'Education', number: 2 },
        { id: 'skill', label: 'Technical Skill', number: 3 },
        { id: 'domain', label: 'Specialization', number: 4 },
        { id: 'jobs', label: 'Matching Jobs', number: 5 },
      ];

  const currentStepIndex = stepsConfig.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 py-3.5 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between sm:justify-center sm:gap-4 overflow-x-auto no-scrollbar py-1">
            {stepsConfig.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = step.id === currentStep;
              const isClickable = canNavigateTo(step.id);

              return (
                <li key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => isClickable && onNavigateTo(step.id)}
                    disabled={!isClickable}
                    className={`group flex items-center gap-2 text-xs font-medium transition-all ${
                      isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isCurrent
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.number}
                    </span>

                    <span
                      className={`${
                        isCurrent
                          ? 'text-white font-semibold'
                          : isCompleted
                          ? 'text-slate-300 hover:text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {index < stepsConfig.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-700 mx-2 sm:mx-3 flex-shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
