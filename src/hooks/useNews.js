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

  // Guardian geographic tags are the most accurate way to filter by region.
  // When a tag exists, use it. When we also have a category section, combine
  // them via the tag param + section param together.
  if (region.tag) {
    // Combine region tag with category section tag if both are set
    if (category.section) {
      params.set('tag', region.tag)
      params.set('section', category.section)
    } else {
      params.set('tag', region.tag)
    }
  } else if (region.query) {
    // No Guardian tag available — fall back to keyword search
    params.set('q', region.query)
    if (category.section) {
      params.set('section', category.section)
    }
  } else {
    // Global — just filter by category section if set
    if (category.section) {
      params.set('section', category.section)
    }
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
