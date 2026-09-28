import { ExpectedSalaryRange, SalaryOption } from '../types';

export const SALARY_OPTIONS: SalaryOption[] = [
  {
    id: 'below_2_lpa',
    label: 'Below ₹2 LPA',
    minLpa: 0,
    maxLpa: 2,
    badge: 'Apprentice / Entry',
    description: 'Entry apprenticeships, basic traineeships, and stipend-based starter opportunities.',
  },
  {
    id: '2_to_3_lpa',
    label: '₹2–3 LPA',
    minLpa: 2,
    maxLpa: 3,
    badge: 'Junior / DET',
    description: 'Junior technical support, field technicians, and initial diploma trainee positions.',
  },
  {
    id: '3_to_5_lpa',
    label: '₹3–5 LPA',
    minLpa: 3,
    maxLpa: 5,
    badge: 'Associate / Fresher',
    description: 'Fresher engineering graduates, associate developers, and IT support services packages.',
  },
  {
    id: '5_to_7_lpa',
    label: '₹5–7 LPA',
    minLpa: 5,
    maxLpa: 7,
    badge: 'Core Specialist',
    description: 'Core product entry roles, cyber defense analysts, and mid-tier software engineering.',
  },
  {
    id: '7_to_10_lpa',
    label: '₹7–10 LPA',
    minLpa: 7,
    maxLpa: 10,
    badge: 'High Growth',
    description: 'Fast-growing startups, Tier-1 MNC engineering associates, and specialized cloud tracks.',
  },
  {
    id: '10_to_15_lpa',
    label: '₹10–15 LPA',
    minLpa: 10,
    maxLpa: 15,
    badge: 'Product Track',
    description: 'High-tier product firms, advanced cybersecurity/AI engineers, and accelerated roles.',
  },
  {
    id: '15_to_20_lpa',
    label: '₹15–20 LPA',
    minLpa: 15,
    maxLpa: 20,
    badge: 'Top Tier',
    description: 'Top-tier tech startups, competitive SDE-1 positions, and high-impact R&D roles.',
  },
  {
    id: '20_plus_lpa',
    label: '₹20+ LPA',
    minLpa: 20,
    maxLpa: 999,
    badge: 'Elite Band',
    description: 'Elite technology employers, quantitative systems, and top-percentile specialist bands.',
  },
];

export interface ParsedSalary {
  minLpa: number | null;
  maxLpa: number | null;
  isDisclosed: boolean;
  formattedDisplay: string;
}

/**
 * Parses salary string into numeric bounds and disclosure flag.
 * If salary is missing or contains undisclosed keywords, marks as not disclosed.
 */
export function parseSalary(salaryStr?: string): ParsedSalary {
  if (
    !salaryStr ||
    salaryStr.trim() === '' ||
    salaryStr.toLowerCase().includes('not disclosed') ||
    salaryStr.toLowerCase().includes('competitive industry standard') ||
    salaryStr.toLowerCase().includes('as per industry')
  ) {
    return {
      minLpa: null,
      maxLpa: null,
      isDisclosed: false,
      formattedDisplay: 'Salary not disclosed',
    };
  }

  // Check for LPA numbers (e.g. ₹5.0 - 7.5 LPA, ₹12 - 18 LPA, ₹8 LPA)
  const lpaRegex = /₹?\s*(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*₹?\s*(\d+(?:\.\d+)?)\s*LPA/i;
  const match = salaryStr.match(lpaRegex);

  if (match) {
    const minVal = parseFloat(match[1]);
    const maxVal = parseFloat(match[2]);
    return {
      minLpa: minVal,
      maxLpa: maxVal,
      isDisclosed: true,
      formattedDisplay: salaryStr,
    };
  }

  // Check single LPA (e.g. ₹6 LPA, ₹10+ LPA)
  const singleLpaRegex = /₹?\s*(\d+(?:\.\d+)?)\+?\s*LPA/i;
  const singleMatch = salaryStr.match(singleLpaRegex);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return {
      minLpa: val,
      maxLpa: val,
      isDisclosed: true,
      formattedDisplay: salaryStr,
    };
  }

  // Any other rupee figure (e.g. ₹3,50,000 - ₹5,00,000)
  const rawRupee = salaryStr.match(/₹\s*(\d[\d,]*)/);
  if (rawRupee) {
    const num = parseFloat(rawRupee[1].replace(/,/g, ''));
    if (num > 50000) {
      // Annual salary in INR -> convert to LPA
      const lpaVal = Number((num / 100000).toFixed(1));
      return {
        minLpa: lpaVal,
        maxLpa: lpaVal,
        isDisclosed: true,
        formattedDisplay: salaryStr,
      };
    }
  }

  // Default if it doesn't clearly convey numbers
  return {
    minLpa: null,
    maxLpa: null,
    isDisclosed: false,
    formattedDisplay: 'Salary not disclosed',
  };
}

/**
 * Returns a priority match score (3 = optimal/higher, 2 = undisclosed, 1 = lower)
 */
export function getSalaryMatchPriority(
  salaryStr: string | undefined,
  expectedSalaryId: ExpectedSalaryRange | null
): { score: number; statusBadge?: string } {
  if (!expectedSalaryId) {
    return { score: 2 };
  }

  const selectedOption = SALARY_OPTIONS.find((s) => s.id === expectedSalaryId);
  if (!selectedOption) {
    return { score: 2 };
  }

  const parsed = parseSalary(salaryStr);
  if (!parsed.isDisclosed || parsed.maxLpa === null) {
    return {
      score: 1.5,
      statusBadge: 'Salary not disclosed',
    };
  }

  // Check if job package meets or exceeds the target expectation:
  // e.g. target is 5-7 LPA.
  // A job offering 5-7.5 LPA or 8-12 LPA meets/exceeds!
  if (parsed.maxLpa >= selectedOption.minLpa) {
    // If it strictly falls into or above the bracket
    if (parsed.minLpa !== null && parsed.minLpa >= selectedOption.minLpa) {
      return {
        score: 3,
        statusBadge: 'Matches / Exceeds Target',
      };
    }
    // Partially overlapping
    return {
      score: 2.5,
      statusBadge: 'Matches Target Range',
    };
  }

  // Below target package
  return {
    score: 1,
    statusBadge: 'Below Expected Package',
  };
}
