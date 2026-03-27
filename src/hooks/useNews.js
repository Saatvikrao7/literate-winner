import { useState, useEffect, useCallback } from 'react'

const BASE_URL = 'https://content.guardianapis.com/search'
const API_KEY = 'test'

function buildUrl(region, category) {
  const params = new URLSearchParams({
    'api-key': API_KEY,
    'show-fields': 'thumbnail,headline,trailText,byline',
    'show-tags': 'keyword',
    'page-size': '20',
    'order-by': 'newest',
  })

  // Priority: tag > regionSection > query > global
  // Guardian's section param only accepts one value, so when both a region
  // section and a category section are needed, we add the region as a query term.
  if (region.tag) {
    params.set('tag', region.tag)
    if (category.section) params.set('section', category.section)

  } else if (region.regionSection) {
    if (category.section) {
      // Can't combine two sections — scope by region query + category section
      if (region.query) params.set('q', region.query)
      params.set('section', category.section)
    } else {
      params.set('section', region.regionSection)
    }

  } else if (region.query) {
    params.set('q', region.query)
    if (category.section) params.set('section', category.section)

  } else {
    // Global
    if (category.section) params.set('section', category.section)
  }

  return `${BASE_URL}?${params.toString()}`
}

export function useNews(region, category) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = buildUrl(region, category)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      if (data.response?.status !== 'ok') {
        throw new Error('Guardian API error')
      }
      setArticles(data.response.results || [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [region.id, category.id])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return { articles, loading, error, lastUpdated, refetch: fetchNews }
}
