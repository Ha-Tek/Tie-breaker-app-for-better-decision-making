export interface DecisionPreset {
  id: string;
  category: string;
  question: string;
  context: string;
  options: Array<{ id: string; title: string; description: string }>;
  criteria: string[];
}

export const PRESET_DECISIONS: DecisionPreset[] = [
  {
    id: 'career-startup-vs-corporate',
    category: 'Career & Work',
    question: 'Should I join a Series-B tech startup or stay in my stable corporate role?',
    context: 'I have 6 months of financial runway. I value rapid career progression and autonomy, but I am also wary of burnout and market turbulence.',
    options: [
      {
        id: 'opt-startup',
        title: 'Join Series-B Startup',
        description: 'Higher equity upside, broader scope of leadership, fast-paced culture with ambiguous expectations.',
      },
      {
        id: 'opt-corporate',
        title: 'Stay in Corporate Role',
        description: 'Predictable 40-hour work week, higher base salary, 401k match, but slower promotions and rigid hierarchy.',
      },
    ],
    criteria: [
      'Compounding Career Trajectory',
      'Financial Safety & Total Upside',
      'Work-Life Balance & Stress',
      'Autonomy & Impact',
    ],
  },
  {
    id: 'housing-rent-vs-buy',
    category: 'Finance & Housing',
    question: 'Should I buy a 2-bedroom condo or continue renting for the next 2-3 years?',
    context: 'Mortgage interest rates are around 6.5%. I have saved a 15% down payment. I might want the flexibility to move cities if my partner changes jobs.',
    options: [
      {
        id: 'opt-buy',
        title: 'Buy 2-Bedroom Condo',
        description: 'Lock in housing costs, build equity over time, face HOA fees and property maintenance responsibilities.',
      },
      {
        id: 'opt-rent',
        title: 'Continue Renting & Invest Surplus',
        description: 'Retain geographic agility, no unexpected repairs, invest the down payment into index funds.',
      },
    ],
    criteria: [
      'Total Financial Net Worth in 5 Years',
      'Geographic & Career Mobility',
      'Stress & Maintenance Responsibilities',
      'Pride of Ownership & Customization',
    ],
  },
  {
    id: 'tech-react-vs-vue',
    category: 'Tech & Architecture',
    question: 'Should our team build the new client dashboard in React or Vue 3?',
    context: 'Our engineering team of 6 has mixed frontend experience. We have a strict 3-month launch timeline and must support complex data visualization.',
    options: [
      {
        id: 'opt-react',
        title: 'React 19 with Tailwind & Vite',
        description: 'Massive ecosystem, easier hiring, extensive charting libraries, larger community codebases.',
      },
      {
        id: 'opt-vue',
        title: 'Vue 3 with Pinia & Tailwind',
        description: 'Gentler learning curve for backend developers, clean official conventions, highly performant reactivity.',
      },
    ],
    criteria: [
      'Speed to Delivery (3-month sprint)',
      'Hiring & Ecosystem Breadth',
      'Developer Ergonomics & Team Ramp-up',
      'Long-term Maintainability',
    ],
  },
  {
    id: 'lifestyle-relocation',
    category: 'Life & Location',
    question: 'Should I relocate to a major tech hub or stay in my hometown close to family?',
    context: 'I work remotely, but networking and in-person professional circles are limited in my hometown. Relocating doubles my monthly cost of living.',
    options: [
      {
        id: 'opt-relocate',
        title: 'Relocate to Major Tech Hub',
        description: 'Immerse in high-density professional opportunities, cultural vibrancy, but pay premium living costs.',
      },
      {
        id: 'opt-hometown',
        title: 'Stay in Hometown Near Family',
        description: 'Low overhead, deep personal support network, higher monthly savings rate, but fewer spontaneous serendipities.',
      },
    ],
    criteria: [
      'Professional Serendipity & Network',
      'Family Connection & Emotional Support',
      'Monthly Savings & Financial Margin',
      'Daily Happiness & Pace of Life',
    ],
  },
];
