// tag: Guardian's built-in geographic tag (most accurate for filtering)
// query: fallback text search when no precise tag exists
export const REGIONS = [
  {
    id: 'all',
    name: 'Global',
    tag: null,
    query: null,
    color: '#6366f1',
    activeColor: '#818cf8',
  },
  {
    id: 'north-america',
    name: 'North America',
    tag: null,
    query: '"United States" OR "North America" OR Canada OR Mexico',
    color: '#ef4444',
    activeColor: '#f87171',
  },
  {
    id: 'south-america',
    name: 'South America',
    tag: null,
    query: '"South America" OR Brazil OR Argentina OR Colombia OR Chile OR Peru OR Venezuela',
    color: '#f97316',
    activeColor: '#fb923c',
  },
  {
    id: 'europe',
    name: 'Europe',
    tag: 'world/europe-news',
    query: null,
    color: '#eab308',
    activeColor: '#facc15',
  },
  {
    id: 'russia',
    name: 'Russia / CIS',
    tag: 'world/russia',
    query: null,
    color: '#dc2626',
    activeColor: '#ef4444',
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    tag: 'world/middleeast',
    query: null,
    color: '#d97706',
    activeColor: '#f59e0b',
  },
  {
    id: 'africa',
    name: 'Africa',
    tag: 'world/africa',
    query: null,
    color: '#16a34a',
    activeColor: '#22c55e',
  },
  {
    id: 'south-asia',
    name: 'South Asia',
    tag: 'world/india',
    query: '"South Asia" OR India OR Pakistan OR Bangladesh OR "Sri Lanka"',
    color: '#0891b2',
    activeColor: '#06b6d4',
  },
  {
    id: 'east-asia',
    name: 'East Asia',
    tag: 'world/china',
    query: '"East Asia" OR China OR Japan OR "South Korea" OR Taiwan',
    color: '#7c3aed',
    activeColor: '#8b5cf6',
  },
  {
    id: 'southeast-asia',
    name: 'SE Asia',
    tag: null,
    query: '"Southeast Asia" OR Indonesia OR Philippines OR Vietnam OR Thailand OR Malaysia OR Singapore',
    color: '#0e7490',
    activeColor: '#0891b2',
  },
  {
    id: 'oceania',
    name: 'Oceania',
    tag: null,
    // Guardian Australia content lives under the 'australia-news' section,
    // not a world tag. Use section param + query fallback.
    regionSection: 'australia-news',
    query: 'Australia OR "New Zealand"',
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

// ISO 3166-1 numeric country codes mapped to region IDs
// (world-atlas topojson uses numeric IDs, not alpha-3)
export const COUNTRY_REGION_MAP = {
  // North America
  '840': 'north-america', // USA
  '124': 'north-america', // Canada
  '484': 'north-america', // Mexico
  '320': 'north-america', // Guatemala
  '084': 'north-america', // Belize
  '340': 'north-america', // Honduras
  '222': 'north-america', // El Salvador
  '558': 'north-america', // Nicaragua
  '188': 'north-america', // Costa Rica
  '591': 'north-america', // Panama
  '192': 'north-america', // Cuba
  '388': 'north-america', // Jamaica
  '332': 'north-america', // Haiti
  '214': 'north-america', // Dominican Republic
  '630': 'north-america', // Puerto Rico
  '780': 'north-america', // Trinidad and Tobago
  '044': 'north-america', // Bahamas

  // South America
  '076': 'south-america', // Brazil
  '032': 'south-america', // Argentina
  '170': 'south-america', // Colombia
  '152': 'south-america', // Chile
  '604': 'south-america', // Peru
  '862': 'south-america', // Venezuela
  '218': 'south-america', // Ecuador
  '068': 'south-america', // Bolivia
  '600': 'south-america', // Paraguay
  '858': 'south-america', // Uruguay
  '328': 'south-america', // Guyana
  '740': 'south-america', // Suriname

  // Europe
  '826': 'europe', // UK
  '250': 'europe', // France
  '276': 'europe', // Germany
  '380': 'europe', // Italy
  '724': 'europe', // Spain
  '620': 'europe', // Portugal
  '528': 'europe', // Netherlands
  '056': 'europe', // Belgium
  '442': 'europe', // Luxembourg
  '756': 'europe', // Switzerland
  '040': 'europe', // Austria
  '616': 'europe', // Poland
  '203': 'europe', // Czech Republic
  '703': 'europe', // Slovakia
  '348': 'europe', // Hungary
  '642': 'europe', // Romania
  '100': 'europe', // Bulgaria
  '300': 'europe', // Greece
  '688': 'europe', // Serbia
  '191': 'europe', // Croatia
  '705': 'europe', // Slovenia
  '070': 'europe', // Bosnia
  '807': 'europe', // North Macedonia
  '008': 'europe', // Albania
  '499': 'europe', // Montenegro
  '752': 'europe', // Sweden
  '578': 'europe', // Norway
  '208': 'europe', // Denmark
  '246': 'europe', // Finland
  '352': 'europe', // Iceland
  '372': 'europe', // Ireland
  '233': 'europe', // Estonia
  '428': 'europe', // Latvia
  '440': 'europe', // Lithuania
  '470': 'europe', // Malta
  '196': 'europe', // Cyprus

  // Russia / CIS
  '643': 'russia', // Russia
  '804': 'russia', // Ukraine
  '112': 'russia', // Belarus
  '398': 'russia', // Kazakhstan
  '860': 'russia', // Uzbekistan
  '762': 'russia', // Tajikistan
  '417': 'russia', // Kyrgyzstan
  '795': 'russia', // Turkmenistan
  '031': 'russia', // Azerbaijan
  '051': 'russia', // Armenia
  '268': 'russia', // Georgia
  '498': 'russia', // Moldova

  // Middle East
  '364': 'middle-east', // Iran
  '368': 'middle-east', // Iraq
  '760': 'middle-east', // Syria
  '422': 'middle-east', // Lebanon
  '376': 'middle-east', // Israel
  '400': 'middle-east', // Jordan
  '682': 'middle-east', // Saudi Arabia
  '887': 'middle-east', // Yemen
  '512': 'middle-east', // Oman
  '784': 'middle-east', // UAE
  '634': 'middle-east', // Qatar
  '414': 'middle-east', // Kuwait
  '048': 'middle-east', // Bahrain
  '792': 'middle-east', // Turkey
  '275': 'middle-east', // Palestine

  // Africa
  '566': 'africa', // Nigeria
  '710': 'africa', // South Africa
  '818': 'africa', // Egypt
  '404': 'africa', // Kenya
  '231': 'africa', // Ethiopia
  '288': 'africa', // Ghana
  '834': 'africa', // Tanzania
  '800': 'africa', // Uganda
  '012': 'africa', // Algeria
  '504': 'africa', // Morocco
  '508': 'africa', // Mozambique
  '450': 'africa', // Madagascar
  '120': 'africa', // Cameroon
  '384': 'africa', // Ivory Coast
  '562': 'africa', // Niger
  '854': 'africa', // Burkina Faso
  '466': 'africa', // Mali
  '686': 'africa', // Senegal
  '324': 'africa', // Guinea
  '894': 'africa', // Zambia
  '716': 'africa', // Zimbabwe
  '729': 'africa', // Sudan
  '728': 'africa', // South Sudan
  '434': 'africa', // Libya
  '788': 'africa', // Tunisia
  '024': 'africa', // Angola
  '706': 'africa', // Somalia
  '646': 'africa', // Rwanda
  '108': 'africa', // Burundi
  '180': 'africa', // DR Congo
  '140': 'africa', // Central African Republic
  '148': 'africa', // Chad
  '178': 'africa', // Congo
  '266': 'africa', // Gabon
  '226': 'africa', // Equatorial Guinea
  '072': 'africa', // Botswana
  '516': 'africa', // Namibia
  '426': 'africa', // Lesotho
  '748': 'africa', // Eswatini
  '454': 'africa', // Malawi
  '232': 'africa', // Eritrea
  '262': 'africa', // Djibouti
  '174': 'africa', // Comoros
  '132': 'africa', // Cape Verde
  '678': 'africa', // Sao Tome
  '624': 'africa', // Guinea-Bissau
  '694': 'africa', // Sierra Leone
  '430': 'africa', // Liberia
  '768': 'africa', // Togo
  '204': 'africa', // Benin
  '478': 'africa', // Mauritania
  '270': 'africa', // Gambia

  // South Asia
  '356': 'south-asia', // India
  '586': 'south-asia', // Pakistan
  '050': 'south-asia', // Bangladesh
  '144': 'south-asia', // Sri Lanka
  '524': 'south-asia', // Nepal
  '064': 'south-asia', // Bhutan
  '462': 'south-asia', // Maldives
  '004': 'south-asia', // Afghanistan

  // East Asia
  '156': 'east-asia', // China
  '392': 'east-asia', // Japan
  '410': 'east-asia', // South Korea
  '408': 'east-asia', // North Korea
  '158': 'east-asia', // Taiwan
  '496': 'east-asia', // Mongolia

  // SE Asia
  '360': 'southeast-asia', // Indonesia
  '608': 'southeast-asia', // Philippines
  '704': 'southeast-asia', // Vietnam
  '764': 'southeast-asia', // Thailand
  '458': 'southeast-asia', // Malaysia
  '702': 'southeast-asia', // Singapore
  '104': 'southeast-asia', // Myanmar
  '116': 'southeast-asia', // Cambodia
  '418': 'southeast-asia', // Laos
  '096': 'southeast-asia', // Brunei
  '626': 'southeast-asia', // Timor-Leste

  // Oceania
  '036': 'oceania', // Australia
  '554': 'oceania', // New Zealand
  '598': 'oceania', // Papua New Guinea
  '242': 'oceania', // Fiji
  '090': 'oceania', // Solomon Islands
  '548': 'oceania', // Vanuatu
  '882': 'oceania', // Samoa
  '776': 'oceania', // Tonga
  '583': 'oceania', // Micronesia
  '296': 'oceania', // Kiribati
  '584': 'oceania', // Marshall Islands
  '520': 'oceania', // Nauru
  '585': 'oceania', // Palau
  '798': 'oceania', // Tuvalu
};
