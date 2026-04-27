export const PERKS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8 8H4l3 6-3 6h4l4 6 4-6h4l-3-6 3-6h-4L12 2z"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    title: 'Mission-Driven Work',
    desc: 'Every line of code and every sale shapes the next generation of industrial automation.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Global Exposure',
    desc: 'Work with clients and partners across 40+ countries from day one.',
  },
  // {
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
  //       <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  //     </svg>
  //   ),
  //   title: 'Learning Budget',
  //   desc: '₹80,000 / year for courses, conferences, and certifications — no questions asked.',
  // },
  // {
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  //     </svg>
  //   ),
  //   title: 'Full Health Cover',
  //   desc: 'Comprehensive medical, dental, and vision for you and your dependents.',
  // },
  // {
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  //       <circle cx="12" cy="12" r="10"/>
  //       <polyline points="12 6 12 12 16 14"/>
  //     </svg>
  //   ),
  //   title: 'Flexible Hours',
  //   desc: 'Async-first culture. We care about output, not seat time.',
  // },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
    ),
    title: 'Robot Lab Access',
    desc: 'Hands-on time with our physical robots — every employee, every role.',
  },
]

export const PROCESS = [
  { num: '01', title: 'Apply Online',      desc: 'Submit your CV and a short note on why robotics excites you. No cover letter templates.' },
  { num: '02', title: 'Intro Call',        desc: '30-minute conversation with our hiring team — casual, no whiteboard grilling.' },
  { num: '03', title: 'Technical Round',   desc: 'A take-home challenge or pair-session relevant to the actual job, not puzzle games.' },
  { num: '04', title: 'Culture Interview', desc: "Meet the team you'll work with. Ask us anything — salary, roadmap, working style." },
  { num: '05', title: 'Offer',             desc: 'Fast decisions. We respect your time and aim to close within 5 business days.' },
]

export const DEPARTMENTS = ['Engineering', 'Sales', 'Research', 'Operations', 'Design', 'Other']
