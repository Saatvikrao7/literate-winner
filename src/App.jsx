import { useState } from 'react'
import { REGIONS, CATEGORIES } from './data/regions'
import { useNews } from './hooks/useNews'
import WorldMap from './components/WorldMap'
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
      <div className="flex flex-1 overflow-hidden">
        {/* Map — takes remaining width on desktop, full width on mobile */}
        <div className="flex-1 relative min-w-0">
          <WorldMap
            selectedRegion={selectedRegion}
            onRegionSelect={setSelectedRegion}
          />
        </div>

        {/* News panel — fixed width sidebar on desktop */}
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md flex-shrink-0 border-l border-border flex flex-col overflow-hidden hidden md:flex">
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
