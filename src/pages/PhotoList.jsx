import React, { useState, useEffect, useCallback } from 'react'
import PhotoCard from '../components/PhotoCard'
import LoadingSpinner, { PhotoSkeleton } from '../components/LoadingSpinner'
import { fetchPhotos } from '../services/api'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'


const PhotoList = () => {
  const [photos, setPhotos] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMorePhotos = useCallback(async (page) => {
    try {
      console.log(`Fetching page ${page}...`)
      const newPhotos = await fetchPhotos(page)

      if (newPhotos.length > 0) {
        setPhotos(prevPhotos => {
          const existingIds = new Set(prevPhotos.map(photo => photo.id))
          const uniqueNewPhotos = newPhotos.filter(photo => !existingIds.has(photo.id))
          return [...prevPhotos, ...uniqueNewPhotos]
        })
        return newPhotos
      }

      return []
    } catch (err) {
      throw err
    }
  }, [])

  const {
    loading: loadingMore,
    hasMore,
    error: scrollError,
    reset
  } = useInfiniteScroll(fetchMorePhotos, {
    threshold: 200,
    initialPage: 2,
    enabled: !initialLoading
  })

  useEffect(() => {
    const loadInitialPhotos = async () => {
      try {
        setError(null)
        setInitialLoading(true)

        const initialPhotos = await fetchPhotos(1)
        setPhotos(initialPhotos)
      } catch (err) {
        setError(err.message)
      } finally {
        setInitialLoading(false)
      }
    }

    loadInitialPhotos()
  }, [])

  const handleRetry = () => {
    setPhotos([])
    setError(null)
    reset()
    window.location.reload()
  }

  if (initialLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Photo Gallery
          </h1>
        </div>

        <PhotoSkeleton count={8} />
      </div>
    )
  }

  if (error && photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load photos
          </h2>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#B9B0A5] mb-6">
          Picsum Photo Gallery
        </h1>
        <p className=" text-2xl text-gray-900 max-w-2xl mx-auto mb-2">
          22127451 - Phan Thi Tuong Vi
        </p>
        {photos.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {photos.length} photo{photos.length !== 1 ? 's' : ''}
            {hasMore && ' • Scroll down for more'}
          </p>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}

      {loadingMore && (
        <LoadingSpinner
          size="medium"
          text="Loading more photos..."
        />
      )}

      {hasMore && !loadingMore && (
        <div className="text-center py-4">
          <button
            onClick={() => {
              console.log('Manual load more clicked')
              fetchMorePhotos(Math.floor(photos.length / 20) + 2)
            }}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Load More Photos
          </button>
        </div>
      )}

      {scrollError && (
        <div className="text-center py-4">
          <p className="text-red-600 mb-4">
            Error loading more photos: {scrollError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Reload Page
          </button>
        </div>
      )}

      {!hasMore && !loadingMore && photos.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">You've reached the end of the gallery</span>
          </div>
        </div>
      )}

      {photos.length === 0 && !initialLoading && !error && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No photos found
          </h2>
        </div>
      )}
    </div>
  )
}

export default PhotoList
