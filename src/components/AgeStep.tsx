import React, { useState } from 'react';
import { Calendar, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { HackademicLogo } from './HackademicLogo';

interface AgeStepProps {
  initialAge: number | null;
  onContinue: (age: number) => void;
}

export const AgeStep: React.FC<AgeStepProps> = ({ initialAge, onContinue }) => {
  const [ageInput, setAgeInput] = useState<string>(initialAge ? String(initialAge) : '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

  const validateAge = (val: string): { isValid: boolean; numAge: number } => {
    const trimmed = val.trim();
    if (!trimmed) {
      return { isValid: false, numAge: 0 };
    }

    const num = Number(trimmed);
    if (isNaN(num) || !Number.isInteger(num)) {
      return { isValid: false, numAge: 0 };
    }

    if (num < 16 || num > 45) {
      return { isValid: false, numAge: num };
    }

    return { isValid: true, numAge: num };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAgeInput(val);
    setTouched(true);

    if (val.trim() === '') {
      setErrorMessage('');
      return;
    }

    const num = Number(val);
    if (isNaN(num) || num < 16 || num > 45) {
      setErrorMessage('Please enter an age between 16 and 45 years.');
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const { isValid, numAge } = validateAge(ageInput);
    if (!isValid) {
      setErrorMessage('Please enter an age between 16 and 45 years.');
      return;
    }

    setErrorMessage('');
    onContinue(numAge);
  };

  const currentNum = Number(ageInput);
  const isCurrentlyValid = ageInput.trim() !== '' && !isNaN(currentNum) && currentNum >= 16 && currentNum <= 45;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-5">
          <HackademicLogo size={68} showText={true} />
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/50 mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>Step 1 · Candidate Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Enter Your Age
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
          Please provide your current age to find age-eligible career opportunities, apprenticeships, and hiring requirements.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="age-input" className="block text-xs uppercase font-mono tracking-wider text-slate-300 mb-2">
              Age (Years) <span className="text-indigo-400 font-normal">· Range 16 to 45</span>
            </label>

            <div className="relative">
              <input
                id="age-input"
                type="number"
                min="16"
                max="45"
                step="1"
                value={ageInput}
                onChange={handleChange}
                placeholder="e.g. 21"
                className={`w-full bg-slate-950 border text-white text-lg font-mono rounded-xl px-4 py-3.5 focus:outline-none transition-all placeholder:text-slate-600 ${
                  errorMessage
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : isCurrentlyValid
                    ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                autoFocus
              />

              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                {isCurrentlyValid && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {errorMessage && (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>
            </div>

            {/* Error Message as specified */}
            {errorMessage ? (
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 font-medium animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : isCurrentlyValid ? (
              <p className="mt-2 text-xs text-emerald-400 font-medium">
                Valid age ({currentNum} years). Ready to proceed to Education Background.
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-500 font-mono">
                Must be an integer between 16 and 45.
              </p>
            )}
          </div>

          {/* Verification Note */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs text-slate-400 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p>
              Your age is used strictly to filter entry-level roles, graduate engineering programs, and statutory employment criteria across partner job portals.
            </p>
          </div>

          {/* Submit / Continue Button */}
          <button
            type="submit"
            disabled={!isCurrentlyValid}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isCurrentlyValid
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:translate-x-0.5'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <span>Continue to Education Background</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
