import { useState, useEffect, useCallback } from 'react'


export const useInfiniteScroll = (fetchMore, options = {}) => {
  const {
    threshold = 100,
    initialPage = 1,
    enabled = true
  } = options

  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return

    try {
      setLoading(true)
      setError(null)

      const result = await fetchMore(page)

      if (!result || (Array.isArray(result) && result.length === 0)) {
        setHasMore(false)
      } else {
        setPage(prevPage => prevPage + 1)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error loading more data:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchMore, page, loading, hasMore, enabled])

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight

      if (scrollHeight - scrollTop <= clientHeight + threshold) {
        loadMore()
      }
    }

    let timeoutId = null
    const throttledHandleScroll = () => {
      if (timeoutId) return

      timeoutId = setTimeout(() => {
        handleScroll()
        timeoutId = null
      }, 100)
    }

    window.addEventListener('scroll', throttledHandleScroll)

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [loadMore, threshold, enabled])

  const reset = useCallback(() => {
    setPage(initialPage)
    setHasMore(true)
    setError(null)
    setLoading(false)
  }, [initialPage])

  return {
    page,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  }
}
