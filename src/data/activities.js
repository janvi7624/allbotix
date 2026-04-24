export const ACTIVITY_CATEGORIES = [
  {
    key: 'all',
    label: 'All Activities',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    key: 'fun',
    label: 'Fun',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
  },
  {
    key: 'tech',
    label: 'Tech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    key: 'indoor',
    label: 'Indoor',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'outdoor',
    label: 'Outdoor',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 6 3-4 4 6"/>
        <circle cx="18" cy="6" r="3"/>
        <line x1="18" y1="3" x2="18" y2="2"/>
        <line x1="18" y1="10" x2="18" y2="11"/>
      </svg>
    ),
  },
]

export const ACTIVITIES = [
  // FUN
  {
    id: 'f1',
    category: 'fun',
    title: 'Game Fridays',
    tag: 'Fun',
    desc: 'Board games, trivia battles and console tournaments to kick off the weekend right.',
    participants: 12,
    freq: 'Weekly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M12 12h.01M8 10v4M6 12h4M16 10h.01M18 12h.01"/>
      </svg>
    ),
  },
  {
    id: 'f2',
    category: 'fun',
    title: 'Team Lunches',
    tag: 'Fun',
    desc: 'Monthly catered lunches where teams bond over food from different cuisines around the world.',
    participants: 20,
    freq: 'Monthly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
  {
    id: 'f3',
    category: 'fun',
    title: 'Birthday Celebrations',
    tag: 'Fun',
    desc: 'Every team member\'s birthday gets a surprise setup — decorations, cake and the whole squad.',
    participants: 15,
    freq: 'Monthly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <path d="M12 3v4"/>
        <path d="M8 6l4-3 4 3"/>
      </svg>
    ),
  },
  {
    id: 'f4',
    category: 'fun',
    title: 'Movie Nights',
    tag: 'Fun',
    desc: 'Bi-monthly office movie screenings with popcorn, bean bags and team vote on the film.',
    participants: 18,
    freq: 'Bi-Monthly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2"/>
        <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
      </svg>
    ),
  },
  // TECH
  {
    id: 't1',
    category: 'tech',
    title: 'Hack Sprints',
    tag: 'Tech',
    desc: '48-hour internal hackathons where anyone can pitch a robot idea and build it with cross-team support.',
    participants: 16,
    freq: 'Quarterly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    id: 't2',
    category: 'tech',
    title: 'Tech Talks',
    tag: 'Tech',
    desc: 'Fortnightly internal lightning talks — team members share breakthroughs, new tools or deep dives.',
    participants: 22,
    freq: 'Fortnightly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    id: 't3',
    category: 'tech',
    title: 'AI Research Club',
    tag: 'Tech',
    desc: 'Weekly reading group dissecting the latest AI and robotics papers — coffee and curiosity required.',
    participants: 8,
    freq: 'Weekly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 110 20"/>
        <path d="M12 6v6l4 2"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    id: 't4',
    category: 'tech',
    title: 'Demo Days',
    tag: 'Tech',
    desc: 'Quarterly show-and-tell where every team demos what they shipped — no slides, only live builds.',
    participants: 30,
    freq: 'Quarterly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M9 8l3 3-3 3"/>
      </svg>
    ),
  },
  // INDOOR
  {
    id: 'i1',
    category: 'indoor',
    title: 'Book Club',
    tag: 'Indoor',
    desc: 'Monthly gathering where the team reads a tech or business book and debates the ideas over chai.',
    participants: 9,
    freq: 'Monthly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
  {
    id: 'i2',
    category: 'indoor',
    title: 'Brainstorm Walls',
    tag: 'Indoor',
    desc: 'Open innovation sessions on whiteboards — any problem, any team member, zero hierarchy.',
    participants: 20,
    freq: 'Fortnightly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  },
  // OUTDOOR
  {
    id: 'o1',
    category: 'outdoor',
    title: 'Weekend Treks',
    tag: 'Outdoor',
    desc: 'Monthly group hikes in and around Surat — forests, trails and city nature walks for the team.',
    participants: 12,
    freq: 'Monthly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 6 3-4 4 6"/>
        <line x1="3" y1="17" x2="21" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'o2',
    category: 'outdoor',
    title: 'Cricket Sundays',
    tag: 'Outdoor',
    desc: 'Sunday morning cricket matches at the local ground — batting, bowling and plenty of banter.',
    participants: 16,
    freq: 'Monthly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12l4-4 4 4-4 4-4-4z"/>
      </svg>
    ),
  },
]