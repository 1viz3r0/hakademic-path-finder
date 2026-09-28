import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { UserCareerProfile } from '../types';
import { HackademicLogo } from './HackademicLogo';

interface HeaderProps {
  profile: UserCareerProfile;
  onReset: () => void;
  activeStepName: string;
}

export const Header: React.FC<HeaderProps> = ({ profile, onReset, activeStepName }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <HackademicLogo size={42} showText={true} textColor="light" />
          <span className="hidden lg:inline-flex text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full ml-1">
            Verified Career Intelligence
          </span>
        </div>

        {/* Current Path Indicator & Actions */}
        <div className="flex items-center gap-3">
          {(profile.age || profile.education) && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border border-slate-800 bg-slate-950/50 px-3 py-1.5 rounded-lg">
              <span className="text-slate-500">Current Track:</span>
              {profile.age && (
                <span className="font-semibold text-slate-300">{profile.age} yrs</span>
              )}
              {profile.education && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="font-semibold text-slate-200">
                    {profile.education === 'UG' ? 'Undergraduate' : profile.education === 'PG' ? 'Postgraduate' : profile.education === '12TH' ? '12th Pass' : 'Diploma'}
                  </span>
                </>
              )}
              {profile.domain && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-indigo-300 font-medium truncate max-w-[150px]">{profile.domain}</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
            title="Start from beginning"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Path</span>
          </button>
        </div>
      </div>
    </header>
  );
};
