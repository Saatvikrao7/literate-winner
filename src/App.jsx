import { useState } from 'react'
import { REGIONS, CATEGORIES } from './data/regions'
import { useNews } from './hooks/useNews'
import { lazy, Suspense } from 'react'
const GlobeMap = lazy(() => import('./components/GlobeMap'))
import NewsPanel from './components/NewsPanel'
import Header from './components/Header'
import CategoryBar from './components/CategoryBar'

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0])
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])

  const { articles, loading, error, lastUpdated, refetch } = useNews(selectedRegion, selectedCategory)

  return (
    <div className="flex flex-col h-screen bg-surface text-white overflow-hidden">
      <Header selectedRegion={selectedRegion} />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Globe — lazy loaded so Three.js doesn't block initial paint */}
        <div className="flex-1 relative min-w-0 min-h-0">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-white/30 animate-pulse">Loading globe…</span>
            </div>
          }>
            <GlobeMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
            />
          </Suspense>
        </div>

        {/* News panel — fixed width sidebar on desktop */}
        <div className="w-80 lg:w-96 flex-shrink-0 border-l border-border flex flex-col overflow-hidden hidden md:flex">
          <NewsPanel
            articles={articles}
            loading={loading}
            error={error}
            lastUpdated={lastUpdated}
            refetch={refetch}
            region={selectedRegion}
            category={selectedCategory}
          />
        </div>
      </div>

      {/* Mobile news panel — below map */}
      <div className="md:hidden border-t border-border flex flex-col" style={{ height: '45vh' }}>
        <NewsPanel
          articles={articles}
          loading={loading}
          error={error}
          lastUpdated={lastUpdated}
          refetch={refetch}
          region={selectedRegion}
          category={selectedCategory}
        />
      </div>

      <CategoryBar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        selectedRegion={selectedRegion}
        onRegionSelect={setSelectedRegion}
      />
    </div>
  )
}
