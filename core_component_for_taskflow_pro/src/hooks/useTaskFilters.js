import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'

/**
 * PUBLIC_INTERFACE
 * Custom hook for managing task filters via URL search parameters
 * @returns {Object} Filter state and functions
 */
export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get current filters from URL
  const filters = useMemo(() => {
    const filterObj = {}
    
    if (searchParams.has('status')) {
      filterObj.status = searchParams.get('status')
    }
    
    if (searchParams.has('priority')) {
      filterObj.priority = searchParams.get('priority')
    }
    
    if (searchParams.has('search')) {
      filterObj.search = searchParams.get('search')
    }
    
    if (searchParams.has('tags')) {
      filterObj.tags = searchParams.get('tags').split(',')
    }
    
    return filterObj
  }, [searchParams])
  
  // Update filters
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','))
      } else {
        params.set(key, value)
      }
    })
    
    setSearchParams(params)
  }
  
  // Clear all filters
  const clearFilters = () => {
    setSearchParams({})
  }
  
  return {
    filters,
    updateFilters,
    clearFilters
  }
}
