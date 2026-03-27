export const REGIONS = [
  {
    id: 'all',
    name: 'Global',
    query: '',
    section: '',
    color: '#6366f1',
    activeColor: '#818cf8',
  },
  {
    id: 'north-america',
    name: 'North America',
    query: 'United States OR Canada OR Mexico',
    section: '',
    color: '#ef4444',
    activeColor: '#f87171',
  },
  {
    id: 'south-america',
    name: 'South America',
    query: 'Brazil OR Argentina OR Colombia OR Chile OR Peru OR Venezuela',
    section: '',
    color: '#f97316',
    activeColor: '#fb923c',
  },
  {
    id: 'europe',
    name: 'Europe',
    query: 'Europe OR United Kingdom OR France OR Germany OR Spain OR Italy OR Poland',
    section: '',
    color: '#eab308',
    activeColor: '#facc15',
  },
  {
    id: 'russia',
    name: 'Russia / CIS',
    query: 'Russia OR Ukraine OR Kazakhstan OR Belarus OR Soviet',
    section: '',
    color: '#dc2626',
    activeColor: '#ef4444',
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    query: 'Middle East OR Israel OR Iran OR Saudi Arabia OR Syria OR Iraq OR Gaza',
    section: '',
    color: '#d97706',
    activeColor: '#f59e0b',
  },
  {
    id: 'africa',
    name: 'Africa',
    query: 'Africa OR Nigeria OR South Africa OR Egypt OR Kenya OR Ethiopia OR Congo',
    section: '',
    color: '#16a34a',
    activeColor: '#22c55e',
  },
  {
    id: 'south-asia',
    name: 'South Asia',
    query: 'India OR Pakistan OR Bangladesh OR Sri Lanka OR Nepal',
    section: '',
    color: '#0891b2',
    activeColor: '#06b6d4',
  },
  {
    id: 'east-asia',
    name: 'East Asia',
    query: 'China OR Japan OR South Korea OR Taiwan OR North Korea',
    section: '',
    color: '#7c3aed',
    activeColor: '#8b5cf6',
  },
  {
    id: 'southeast-asia',
    name: 'SE Asia',
    query: 'Southeast Asia OR Indonesia OR Philippines OR Vietnam OR Thailand OR Malaysia OR Singapore',
    section: '',
    color: '#0e7490',
    activeColor: '#0891b2',
  },
  {
    id: 'oceania',
    name: 'Oceania',
    query: 'Australia OR New Zealand OR Pacific',
    section: '',
    color: '#059669',
    activeColor: '#10b981',
  },
];

export const CATEGORIES = [
  { id: 'all',         name: 'All',         section: '',              color: '#6366f1' },
  { id: 'world',       name: 'World',       section: 'world',         color: '#ef4444' },
  { id: 'politics',    name: 'Politics',    section: 'politics',      color: '#f97316' },
  { id: 'business',    name: 'Finance',     section: 'business',      color: '#eab308' },
  { id: 'technology',  name: 'Technology',  section: 'technology',    color: '#22c55e' },
  { id: 'science',     name: 'Science',     section: 'science',       color: '#06b6d4' },
  { id: 'sport',       name: 'Sports',      section: 'sport',         color: '#3b82f6' },
  { id: 'culture',     name: 'Culture',     section: 'culture',       color: '#a855f7' },
  { id: 'environment', name: 'Climate',     section: 'environment',   color: '#10b981' },
  { id: 'media',       name: 'Media',       section: 'media',         color: '#ec4899' },
];

