// Market trading hours: [open_hour, open_min, close_hour, close_min] in local exchange time
const SCHEDULE = {
  sp500:   { tz: 'America/New_York',       hours: [9, 30, 16, 0]  },
  nasdaq:  { tz: 'America/New_York',       hours: [9, 30, 16, 0]  },
  dow:     { tz: 'America/New_York',       hours: [9, 30, 16, 0]  },
  voo:     { tz: 'America/New_York',       hours: [9, 30, 16, 0]  },
  nifty:   { tz: 'Asia/Kolkata',           hours: [9, 15, 15, 30] },
  sensex:  { tz: 'Asia/Kolkata',           hours: [9, 15, 15, 30] },
  ftse:    { tz: 'Europe/London',          hours: [8, 0,  16, 30] },
  dax:     { tz: 'Europe/Berlin',          hours: [9, 0,  17, 30] },
  cac40:   { tz: 'Europe/Paris',           hours: [9, 0,  17, 30] },
  nikkei:  { tz: 'Asia/Tokyo',             hours: [9, 0,  15, 30] },
  hsi:     { tz: 'Asia/Hong_Kong',         hours: [9, 30, 16, 0]  },
  sse:     { tz: 'Asia/Shanghai',          hours: [9, 30, 15, 0]  },
  kospi:   { tz: 'Asia/Seoul',             hours: [9, 0,  15, 30] },
  asx:     { tz: 'Australia/Sydney',       hours: [10, 0, 16, 0]  },
  tsx:     { tz: 'America/Toronto',        hours: [9, 30, 16, 0]  },
  bovespa: { tz: 'America/Sao_Paulo',      hours: [10, 0, 17, 0]  },
  sti:     { tz: 'Asia/Singapore',         hours: [9, 0,  17, 0]  },
  jse:     { tz: 'Africa/Johannesburg',    hours: [9, 0,  17, 0]  },
}

function localParts(tz, date) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(f.formatToParts(date).map(p => [p.type, p.value]))
  return {
    weekday: parts.weekday, // 'Mon', 'Tue', etc.
    hour:    parseInt(parts.hour, 10),
    minute:  parseInt(parts.minute, 10),
  }
}

export function isMarketOpen(marketId, date = new Date()) {
  const s = SCHEDULE[marketId]
  if (!s) return false
  try {
    const { weekday, hour, minute } = localParts(s.tz, date)
    if (weekday === 'Sat' || weekday === 'Sun') return false
    const mins = hour * 60 + minute
    const open  = s.hours[0] * 60 + s.hours[1]
    const close = s.hours[2] * 60 + s.hours[3]
    return mins >= open && mins < close
  } catch {
    return false
  }
}

export function getMarketLocalTime(marketId, date = new Date()) {
  const s = SCHEDULE[marketId]
  if (!s) return null
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: s.tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    return null
  }
}

export function getMarketTimezone(marketId) {
  return SCHEDULE[marketId]?.tz ?? null
}
