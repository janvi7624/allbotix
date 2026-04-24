export const BRAND = {
  name: 'ALLBOTIX',
  tagline: 'Welcome to the Future of Smart Customer Interaction!',
  categoryHeading: 'Reception & Information Robots',
  heroHeading: 'Enhancing First Impressions with Smart Technology',
  contact: {
    email: 'info@allbotix.com',
    whatsapp: '+91 9898xxxxxx',          // replace with real number from footer
    address: {
      line1: '101 to 107, 2nd Floor, 1st Basin, Shivalik Shaney Harmony',
      area: 'Above Chicken City',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
    },
    social: {
      instagram: '#',
      linkedin: '#',
      youtube: '#',
    },
  },
  copyright: '© 2025 ALLBOTIX. All rights reserved.',
};

export const ROBOTS = [
  {
    uid: '1',
    id: 'atr-p010',
    src: '/robots/robo1_package.avif',
    name: 'AI Receptionist Robot',
    tag: 'AI Receptionist',
    category: 'Reception & Information Robot',
    modelNumber: 'ATR-p010',
    desc: 'A fully automated, AI-powered receptionist that interacts with visitors, provides information, and manages appointments.',
    specs: [
      'LCD screen: 13.3 inch',
      'Camera: 13 MP + 1080p @ 30 FPS',
      'Audio System: 20W',
    ],
    display: {
      sectionLabel: 'Core Capability',
      title: 'AI Receptionist Robot',
      subtitle:
        'A fully automated, AI-powered receptionist that interacts with visitors, provides information, and manages appointments.',
      imgSrc: '/robots/robo1_display.avif',
      imgAlt: 'AI Receptionist Robot display unit',
      features: [
        '13.3-inch LCD screen',
        'Visitor check-in & registration',
        'Facial recognition for personalized interaction',
        'Obstacle avoidance and user tracking',
        'Autonomous charging',
        'Audio system with sub-woofer, midrange speakers & tweeters',
      ],
    },
    navigation: {
      sectionLabel: 'Mobility',
      title: 'Navigation Features',
      subtitle:
        'An engaging digital concierge with all-resource autonomous navigation and assistance.',
      imgSrc: '/robots/robo1_nav.gif',
      imgAlt: 'Navigation system floor-plan diagram',
      features: [
        'Utilizes 2D mapping, 3D localization',
        'Path planning for precise navigation',
        '360-degree LIDAR, depth cameras & sensors',
        'Zero turn radius with speeds up to 1 meter per second',
      ],
    },
    voiceAssistant: {
      sectionLabel: 'Interaction',
      title: 'Voice Assistant Reception Robot',
      subtitle:
        'A smart voice-controlled assistant designed to offer hands-free information and customer interaction.',
      imgSrc: '/robots/robo1_voice.avif',
      imgAlt: 'Voice assistant module on the robot',
      features: [
        'Advanced voice recognition for real-time communication',
        'Supports multiple languages',
        'Connects to company databases for instant assistance',
        'Integrates with AI-powered chatbots',
      ],
    },
    parcelTray: {
      sectionLabel: 'Utility',
      title: 'Parcel Tray',
      subtitle:
        'The ATR-p010 robot features a versatile tray designed to enhance its functionality.',
      imgSrc: '/robots/robo1_tray.avif',
      imgAlt: 'Detachable parcel tray accessory',
      features: [
        'Wireless charging',
        'Tray can hold items weighing up to 3 kg',
        'For customization, tray includes four screw holes',
        'In the V3 model, the tray is equipped with a 12V DC power jack',
      ],
    },
    packaging: {
      sectionLabel: "What's Included",
      title: "What's in the Box?",
      subtitle:
        'A language-adaptive robot offering seamless multilingual support for international visitors.',
      imgSrc: '/robots/robo1_package.avif',
      imgAlt: 'Full package contents laid out',
      includes: [
        {
          item: '1× ATR-p010 Robot',
          detail: 'Pre-assembled, fitted with 100W 20A cable. Robot ready to get going.',
        },
        {
          item: '1× Charging Station + Cable',
          detail: 'SIM tray with all you need.',
        },
        {
          item: '1× User Manual',
          detail: 'Simple step-by-step setup guide.',
        },
      ],
      ctaLabel: 'Download Spec Sheet',
      ctaLink: 'https://allbotix.s3.eu-north-1.amazonaws.com/ALLBOTIX_ROBOTICS_PROFILE.pdf',
    },
  },
  {
    uid: '2',
    id: 'bolt-g1',
    src: '/robots/bolt_g1.avif',
    name: 'Humanoid Robot',
    tag: 'Humanoid Robot',
    category: 'Humanoid Service Robot',
    modelNumber: 'BOLT-G1',
    desc: 'A next-generation humanoid robot combining advanced AI, natural movement, and expressive communication — delivering intelligence, empathy, and efficiency across service environments.',
    specs: [
      'Lightweight & Highly Maneuverable',
      'AI-Powered Interaction & Assistance',
      'Rechargeable & Energy-Efficient Design',
    ],
    display: {
      sectionLabel: 'Core Capability',
      title: 'Humanoid Robot',
      subtitle:
        'A next-generation humanoid robot built for versatility — assisting in customer service, education, healthcare, hospitality, and entertainment through human-like interaction and adaptability.',
      imgSrc: '/robots/bolt_g1_display.avif',
      imgAlt: 'Bolt G1 Humanoid Robot display unit',
      features: [
        'Lightweight & highly maneuverable frame',
        'Precision handling for complex tasks',
        'AI-powered interaction & assistance',
        'Rechargeable & energy-efficient design',
        'Voice interaction for a personalized experience',
        'Customizable functions for various applications',
        'Continuous operation — no breaks required',
      ],
    },
    navigation: {
      sectionLabel: 'Mobility',
      title: 'Navigation Features',
      subtitle:
        'A highly maneuverable humanoid robot designed for seamless movement and task execution across diverse environments.',
      imgSrc: '/robots/bolt_g1_nav.avif',
      imgAlt: 'Bolt G1 navigation and movement system',
      features: [
        'Lightweight & highly maneuverable humanoid body',
        'Precision handling for complex physical tasks',
        'Adaptive movement across various floor surfaces',
        'Designed for seamless operation in dynamic environments',
      ],
    },
    voiceAssistant: {
      sectionLabel: 'Interaction',
      title: 'AI-Powered Voice & Expression',
      subtitle:
        'Built for expressive communication and real-time AI interaction — engaging customers with empathy, intelligence, and efficiency.',
      imgSrc: '/robots/bolt_g1_voice.avif',
      imgAlt: 'Bolt G1 voice and AI interaction module',
      features: [
        'Natural movement with expressive communication',
        'Advanced AI for real-time human-robot interaction',
        'Voice interaction for a personalized experience',
        'Minimizes human error and operates tirelessly',
        'Optimizes labor efficiency around the clock',
      ],
    },
    industries: {
      sectionLabel: 'Use Cases',
      title: 'Industries That We Serve',
      subtitle:
        'The Bolt G1 is built to serve across a wide range of industries — from hospitality to healthcare and beyond.',
      imgSrc: '/robots/bolt_g1_industries.avif',
      imgAlt: 'Bolt G1 serving across industries',
      features: [
        'Coffee Shops & Bakeries',
        'Juice Bars',
        'Exhibition & Expos',
        'Events',
        'Restaurants',
        'Hotels',
        'Catering Services',
      ],
    },
    packaging: {
      sectionLabel: "What's Included",
      title: "What's in the Box?",
      subtitle:
        'Everything you need to deploy the Bolt G1 humanoid robot and get it operational right away.',
      imgSrc: '/robots/bolt_g1_package.avif',
      imgAlt: 'Bolt G1 full package contents',
      includes: [
        {
          item: '1× Bolt G1 Humanoid Robot',
          detail: 'Pre-assembled and ready to deploy straight out of the box.',
        },
        {
          item: '1× Charging Station + Cable',
          detail: 'Energy-efficient charging setup for continuous operation.',
        },
        {
          item: '1× User Manual',
          detail: 'Step-by-step setup and operational guide.',
        },
      ],
      ctaLabel: 'Download Spec Sheet',
      ctaLink: 'https://allbotix.s3.eu-north-1.amazonaws.com/ALLBOTIX_ROBOTICS_PROFILE.pdf',
    },
  },
  {
    uid: '3',
    id: 'alpha-dog',
    src: '/robots/alpha_dog_package.avif',
    name: 'Dog Robot',
    tag: 'Robot Dog',
    category: 'Quadruped Service Robot',
    modelNumber: 'ALPHA-DOG',
    desc: 'Agile, intelligent quadruped robots combining advanced AI and sensors to support security patrol, inspection, hospitality assistance, and on-site operations — reducing manual workload and safety risks.',
    specs: [
      'Agile Quadruped Mobility',
      'Advanced AI & Autonomy',
      'High-Precision Sensors',
      'Rugged, All-Terrain Design',
      'Modular Payload Options',
    ],
    models: [
      {
        id: 'alpha-b2',
        name: 'Alpha B2',
        src: '/robots/alpha_b2.avif',
        alt: 'Alpha B2 Robot Dog',
        pdfLink: 'https://bb266153-f714-439c-a5e4-b00d0f3b1fb3.filesusr.com/ugd/5ff735_f4fbc49c92474331b27b450bab9936a4.pdf',
      },
      {
        id: 'alpha-go2',
        name: 'Alpha GO2',
        src: '/robots/alpha_go2.avif',
        alt: 'Alpha GO2 Robot Dog',
        pdfLink: 'https://bb266153-f714-439c-a5e4-b00d0f3b1fb3.filesusr.com/ugd/5ff735_c84147440efa4da6a5d9a27368e2ec4b.pdf',
      },
    ],
    display: {
      sectionLabel: 'Core Capability',
      title: 'Dog Robot',
      subtitle:
        'Robotic dogs combining agility, intelligence, and rugged performance — supporting a wide range of applications from security patrol and inspection to hospitality assistance and on-site operations.',
      imgSrc: '/robots/alpha_dog_display.avif',
      imgAlt: 'Smart Dog Robot display unit',
      features: [
        'Agile quadruped mobility across complex terrains',
        'Advanced AI & autonomous operation',
        'High-precision sensors for accurate detection',
        'Rugged, all-terrain design',
        '24/7 operation — safety & productivity boost',
        'Modular payload options for various use cases',
      ],
    },
    navigation: {
      sectionLabel: 'Mobility',
      title: 'Navigation Features',
      subtitle:
        'Robotic dogs that navigate terrain traditional robots cannot — performing patrol, inspection, and assistance tasks with precision and consistency.',
      imgSrc: '/robots/alpha_dog_nav.avif',
      imgAlt: 'Alpha dog robot navigating terrain',
      features: [
        'Agile quadruped locomotion across uneven terrain',
        'Autonomous path planning and obstacle avoidance',
        'Operates in environments inaccessible to wheeled robots',
        'Consistent patrol and inspection with high reliability',
      ],
    },
    voiceAssistant: {
      sectionLabel: 'Interaction',
      title: 'AI-Powered Autonomy',
      subtitle:
        'Powered by advanced AI and sensors — delivering accurate, tireless, and autonomous service across industrial and public environments.',
      imgSrc: '/robots/alpha_dog_ai.avif',
      imgAlt: 'Alpha dog robot AI interaction system',
      features: [
        'Advanced AI for real-time decision making',
        'High-precision sensors for environment awareness',
        'Performs repetitive or hazardous duties autonomously',
        'Significantly reduces manual workload and safety risks',
        'Lowers operational costs with autonomous service',
      ],
    },
    industries: {
      sectionLabel: 'Use Cases',
      title: 'Industries That We Serve',
      subtitle:
        'Alpha Dog robots are built to operate across a wide range of high-demand industries and environments.',
      imgSrc: '/robots/alpha_dog_industries.avif',
      imgAlt: 'Alpha dog robot serving across industries',
      features: [
        'High-Risk Industrial Environments (Inspection & Monitoring)',
        'Construction & Infrastructure',
        'Public Safety',
        'Exhibition & Expos',
        'Events',
        'Research & Education',
        'Agriculture & Natural Environments',
        'Defense & Emergency Services',
      ],
    },
    packaging: {
      sectionLabel: "What's Included",
      title: "What's in the Box?",
      subtitle:
        'Everything you need to deploy your Alpha Dog robot and get it operational right out of the box.',
      imgSrc: '/robots/alpha_dog_package.avif',
      imgAlt: 'Alpha Dog robot full package contents',
      includes: [
        {
          item: '1× Alpha Dog Robot (B2 or GO2)',
          detail: 'Pre-assembled quadruped robot, ready for immediate deployment.',
        },
        {
          item: '1× Charging Station + Cable',
          detail: 'Energy-efficient charging setup for continuous 24/7 operation.',
        },
        {
          item: '1× User Manual',
          detail: 'Step-by-step setup, calibration, and operational guide.',
        },
      ],
      ctaLabel: 'Download Spec Sheet',
      ctaLink: 'https://allbotix.s3.eu-north-1.amazonaws.com/ALLBOTIX_ROBOTICS_PROFILE.pdf',
    },
  },
  {
    uid: '4',
    id: 'cleaning-robots',
    src: '/robots/cleaning_robot_package.avif',
    name: 'Cleaning Robot',
    tag: 'Cleaning Robot',
    category: 'Autonomous Cleaning Robot',
    modelNumber: 'CLEANING-SERIES',
    desc: 'A full lineup of autonomous smart cleaning robots designed to revolutionize cleanliness across commercial and industrial environments — delivering precision, consistency, and efficiency around the clock.',
    specs: [
      'Autonomous Navigation & Mapping',
      'Multi-Surface Cleaning Capability',
      'AI-Powered Smart Cleaning Technology',
      'Energy-Efficient & Rechargeable Design',
      'Remote Monitoring & Management',
    ],
    models: [
      {
        id: 'ac40',
        name: 'AC40',
        src: '/robots/ac40.avif',
        alt: 'AC40 Smart Cleaning Robot',
        desc: 'Meet the Allbotix AC40 — mop, scrub, vacuum all-in-one cleaning robot that sweeps, scrubs, vacuums, and mops with precision and power.',
      },
      {
        id: 'ax10',
        name: 'AX10',
        src: '/robots/ax10.avif',
        alt: 'AX10 Smart Cleaning Robot',
        desc: 'Introducing the Allbotix AX10 — a powerhouse cleaning robot engineered for deep, intelligent, and more-than-seamless cleaning every day.',
      },
      {
        id: 'amt1',
        name: 'AMT 1',
        src: '/robots/amt1.avif',
        alt: 'AMT 1 Smart Cleaning Robot',
        desc: 'Introducing the Allbotix AMT1 — an AI-powered sweeping robot designed for large-scale environments, covering up to 10,000m² with advanced autonomous efficiency.',
      },
      {
        id: 'at60s',
        name: 'AT60s',
        src: '/robots/at60s.avif',
        alt: 'AT60s Smart Cleaning Robot',
        desc: 'Meet the Allbotix AT60s — next-level precision sweeping robot that polishes, scrubs and surfaces and delivers exceptional cleanliness.',
      },
      {
        id: 'at20s-pro',
        name: 'AT20s Pro',
        src: '/robots/at20s_pro.avif',
        alt: 'AT20s Pro Smart Cleaning Robot',
        desc: 'Unleash the power of the AT20s Pro — the ultimate cleaning solution upon redefining how clean really looks and feels about cleaning.',
      },
      {
        id: 'as100n',
        name: 'AS 100N',
        src: '/robots/as100n.avif',
        alt: 'AS 100N Smart Cleaning Robot',
        desc: 'Introducing the Allbotix AS 100N — the most versatile outdoor sweeping robot that takes care of every outdoor surface, structure, and space.',
      },
    ],
    display: {
      sectionLabel: 'Core Capability',
      title: 'Cleaning Robot',
      subtitle:
        'Revolutionizing cleaning with autonomous technology — a full lineup of smart robots engineered to redefine clean across commercial spaces, industrial facilities, and outdoor environments.',
      imgSrc: '/robots/cleaning_robot_display.gif',
      imgAlt: 'Smart Cleaning Robot display unit',
      features: [
        'Autonomous navigation & intelligent mapping',
        'Multi-surface cleaning — sweep, scrub, mop & vacuum',
        'AI-powered smart cleaning technology',
        'Energy-efficient & rechargeable design',
        '24/7 operation with minimal human intervention',
        'Remote monitoring & fleet management',
      ],
    },
    navigation: {
      sectionLabel: 'Mobility',
      title: 'Navigation Features',
      subtitle:
        'Autonomous cleaning robots that intelligently map and navigate complex environments — delivering consistent, precise cleaning with zero manual effort.',
      imgSrc: '/robots/cleaning_robot_nav.gif',
      imgAlt: 'Cleaning robot autonomous navigation system',
      features: [
        'AI-powered autonomous path planning',
        'Real-time environment mapping & obstacle avoidance',
        'Operates across multiple floor types and surfaces',
        'Consistent coverage with no missed zones',
      ],
    },
    voiceAssistant: {
      sectionLabel: 'Intelligence',
      title: 'AI-Powered Smart Cleaning',
      subtitle:
        'Powered by advanced AI — autonomous cleaning robots that operate tirelessly, reduce manual workload, and maintain spotless environments around the clock.',
      imgSrc: '/robots/cleaning_robot_ai.gif',
      imgAlt: 'AI smart cleaning robot intelligence system',
      features: [
        'Advanced AI for real-time cleaning decisions',
        'Auto-detects dirt levels and adjusts cleaning intensity',
        'Significantly reduces manual labor and operational costs',
        'Remote monitoring and scheduling via app',
        'Seamless integration into existing facility workflows',
      ],
    },
    industries: {
      sectionLabel: 'Use Cases',
      title: 'Industries That We Serve',
      subtitle:
        'Our smart cleaning robots are built to serve across a wide range of commercial, industrial, and public environments.',
      imgSrc: '/robots/cleaning_robot_industries.gif',
      imgAlt: 'Smart cleaning robots serving across industries',
      features: [
        'Hotels & Hospitality',
        'Shopping Malls & Retail',
        'Hospitals & Healthcare Facilities',
        'Airports & Transit Hubs',
        'Corporate Offices & Campuses',
        'Warehouses & Industrial Facilities',
        'Outdoor Public Spaces',
        'Educational Institutions',
      ],
    },
    packaging: {
      sectionLabel: "What's Included",
      title: "What's in the Box?",
      subtitle:
        'Everything you need to deploy your Smart Cleaning Robot and get it operational right out of the box.',
      imgSrc: '/robots/cleaning_robot_package.avif',
      imgAlt: 'Smart Cleaning Robot full package contents',
      includes: [
        {
          item: '1× Smart Cleaning Robot (Selected Model)',
          detail: 'Pre-configured and ready for immediate autonomous deployment.',
        },
        {
          item: '1× Charging Dock + Cable',
          detail: 'Auto-return charging dock for continuous 24/7 operation.',
        },
        {
          item: '1× Cleaning Accessories Kit',
          detail: 'Model-specific brushes, mop pads, and replacement filters.',
        },
        {
          item: '1× User Manual',
          detail: 'Step-by-step setup, mapping, scheduling, and operational guide.',
        },
      ],
      ctaLabel: 'Download Spec Sheet',
      ctaLink: 'https://allbotix.s3.eu-north-1.amazonaws.com/ALLBOTIX_ROBOTICS_PROFILE.pdf',
    },
  },
  {
    uid: '5',
    id: 'serving-robots',
    src: '/robots/serving_robot_package.avif',
    name: 'Serving Robot',
    tag: 'Serving Robot',
    category: 'Autonomous Serving Robot',
    modelNumber: 'SERVING-SERIES',
    desc: 'AI-powered serving robots designed to streamline food & beverage service, improve efficiency, and enhance customer experience across restaurants, hotels, hospitals, and event venues — reducing wait times and operational costs.',
    specs: [
      'Lightweight & Maneuverable for All Spaces',
      'AI-Powered Order Tracking & Assistance',
      'Rechargeable & Energy-Efficient',
      'Voice Interaction for a Personalized Experience',
      'Can Carry 4 Plates at a Time',
    ],
    models: [
      {
        id: 'aw3',
        name: 'AW3',
        src: '/robots/aw3.avif',
        alt: 'AW3 Smart Serving Robot',
        desc: 'A compact and agile serving robot built for efficient food and beverage delivery across restaurants, hotels, and event spaces.',
        pdfLink: '#'
      },
      {
        id: 'asmr-t10',
        name: 'ASMR T10',
        src: '/robots/asmr_t10.avif',
        alt: 'ASMR T10 Smart Serving Robot',
        desc: 'An advanced serving robot with a premium tray display, designed to deliver dishes with precision and style in high-end dining and hospitality environments.',
        pdfLink: '#'
      },
      {
        id: 'at9',
        name: 'AT9',
        src: '/robots/at9.avif',
        alt: 'AT9 Smart Serving Robot',
        desc: 'A multi-tray serving robot engineered for high-volume service environments, capable of carrying multiple plates simultaneously with ease.',
        pdfLink: '#'
      },
    ],
    display: {
      sectionLabel: 'Core Capability',
      title: 'Serving Robot',
      subtitle:
        'AI-powered robots designed to streamline food & beverage service, improve efficiency, and enhance customer experience across restaurants, hotels, hospitals, and event venues.',
      imgSrc: '/robots/serving_robot_display.avif',
      imgAlt: 'Smart Serving Robot display unit',
      features: [
        'Lightweight & maneuverable for all spaces',
        'AI-powered order tracking & assistance',
        'Rechargeable & energy-efficient design',
        'Voice interaction for a personalized experience',
        'Can carry 4 plates at a time easily',
        'No breaks — works continuously around the clock',
      ],
    },
    navigation: {
      sectionLabel: 'Mobility',
      title: 'Navigation Features',
      subtitle:
        'Smart serving robots that autonomously navigate dining floors, hotel corridors, and event venues — delivering orders with precision every time.',
      imgSrc: '/robots/serving_robot_nav.avif',
      imgAlt: 'Serving robot autonomous navigation system',
      features: [
        'Autonomous path planning across complex floor layouts',
        'AI-powered obstacle avoidance for safe guest interaction',
        'Lightweight & maneuverable in tight spaces',
        'Consistent table-to-table delivery with zero errors',
      ],
    },
    voiceAssistant: {
      sectionLabel: 'Interaction',
      title: 'AI-Powered Order Assistance',
      subtitle:
        'Built for seamless guest interaction — smart serving robots that engage customers, confirm orders, and deliver with efficiency and charm.',
      imgSrc: '/robots/serving_robot_voice.avif',
      imgAlt: 'Serving robot AI voice interaction system',
      features: [
        'Voice interaction for a personalized guest experience',
        'AI-powered real-time order tracking & assistance',
        'Reduces human error and ensures timely food delivery',
        'Frees up staff to focus on meaningful guest experiences',
        'Continuous operation — no fatigue, no breaks needed',
      ],
    },
    industries: {
      sectionLabel: 'Use Cases',
      title: 'Industries That We Serve',
      subtitle:
        'Our smart serving robots are built to enhance service across a wide range of food, beverage, and hospitality environments.',
      imgSrc: '/robots/serving_robot_industries.avif',
      imgAlt: 'Smart serving robots across industries',
      features: [
        'Coffee Shops',
        'Bakeries',
        'Juice Bars',
        'Exhibition & Expos',
        'Events',
        'Restaurants',
        'Hotels',
        'Catering Service',
      ],
    },
    packaging: {
      sectionLabel: "What's Included",
      title: "What's in the Box?",
      subtitle:
        'Everything you need to deploy your Smart Serving Robot and get it operational right out of the box.',
      imgSrc: '/robots/serving_robot_package.avif',
      imgAlt: 'Smart Serving Robot full package contents',
      includes: [
        {
          item: '1× Smart Serving Robot (Selected Model)',
          detail: 'Pre-assembled and ready for immediate floor deployment.',
        },
        {
          item: '1× Charging Dock + Cable',
          detail: 'Auto-return charging dock for continuous service operation.',
        },
        {
          item: '1× Serving Tray Set',
          detail: 'Model-specific trays designed to carry up to 4 plates securely.',
        },
        {
          item: '1× User Manual',
          detail: 'Step-by-step setup, mapping, and operational guide.',
        },
      ],
      ctaLabel: 'Download Spec Sheet',
      ctaLink: 'https://allbotix.s3.eu-north-1.amazonaws.com/ALLBOTIX_ROBOTICS_PROFILE.pdf',
    },
  },
  {
    uid: '6',
    id: 'amr-robots',
    src: '/robots/amr_robot_package.avif',
    name: 'Autonomous Mobile Robot',
    tag: 'AMR Robot',
    category: 'Autonomous Mobile Robot (AMR)',
    modelNumber: 'AMR-SERIES',
    desc: 'Transform your operations with Allbotix cutting-edge Autonomous Mobile Robots (AMR) — the all-powerful, automatically-autonomous robots navigating complex environments, streamlining workflows, and delivering smarter independent intelligence across warehousing, manufacturing, retail, and logistics.',
    specs: [
      'Advanced Autonomous Navigation with Real-Time Obstacle Avoidance',
      'Robust Design for Heavy-Duty Material Handling',
      'Seamless WMS/ERP Integration for Streamlined Operations',
      'Inventory Up-to-Date Status while Boosting Throughput',
      'Scalable Fleet Management',
    ],
    models: [
      {
        id: 'at300',
        name: 'AT300',
        src: '/robots/at300.avif',
        alt: 'AT300 Autonomous Mobile Robot',
        desc: 'A high-capacity autonomous mobile robot engineered for heavy-duty warehouse goods transport, material handling, and logistics operations.',
      },
      {
        id: 'at600',
        name: 'AT600',
        src: '/robots/at600.avif',
        alt: 'AT600 Autonomous Mobile Robot',
        desc: 'A powerful and scalable AMR built for high-volume industrial environments, delivering precision transport and autonomous fleet coordination.',
      },
    ],
    useCases: [
      {
        id: 'warehouse-transport',
        title: 'Warehouse Goods Transport Robot',
        subtitle:
          'Optimize your warehouse logistics with our high-capacity Goods Transport AMR — a powerhouse AMR fleet that moves heavy payloads, reducing manual labor and streamlining your supply chain.',
        imgSrc: '/robots/amr_warehouse.avif',
        imgAlt: 'AMR warehouse goods transport robot',
        features: [
          'Advanced autonomous navigation with real-time obstacle detection',
          'Robust design for heavy-duty material handling',
          'Seamless WMS/ERP integration for streamlined operations',
          'Inventory up-to-date status while boosting throughput',
        ],
        industries: [
          'Warehousing',
          'Distribution Centers',
          'E-Commerce Fulfilment',
          'Third Party Logistics (3PL)',
        ],
      },
      {
        id: 'retail-shelf-scanning',
        title: 'Retail Store Shelf Scanning Robot',
        subtitle:
          'Revolutionize retail inventory management with our AI-driven Shelf Scanning AMR — the intelligent robot autonomously monitors stock levels, detects discrepancies, and optimizes shelf space in real time, empowering retailers to maintain seamless inventory accuracy.',
        imgSrc: '/robots/amr_retail.avif',
        imgAlt: 'AMR retail shelf scanning robot',
        features: [
          'Lightning-fast barcode and RFID scanning for instant inventory',
          'AI-powered detection of out-of-stock and misplaced items',
          'Seamless integration with your POS and inventory systems',
          'Custom message and achieves 99.9% inventory accuracy',
        ],
        industries: [
          'Retail Chains',
          'Supermarkets',
          'Grocery Stores',
          'Big Box Retailers',
        ],
      },
      {
        id: 'factory-production',
        title: 'Factory Production Line Robot',
        subtitle:
          'Boost output and manufacturing efficiency with our Production Line AMR — the agile robot autonomously transports materials between workstations, optimizes workflows, and adapts to your production needs on the fly.',
        imgSrc: '/robots/amr_factory.avif',
        imgAlt: 'AMR factory production line robot',
        features: [
          'Precision autonomous navigation for cycle-time material delivery',
          'Intelligent task management for prompt on-time assistance',
          'Scalable design to handle alternate routes or unexpected production jams',
          'Real-time production analytics integration and reporting',
        ],
        industries: [
          'Manufacturing',
          'Automotive Assembly',
          'Electronics Assembly',
          'Pharmaceutical Production',
          'Food & Beverage Processing',
        ],
      },
      {
        id: 'security-patrolling',
        title: 'Smart Security Patrolling Robot',
        subtitle:
          'Enhance your security posture with our vigilant Security Patrolling AMR — the autonomous sentinel providing 24/7 surveillance, obstacle avoidance, and response to threats in real time, keeping your assets and personnel safe using cutting-edge wireless technology.',
        imgSrc: '/robots/amr_security.avif',
        imgAlt: 'AMR smart security patrolling robot',
        features: [
          'Product display & material package and transportation',
          'Board handling & autonomous delivery between stations',
          'Quality control & autonomous end-to-end logistics environment',
          'Fulfillment of the extensive vehicle fleet deployment',
          'Delivery to the AMR floor',
        ],
        industries: [
          'Corporate Campuses',
          'Industrial Facilities',
          'Shopping Malls',
          'Airports',
          'Data Centers',
        ],
      },
      {
        id: 'ecommerce-fulfillment',
        title: 'E-Commerce Order Fulfillment Robot',
        subtitle:
          'Accelerate your e-commerce fulfillment with our lightning-fast AMR fulfillment suite — these nimble, swift platforms scale with your business growth, meet customer demands with unprecedented speed and accuracy.',
        imgSrc: '/robots/amr_ecommerce.avif',
        imgAlt: 'AMR e-commerce order fulfillment robot',
        features: [
          'AI-powered picking algorithm for maximum efficiency',
          'Agile navigation through dynamic warehouse environments',
          'Virtually all robot configurations with precision robotics',
          'Plug-and-play integration with your OMS and WMS',
        ],
        industries: [
          'E-Commerce Goods',
          'Online Retailers',
          'Subscription Box Services',
          'Omnichannel Fulfillment Centers',
        ],
      },
    ],
    display: {
      sectionLabel: 'Core Capability',
      title: 'Autonomous Mobile Robot',
      subtitle:
        'Transform your operations with Allbotix cutting-edge AMR robots — autonomously navigating complex environments, streamlining workflows, and delivering smarter independent intelligence across industries.',
      imgSrc: '/robots/amr_display.avif',
      imgAlt: 'Smart AMR robot display unit',
      features: [
        'Advanced autonomous navigation with real-time obstacle avoidance',
        'Robust design for heavy-duty material handling',
        'Seamless WMS/ERP integration for streamlined operations',
        'Scalable fleet management across large facilities',
        'AI-powered real-time decision making',
        'Continuous 24/7 operation with zero fatigue',
      ],
    },
    navigation: {
      sectionLabel: 'Mobility',
      title: 'Navigation Features',
      subtitle:
        'Autonomous mobile robots that intelligently map, navigate, and adapt to complex industrial and commercial environments — delivering precision every time.',
      imgSrc: '/robots/amr_nav.avif',
      imgAlt: 'AMR autonomous navigation system',
      features: [
        'Advanced autonomous navigation with real-time obstacle detection',
        'Dynamic re-routing for uninterrupted operations',
        'Operates seamlessly across multi-floor and large-scale facilities',
        'Precision docking and payload handoff at every station',
      ],
    },
    voiceAssistant: {
      sectionLabel: 'Intelligence',
      title: 'AI-Powered Autonomous Intelligence',
      subtitle:
        'Powered by advanced AI — autonomous mobile robots that optimize workflows, reduce manual intervention, and keep operations running at peak efficiency around the clock.',
      imgSrc: '/robots/amr_ai.avif',
      imgAlt: 'AMR AI intelligence and automation system',
      features: [
        'AI-powered real-time decision making and task allocation',
        'Seamless WMS, ERP, OMS, and POS system integration',
        'Fleet-wide coordination and traffic management',
        'Predictive maintenance alerts to minimize downtime',
        'Continuous learning for improved operational efficiency',
      ],
    },
    packaging: {
      sectionLabel: "What's Included",
      title: "What's in the Box?",
      subtitle:
        'Everything you need to deploy your Autonomous Mobile Robot and get your operations running immediately.',
      imgSrc: '/robots/amr_package.avif',
      imgAlt: 'AMR robot full package contents',
      includes: [
        {
          item: '1× AMR Robot (Selected Model — AT300 or AT600)',
          detail: 'Pre-configured and ready for immediate warehouse or facility deployment.',
        },
        {
          item: '1× Charging Dock + Cable',
          detail: 'Auto-return charging station for uninterrupted 24/7 operations.',
        },
        {
          item: '1× Fleet Management Software License',
          detail: 'Full access to AMR fleet management, monitoring, and analytics dashboard.',
        },
        {
          item: '1× User Manual',
          detail: 'Step-by-step setup, mapping, integration, and operational guide.',
        },
      ],
      ctaLabel: 'Download Spec Sheet',
      ctaLink: 'https://allbotix.s3.eu-north-1.amazonaws.com/ALLBOTIX_ROBOTICS_PROFILE.pdf',
    },
  },
  {
    uid: '7',
    id: 'cobots',
    src: '/robots/cobot_package.avif',
    name: 'Cobot',
    tag: 'AI Cobot',
    category: 'Collaborative Robot (Cobot)',
    modelNumber: 'AL-SERIES',
    desc: 'AL Series collaborative robots designed to simplify industrial automation, improve productivity, and enhance operational flexibility across manufacturing and processing environments — delivering safe, precise, and efficient human-robot collaboration.',
    specs: [
      'Safe to Work Alongside Humans Without Extensive Guarding',
      'Compact & Lightweight for Easy Deployment and Redeployment',
      'High Precision & Repeatability for Consistent Performance',
      'Robust Joints for Long-Term Reliability and Durability',
      'Compatible with AL-Certified Accessories and Industry 4.0 Systems',
    ],
    models: [
      {
        id: 'al-series',
        name: 'AL Series',
        src: '/robots/al_series.avif',
        alt: 'AL Series Collaborative Robot Arm',
        desc: 'A compact, precise, and flexible collaborative robot arm engineered for safe and efficient human-robot collaboration across industrial production lines and workstations.',
      },
    ],
    display: {
      sectionLabel: 'Core Capability',
      title: 'Cobot',
      subtitle:
        'AL Series cobots engineered for safe and efficient collaboration with human operators — delivering high precision and reliability for repetitive and heavy-duty tasks across manufacturing and processing environments.',
      imgSrc: '/robots/cobot_display.avif',
      imgAlt: 'AL Series Cobot display unit',
      features: [
        'Safe to work alongside humans without extensive guarding',
        'Compact & lightweight for easy deployment and redeployment',
        'High precision & repeatability for consistent performance',
        'Robust joints for long-term reliability and durability',
        'Compatible with AL-certified accessories and Industry 4.0 systems',
        'Boosts productivity by automating repetitive and heavy-duty tasks',
      ],
    },
    navigation: {
      sectionLabel: 'Deployment',
      title: 'Flexible Deployment Features',
      subtitle:
        'Compact and flexible cobots that integrate seamlessly into existing production lines — with fast setup, minimal programming, and effortless redeployment across workstations.',
      imgSrc: '/robots/cobot_deploy.avif',
      imgAlt: 'AL Series Cobot deployment and integration',
      features: [
        'Fast setup and minimal programming required',
        'Easy integration into existing production lines',
        'Compact design allows redeployment across multiple workstations',
        'Compatible with AL-certified accessories and Industry 4.0 systems',
      ],
    },
    voiceAssistant: {
      sectionLabel: 'Intelligence',
      title: 'AI-Powered Precision & Automation',
      subtitle:
        'Powered by advanced AI — AL Series cobots deliver high precision, consistent repeatability, and intelligent automation that frees skilled workers for higher-value activities.',
      imgSrc: '/robots/cobot_ai.avif',
      imgAlt: 'AL Series Cobot AI precision system',
      features: [
        'High precision & repeatability for consistent task performance',
        'AI-powered automation of repetitive and heavy-duty tasks',
        'Reduces manual workload and optimizes production flow',
        'Enables consistent, high-quality performance across applications',
        'Future-ready automation compatible with Industry 4.0 ecosystems',
      ],
    },
    industries: {
      sectionLabel: 'Use Cases',
      title: 'Industries That We Serve',
      subtitle:
        'AL Series cobots are built to deliver precision automation across a wide range of industrial and manufacturing environments.',
      imgSrc: '/robots/cobot_industries.avif',
      imgAlt: 'AL Series Cobot serving across industries',
      features: [
        'Automotive & Auto Components',
        'Electronics & Semiconductors',
        'Food & Beverage',
        'Pharmaceuticals & Healthcare',
        'Consumer Goods & Packaging',
        'Metal Fabrication & Machining',
        'Logistics & Warehousing',
        'Research & Educational Labs',
      ],
    },
    packaging: {
      sectionLabel: "What's Included",
      title: "What's in the Box?",
      subtitle:
        'Everything you need to deploy your AL Series Cobot and get your production line running immediately.',
      imgSrc: '/robots/cobot_package.avif',
      imgAlt: 'AL Series Cobot full package contents',
      includes: [
        {
          item: '1× AL Series Cobot Arm',
          detail: 'Pre-assembled collaborative robot arm, ready for immediate workstation integration.',
        },
        {
          item: '1× Controller Unit + Cable',
          detail: 'Dedicated cobot controller for programming, monitoring, and operation management.',
        },
        {
          item: '1× End Effector / Tool Mount',
          detail: 'AL-certified end effector compatible with a wide range of industrial accessories.',
        },
        {
          item: '1× User Manual',
          detail: 'Step-by-step setup, programming, calibration, and operational guide.',
        },
      ],
      ctaLabel: 'Download Spec Sheet',
      ctaLink: 'https://allbotix.s3.eu-north-1.amazonaws.com/ALLBOTIX_ROBOTICS_PROFILE.pdf',
    },
  },
];

export const getRobotById = (id) => ROBOTS.find((r) => r.id === id) ?? null;

export const getRobotsByCategory = (category) =>
  ROBOTS.filter((r) => r.category === category);

export const CATEGORIES = [...new Set(ROBOTS.map((r) => r.category))];