// ISO 3166-1 alpha-3 country codes mapped to region IDs
export const COUNTRY_REGION_MAP = {
  // North America
  USA: 'north-america', CAN: 'north-america', MEX: 'north-america',
  GTM: 'north-america', BLZ: 'north-america', HND: 'north-america',
  SLV: 'north-america', NIC: 'north-america', CRI: 'north-america',
  PAN: 'north-america', CUB: 'north-america', JAM: 'north-america',
  HTI: 'north-america', DOM: 'north-america', PRI: 'north-america',
  TTO: 'north-america', BHS: 'north-america',

  // South America
  BRA: 'south-america', ARG: 'south-america', COL: 'south-america',
  CHL: 'south-america', PER: 'south-america', VEN: 'south-america',
  ECU: 'south-america', BOL: 'south-america', PRY: 'south-america',
  URY: 'south-america', GUY: 'south-america', SUR: 'south-america',
  GUF: 'south-america',

  // Europe
  GBR: 'europe', FRA: 'europe', DEU: 'europe', ITA: 'europe', ESP: 'europe',
  PRT: 'europe', NLD: 'europe', BEL: 'europe', LUX: 'europe', CHE: 'europe',
  AUT: 'europe', POL: 'europe', CZE: 'europe', SVK: 'europe', HUN: 'europe',
  ROU: 'europe', BGR: 'europe', GRC: 'europe', SRB: 'europe', HRV: 'europe',
  SVN: 'europe', BIH: 'europe', MKD: 'europe', ALB: 'europe', MNE: 'europe',
  SWE: 'europe', NOR: 'europe', DNK: 'europe', FIN: 'europe', ISL: 'europe',
  IRL: 'europe', EST: 'europe', LVA: 'europe', LTU: 'europe', MLT: 'europe',
  CYP: 'europe', AND: 'europe', MCO: 'europe', SMR: 'europe', VAT: 'europe',
  LIE: 'europe', XKX: 'europe',

  // Russia / CIS
  RUS: 'russia', UKR: 'russia', BLR: 'russia', KAZ: 'russia',
  UZB: 'russia', TJK: 'russia', KGZ: 'russia', TKM: 'russia',
  AZE: 'russia', ARM: 'russia', GEO: 'russia', MDA: 'russia',

  // Middle East
  IRN: 'middle-east', IRQ: 'middle-east', SYR: 'middle-east', LBN: 'middle-east',
  ISR: 'middle-east', JOR: 'middle-east', SAU: 'middle-east', YEM: 'middle-east',
  OMN: 'middle-east', ARE: 'middle-east', QAT: 'middle-east', KWT: 'middle-east',
  BHR: 'middle-east', TUR: 'middle-east', PSE: 'middle-east',

  // Africa
  NGA: 'africa', ZAF: 'africa', EGY: 'africa', KEN: 'africa', ETH: 'africa',
  GHA: 'africa', TZA: 'africa', UGA: 'africa', DZA: 'africa', MAR: 'africa',
  MOZ: 'africa', MDG: 'africa', CMR: 'africa', CIV: 'africa', NER: 'africa',
  BFA: 'africa', MLI: 'africa', SEN: 'africa', GIN: 'africa', ZMB: 'africa',
  ZWE: 'africa', SDN: 'africa', SSD: 'africa', LBY: 'africa', TUN: 'africa',
  AGO: 'africa', SOM: 'africa', RWA: 'africa', BDI: 'africa', COD: 'africa',
  CAF: 'africa', TCD: 'africa', COG: 'africa', GAB: 'africa', GNQ: 'africa',
  BWA: 'africa', NAM: 'africa', LSO: 'africa', SWZ: 'africa', MWI: 'africa',
  ERI: 'africa', DJI: 'africa', COM: 'africa', CPV: 'africa', STP: 'africa',
  GNB: 'africa', SLE: 'africa', LBR: 'africa', TGO: 'africa', BEN: 'africa',
  MRT: 'africa', GMB: 'africa',

  // South Asia
  IND: 'south-asia', PAK: 'south-asia', BGD: 'south-asia', LKA: 'south-asia',
  NPL: 'south-asia', BTN: 'south-asia', MDV: 'south-asia', AFG: 'south-asia',

  // East Asia
  CHN: 'east-asia', JPN: 'east-asia', KOR: 'east-asia', PRK: 'east-asia',
  TWN: 'east-asia', MNG: 'east-asia',

  // SE Asia
  IDN: 'southeast-asia', PHL: 'southeast-asia', VNM: 'southeast-asia',
  THA: 'southeast-asia', MYS: 'southeast-asia', SGP: 'southeast-asia',
  MMR: 'southeast-asia', KHM: 'southeast-asia', LAO: 'southeast-asia',
  BRN: 'southeast-asia', TLS: 'southeast-asia',

  // Oceania
  AUS: 'oceania', NZL: 'oceania', PNG: 'oceania', FJI: 'oceania',
  SLB: 'oceania', VUT: 'oceania', WSM: 'oceania', TON: 'oceania',
  FSM: 'oceania', KIR: 'oceania', MHL: 'oceania', NRU: 'oceania',
  PLW: 'oceania', TUV: 'oceania',
};
