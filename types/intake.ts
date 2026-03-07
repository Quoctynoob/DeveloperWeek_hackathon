import { z } from 'zod';

export const intakeSchema = z.object({
  company:                    z.string().min(1, 'Startup name is required'),
  industry:                   z.string().min(1, 'Industry is required'),
  fundingStage:               z.string().min(1, 'Funding stage is required'),
  primaryGeography:           z.string().min(1, 'Primary geography is required'),
  targetCustomerProfile:      z.string().min(10, 'Please provide at least a brief ICP description'),
  coreProblemStatement:       z.string().min(10, 'Please describe the core problem'),
  proposedSolutionOverview:   z.string().min(10, 'Please describe your proposed solution'),
  revenueModelStructure:      z.string().min(1, 'Revenue model is required'),
  businessModelExplanation:   z.string().min(10, 'Please explain your business model'),
  knownCompetitors:           z.array(z.string()).optional(),
  competitiveDifferentiators: z.string().min(10, 'Please describe your competitive differentiators'),
  // Only collected when fundingStage === 'Seed'
  monthlyRecurringRevenue:    z.string().optional(),
  activeCustomerCount:        z.string().optional(),
  monthOverMonthGrowth:       z.string().optional(),
  // Always required
  evaluationTerms:            z.boolean().refine(val => val === true, {
    message: 'You must accept the evaluation terms to proceed',
  }),
});

export type IntakeFormValues = z.infer<typeof intakeSchema>;

// ─── Dropdown constants ────────────────────────────────────────────────────────
// Single source of truth shared by project-intake/page.tsx and review/page.tsx

export const INDUSTRIES = [
  'AI/Machine Learning',
  'Fintech',
  'HealthTech/BioTech',
  'Climate/Energy',
  'Enterprise Saas/B2B Tools',
  'Consumer/Marketplace',
  'Other',
] as const;

export const FUNDING_STAGES = [
  'Idea',
  'Pre-Seed',
  'Seed',
] as const;

export const GEOGRAPHIES = [
  'North America',
  'Latin America',
  'Europe',
  'Middle East & Africa',
  'South Asia',
  'East Asia',
  'Southeast Asia',
  'Oceania',
  'Global',
  'Other',
] as const;

export const REVENUE_MODELS = [
  'SaaS / Subscription',
  'Marketplace / Transaction Fee',
  'Freemium',
  'License',
  'Usage-Based / Pay-per-use',
  'E-commerce / Direct Sales',
  'Consulting / Services',
  'Advertising',
  'Other',
] as const;
