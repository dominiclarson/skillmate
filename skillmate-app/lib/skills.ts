// lib/skills.ts

export interface Skill {
  id: string;           // unique identifier, e.g. kebab‑case of name
  name: string;
  emoji: string;
  description: string;
}

export const skills: Skill[] = [
  {
    id: '1',
    name: 'Vehicle Mechanic',
    emoji: '🚗',
    description:
      'Diagnose, repair, and maintain cars, trucks, and other motor vehicles including engines, transmissions, brakes, and electrical systems to keep vehicles running safely and efficiently.',
  },
  {
    id: '2',
    name: 'Farm / Industrial Mechanic',
    emoji: '🚜',
    description:
      'Maintain and repair agricultural equipment, construction machinery, and industrial systems to ensure optimal performance in farming operations and heavy‑duty industrial environments.',
  },
  {
    id: '3',
    name: 'Machinist',
    emoji: '⚙️',
    description:
      'Operate precision tools and machinery to create custom metal parts, components, and prototypes according to technical specifications and blueprints with high accuracy and quality standards.',
  },
  {
    id: '4',
    name: 'Welder',
    emoji: '🔥',
    description:
      'Join metals and other materials using various welding techniques including arc, MIG, TIG, and oxy‑fuel welding to create strong, durable connections for construction and manufacturing projects.',
  },
  {
    id: '5',
    name: 'Fabricator',
    emoji: '🔨',
    description:
      'Design, cut, shape, and assemble metal structures and components using specialized tools and techniques to create custom metalwork for construction, art, and industrial applications.',
  },
  {
    id: '6',
    name: 'Carpenter / Woodworker',
    emoji: '🧰',
    description:
      'Build, repair, and install wooden structures, furniture, and fixtures using traditional and modern woodworking techniques, tools, and materials for residential and commercial projects.',
  },
  {
    id: '7',
    name: 'Plumber',
    emoji: '🔧',
    description:
      'Install, maintain, and repair water supply systems, drainage systems, and plumbing fixtures to ensure proper water flow and sanitation in residential and commercial buildings.',
  },
  {
    id: '8',
    name: 'Electrician',
    emoji: '⚡',
    description:
      'Install, maintain, and repair electrical wiring, outlets, panels, and systems while ensuring safety compliance and proper electrical code adherence for homes and businesses.',
  },
  {
    id: '9',
    name: 'Computer Repair / Building',
    emoji: '💻',
    description:
      'Diagnose hardware and software issues, assemble custom computers, upgrade components, and provide technical support to restore and optimize computer system performance.',
  },
  {
    id: '10',
    name: 'Mobile device repair',
    emoji: '📱',
    description:
      'Repair smartphones, tablets, and other mobile devices including screen replacements, battery changes, and software troubleshooting to restore full functionality and performance.',
  },
  {
    id: '11',
    name: 'Chef',
    emoji: '👨‍🍳',
    description:
      'Prepare, cook, and present high‑quality meals using culinary techniques, recipe development, and food safety practices to create memorable dining experiences for customers.',
  },
  {
    id: '12',
    name: 'Roofing/Framing',
    emoji: '🏠',
    description:
      'Install, repair, and maintain roofing systems and structural framing for buildings, ensuring weather protection and structural integrity using proper materials and techniques.',
  },
  {
    id: '13',
    name: 'Finish work (trim, paint)',
    emoji: '🎨',
    description:
      'Apply final decorative and protective finishes to buildings including painting, trim installation, and detail work to enhance appearance and protect surfaces from wear.',
  },
  {
    id: '14',
    name: 'Structural Engineer',
    emoji: '🏗️',
    description:
      'Design and analyze building structures, bridges, and other infrastructure to ensure safety, stability, and compliance with building codes and engineering standards.',
  },
  {
    id: '15',
    name: 'HVAC',
    emoji: '🌡️',
    description:
      'Install, maintain, and repair heating, ventilation, and air conditioning systems to provide comfortable indoor environments and optimal air quality for buildings.',
  },
  {
    id: '16',
    name: 'Gunsmith',
    emoji: '🔫',
    description:
      'Repair, modify, and maintain firearms including cleaning, parts replacement, and custom modifications while ensuring safety and compliance with applicable laws and regulations.',
  },
  {
    id: '17',
    name: 'Artist',
    emoji: '🎭',
    description:
      'Create original visual artworks using various media and techniques including painting, drawing, sculpture, and digital art to express creativity and communicate ideas through visual means.',
  },
  {
    id: '18',
    name: 'Musician',
    emoji: '🎵',
    description:
      'Perform, compose, and arrange music using instruments or vocals, including live performances, recording sessions, and music education to entertain and inspire audiences.',
  },
  {
    id: '19',
    name: 'Manufacturing',
    emoji: '🏭',
    description:
      'Operate production equipment, manage manufacturing processes, and ensure quality control in industrial settings to produce goods efficiently and meet production targets.',
  },
  {
    id: '20',
    name: 'Programmer',
    emoji: '💻',
    description:
      'Write, test, and maintain software code using various programming languages and frameworks to create applications, websites, and systems that solve real‑world problems.',
  },
  {
    id: '21',
    name: 'Web designer',
    emoji: '🌐',
    description:
      'Design and create visually appealing, user‑friendly websites using HTML, CSS, JavaScript, and design tools to deliver engaging digital experiences across devices and platforms.',
  },
  {
    id: '22',
    name: 'System Administrator',
    emoji: '🖥️',
    description:
      'Manage and maintain computer networks, servers, and IT infrastructure to ensure system reliability, security, and optimal performance for organizations and users.',
  },
  {
    id: '23',
    name: 'Database Administrator',
    emoji: '🗄️',
    description:
      'Design, implement, and maintain database systems to ensure data integrity, security, and optimal performance while managing backup, recovery, and user access controls.',
  },
  {
    id: '24',
    name: 'Networking Engineer',
    emoji: '🌐',
    description:
      'Design, implement, and maintain computer networks including routers, switches, and security systems to ensure reliable connectivity and data communication between devices.',
  },
];

export const allSections = skills;

export const findFirstSection = (): Skill => skills[0];
