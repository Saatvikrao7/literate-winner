// Major global stock market indices
// symbol: Yahoo Finance ticker  lat/lng: exchange city location
export const MARKETS = [
  // ── United States ──────────────────────────────────────────────────────
  { id: 'sp500',   symbol: '^GSPC',    name: 'S&P 500',     flag: '🇺🇸', country: 'USA',         lat: 40.71, lng: -74.01, importance: 5 },
  { id: 'nasdaq',  symbol: '^IXIC',    name: 'NASDAQ',      flag: '🇺🇸', country: 'USA',         lat: 40.73, lng: -73.99, importance: 4 },
  { id: 'dow',     symbol: '^DJI',     name: 'Dow Jones',   flag: '🇺🇸', country: 'USA',         lat: 40.70, lng: -74.01, importance: 4 },
  { id: 'voo',     symbol: 'VOO',      name: 'VOO ETF',     flag: '🇺🇸', country: 'USA',         lat: 40.69, lng: -74.03, importance: 3 },

  // ── India ───────────────────────────────────────────────────────────────
  { id: 'nifty',   symbol: '^NSEI',    name: 'Nifty 50',    flag: '🇮🇳', country: 'India',       lat: 19.08, lng: 72.88,  importance: 4 },
  { id: 'sensex',  symbol: '^BSESN',   name: 'Sensex',      flag: '🇮🇳', country: 'India',       lat: 18.93, lng: 72.83,  importance: 3 },

  // ── United Kingdom ──────────────────────────────────────────────────────
  { id: 'ftse',    symbol: '^FTSE',    name: 'FTSE 100',    flag: '🇬🇧', country: 'UK',          lat: 51.51, lng: -0.09,  importance: 4 },

  // ── Germany ─────────────────────────────────────────────────────────────
  { id: 'dax',     symbol: '^GDAXI',   name: 'DAX',         flag: '🇩🇪', country: 'Germany',     lat: 50.11, lng:  8.68,  importance: 4 },

  // ── France ──────────────────────────────────────────────────────────────
  { id: 'cac40',   symbol: '^FCHI',    name: 'CAC 40',      flag: '🇫🇷', country: 'France',      lat: 48.87, lng:  2.31,  importance: 3 },

  // ── Japan ───────────────────────────────────────────────────────────────
  { id: 'nikkei',  symbol: '^N225',    name: 'Nikkei 225',  flag: '🇯🇵', country: 'Japan',       lat: 35.69, lng: 139.69, importance: 4 },

  // ── Hong Kong ───────────────────────────────────────────────────────────
  { id: 'hsi',     symbol: '^HSI',     name: 'Hang Seng',   flag: '🇭🇰', country: 'Hong Kong',   lat: 22.28, lng: 114.16, importance: 4 },

  // ── China ───────────────────────────────────────────────────────────────
  { id: 'sse',     symbol: '000001.SS',name: 'Shanghai',    flag: '🇨🇳', country: 'China',       lat: 31.23, lng: 121.47, importance: 3 },

  // ── South Korea ─────────────────────────────────────────────────────────
  { id: 'kospi',   symbol: '^KS11',    name: 'KOSPI',       flag: '🇰🇷', country: 'S. Korea',    lat: 37.57, lng: 126.98, importance: 3 },

  // ── Australia ───────────────────────────────────────────────────────────
  { id: 'asx',     symbol: '^AXJO',    name: 'ASX 200',     flag: '🇦🇺', country: 'Australia',   lat: -33.87,lng: 151.21, importance: 3 },

  // ── Canada ──────────────────────────────────────────────────────────────
  { id: 'tsx',     symbol: '^GSPTSE',  name: 'TSX',         flag: '🇨🇦', country: 'Canada',      lat: 43.65, lng: -79.38, importance: 3 },

  // ── Brazil ──────────────────────────────────────────────────────────────
  { id: 'bovespa', symbol: '^BVSP',    name: 'Bovespa',     flag: '🇧🇷', country: 'Brazil',      lat: -23.55,lng: -46.63, importance: 3 },

  // ── Singapore ───────────────────────────────────────────────────────────
  { id: 'sti',     symbol: '^STI',     name: 'Straits Times',flag: '🇸🇬',country: 'Singapore',   lat:  1.28, lng: 103.85, importance: 2 },

  // ── South Africa ────────────────────────────────────────────────────────
  { id: 'jse',     symbol: '^J203.JO', name: 'JSE All Share',flag: '🇿🇦',country: 'South Africa',lat: -26.20,lng:  28.04, importance: 2 },
]

export const ALL_SYMBOLS = MARKETS.map(m => m.symbol).join(',')

// Maps numeric ISO-3166 country id → single representative market id
// Used by GlobeMap to colour countries by market performance
export const COUNTRY_MARKET_MAP = {
  '840': 'sp500',    // USA
  '356': 'nifty',    // India
  '826': 'ftse',     // United Kingdom
  '276': 'dax',      // Germany
  '250': 'cac40',    // France
  '392': 'nikkei',   // Japan
  '344': 'hsi',      // Hong Kong
  '156': 'sse',      // China
  '410': 'kospi',    // South Korea
  '36':  'asx',      // Australia
  '124': 'tsx',      // Canada
  '76':  'bovespa',  // Brazil
  '702': 'sti',      // Singapore
  '710': 'jse',      // South Africa
}
