// Major world cities with coordinates and region
export const CITIES = [
  // North America
  { name: 'New York',       lat: 40.71,  lng: -74.01, region: 'north-america', capital: false },
  { name: 'Los Angeles',    lat: 34.05,  lng: -118.24, region: 'north-america', capital: false },
  { name: 'Chicago',        lat: 41.88,  lng: -87.63,  region: 'north-america', capital: false },
  { name: 'Washington DC',  lat: 38.91,  lng: -77.04,  region: 'north-america', capital: true  },
  { name: 'Toronto',        lat: 43.65,  lng: -79.38,  region: 'north-america', capital: false },
  { name: 'Ottawa',         lat: 45.42,  lng: -75.69,  region: 'north-america', capital: true  },
  { name: 'Mexico City',    lat: 19.43,  lng: -99.13,  region: 'north-america', capital: true  },
  { name: 'Vancouver',      lat: 49.28,  lng: -123.12, region: 'north-america', capital: false },
  { name: 'Miami',          lat: 25.77,  lng: -80.19,  region: 'north-america', capital: false },

  // South America
  { name: 'São Paulo',      lat: -23.55, lng: -46.63,  region: 'south-america', capital: false },
  { name: 'Buenos Aires',   lat: -34.60, lng: -58.38,  region: 'south-america', capital: true  },
  { name: 'Rio de Janeiro', lat: -22.91, lng: -43.17,  region: 'south-america', capital: false },
  { name: 'Bogotá',         lat:  4.71,  lng: -74.07,  region: 'south-america', capital: true  },
  { name: 'Lima',           lat: -12.05, lng: -77.04,  region: 'south-america', capital: true  },
  { name: 'Santiago',       lat: -33.45, lng: -70.67,  region: 'south-america', capital: true  },
  { name: 'Caracas',        lat: 10.48,  lng: -66.88,  region: 'south-america', capital: true  },

  // Europe
  { name: 'London',         lat: 51.51,  lng: -0.13,   region: 'europe', capital: true  },
  { name: 'Paris',          lat: 48.85,  lng:  2.35,   region: 'europe', capital: true  },
  { name: 'Berlin',         lat: 52.52,  lng: 13.40,   region: 'europe', capital: true  },
  { name: 'Madrid',         lat: 40.42,  lng: -3.70,   region: 'europe', capital: true  },
  { name: 'Rome',           lat: 41.90,  lng: 12.50,   region: 'europe', capital: true  },
  { name: 'Amsterdam',      lat: 52.37,  lng:  4.90,   region: 'europe', capital: true  },
  { name: 'Brussels',       lat: 50.85,  lng:  4.35,   region: 'europe', capital: true  },
  { name: 'Vienna',         lat: 48.21,  lng: 16.37,   region: 'europe', capital: true  },
  { name: 'Warsaw',         lat: 52.23,  lng: 21.01,   region: 'europe', capital: true  },
  { name: 'Stockholm',      lat: 59.33,  lng: 18.07,   region: 'europe', capital: true  },
  { name: 'Athens',         lat: 37.98,  lng: 23.73,   region: 'europe', capital: true  },
  { name: 'Zürich',         lat: 47.38,  lng:  8.54,   region: 'europe', capital: false },

  // Russia / CIS
  { name: 'Moscow',         lat: 55.75,  lng: 37.62,   region: 'russia', capital: true  },
  { name: 'St. Petersburg', lat: 59.93,  lng: 30.32,   region: 'russia', capital: false },
  { name: 'Kyiv',           lat: 50.45,  lng: 30.52,   region: 'russia', capital: true  },
  { name: 'Minsk',          lat: 53.90,  lng: 27.57,   region: 'russia', capital: true  },
  { name: 'Almaty',         lat: 43.26,  lng: 76.95,   region: 'russia', capital: false },
  { name: 'Tashkent',       lat: 41.30,  lng: 69.24,   region: 'russia', capital: true  },
  { name: 'Novosibirsk',    lat: 54.99,  lng: 82.90,   region: 'russia', capital: false },

  // Middle East
  { name: 'Istanbul',       lat: 41.01,  lng: 28.95,   region: 'middle-east', capital: false },
  { name: 'Ankara',         lat: 39.93,  lng: 32.86,   region: 'middle-east', capital: true  },
  { name: 'Dubai',          lat: 25.20,  lng: 55.27,   region: 'middle-east', capital: false },
  { name: 'Riyadh',         lat: 24.69,  lng: 46.72,   region: 'middle-east', capital: true  },
  { name: 'Baghdad',        lat: 33.34,  lng: 44.40,   region: 'middle-east', capital: true  },
  { name: 'Tehran',         lat: 35.69,  lng: 51.39,   region: 'middle-east', capital: true  },
  { name: 'Tel Aviv',       lat: 32.08,  lng: 34.78,   region: 'middle-east', capital: false },
  { name: 'Beirut',         lat: 33.89,  lng: 35.50,   region: 'middle-east', capital: true  },
  { name: 'Doha',           lat: 25.29,  lng: 51.53,   region: 'middle-east', capital: true  },
  { name: 'Kuwait City',    lat: 29.37,  lng: 47.98,   region: 'middle-east', capital: true  },

  // Africa
  { name: 'Cairo',          lat: 30.04,  lng: 31.24,   region: 'africa', capital: true  },
  { name: 'Lagos',          lat:  6.52,  lng:  3.38,   region: 'africa', capital: false },
  { name: 'Kinshasa',       lat: -4.32,  lng: 15.32,   region: 'africa', capital: true  },
  { name: 'Johannesburg',   lat: -26.20, lng: 28.04,   region: 'africa', capital: false },
  { name: 'Cape Town',      lat: -33.93, lng: 18.42,   region: 'africa', capital: false },
  { name: 'Nairobi',        lat: -1.29,  lng: 36.82,   region: 'africa', capital: true  },
  { name: 'Addis Ababa',    lat:  9.03,  lng: 38.74,   region: 'africa', capital: true  },
  { name: 'Dar es Salaam',  lat: -6.79,  lng: 39.21,   region: 'africa', capital: false },
  { name: 'Casablanca',     lat: 33.59,  lng: -7.62,   region: 'africa', capital: false },
  { name: 'Accra',          lat:  5.56,  lng: -0.20,   region: 'africa', capital: true  },
  { name: 'Khartoum',       lat: 15.55,  lng: 32.53,   region: 'africa', capital: true  },

  // South Asia
  { name: 'Mumbai',         lat: 19.08,  lng: 72.88,   region: 'south-asia', capital: false },
  { name: 'Delhi',          lat: 28.66,  lng: 77.23,   region: 'south-asia', capital: true  },
  { name: 'Dhaka',          lat: 23.81,  lng: 90.41,   region: 'south-asia', capital: true  },
  { name: 'Karachi',        lat: 24.86,  lng: 67.01,   region: 'south-asia', capital: false },
  { name: 'Islamabad',      lat: 33.72,  lng: 73.04,   region: 'south-asia', capital: true  },
  { name: 'Colombo',        lat:  6.93,  lng: 79.85,   region: 'south-asia', capital: false },
  { name: 'Bangalore',      lat: 12.97,  lng: 77.59,   region: 'south-asia', capital: false },
  { name: 'Kathmandu',      lat: 27.71,  lng: 85.31,   region: 'south-asia', capital: true  },

  // East Asia
  { name: 'Beijing',        lat: 39.91,  lng: 116.39,  region: 'east-asia', capital: true  },
  { name: 'Shanghai',       lat: 31.23,  lng: 121.47,  region: 'east-asia', capital: false },
  { name: 'Tokyo',          lat: 35.69,  lng: 139.69,  region: 'east-asia', capital: true  },
  { name: 'Seoul',          lat: 37.57,  lng: 126.98,  region: 'east-asia', capital: true  },
  { name: 'Hong Kong',      lat: 22.32,  lng: 114.17,  region: 'east-asia', capital: false },
  { name: 'Taipei',         lat: 25.05,  lng: 121.53,  region: 'east-asia', capital: true  },
  { name: 'Osaka',          lat: 34.69,  lng: 135.50,  region: 'east-asia', capital: false },
  { name: 'Shenzhen',       lat: 22.54,  lng: 114.06,  region: 'east-asia', capital: false },
  { name: 'Ulaanbaatar',    lat: 47.91,  lng: 106.92,  region: 'east-asia', capital: true  },

  // SE Asia
  { name: 'Jakarta',        lat: -6.21,  lng: 106.85,  region: 'southeast-asia', capital: true  },
  { name: 'Manila',         lat: 14.60,  lng: 120.98,  region: 'southeast-asia', capital: true  },
  { name: 'Bangkok',        lat: 13.75,  lng: 100.52,  region: 'southeast-asia', capital: true  },
  { name: 'Kuala Lumpur',   lat:  3.15,  lng: 101.69,  region: 'southeast-asia', capital: true  },
  { name: 'Singapore',      lat:  1.35,  lng: 103.82,  region: 'southeast-asia', capital: true  },
  { name: 'Ho Chi Minh',    lat: 10.82,  lng: 106.63,  region: 'southeast-asia', capital: false },
  { name: 'Hanoi',          lat: 21.03,  lng: 105.85,  region: 'southeast-asia', capital: true  },
  { name: 'Yangon',         lat: 16.87,  lng: 96.19,   region: 'southeast-asia', capital: false },

  // Oceania
  { name: 'Sydney',         lat: -33.87, lng: 151.21,  region: 'oceania', capital: false },
  { name: 'Melbourne',      lat: -37.81, lng: 144.96,  region: 'oceania', capital: false },
  { name: 'Canberra',       lat: -35.28, lng: 149.13,  region: 'oceania', capital: true  },
  { name: 'Auckland',       lat: -36.85, lng: 174.76,  region: 'oceania', capital: false },
  { name: 'Wellington',     lat: -41.29, lng: 174.78,  region: 'oceania', capital: true  },
  { name: 'Brisbane',       lat: -27.47, lng: 153.03,  region: 'oceania', capital: false },
  { name: 'Perth',          lat: -31.95, lng: 115.86,  region: 'oceania', capital: false },
]
