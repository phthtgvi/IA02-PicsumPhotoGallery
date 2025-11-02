import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import LoadingSpinner, { ImagePlaceholder } from '../components/LoadingSpinner'
import { fetchPhotoById } from '../services/api'

const PhotoDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        setLoading(true)
        setError(null)

        const photoData = await fetchPhotoById(id)
        setPhoto(photoData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadPhoto()
    }
  }, [id])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <LoadingSpinner
          size="large"
          text="Loading photo details..."
          className="py-20"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
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
          Photo not found
        </h2>

        <p className="text-gray-600 mb-6">
          {error}
        </p>

        <div className="space-x-4">
          <button
            onClick={() => navigate('/photos')}
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-[#B9B0A5] hover:text-[#B9B0A5] transition-colors font-medium"
          >
            Back to Gallery
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-[#B9B0A5] hover:text-[#B9B0A5] transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Photo not available
        </h2>
        <Link
          to="/photos"
          className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-[#B9B0A5] hover:text-[#B9B0A5] transition-colors font-medium"
        >
          Back to Gallery
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
<Link
            to="/photos"
            className="w-1/4 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-700 hover:border-[#B9B0A5] hover:text-[#B9B0A5] transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Gallery</span>
          </Link>
      </div>

      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link
          to="/photos"
          className="hover:text-[#B9B0A5] transition-colors"
        >
          Gallery
        </Link>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-900 font-medium">Photo #{photo.id}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-100">
              {!imageLoaded && (
                <ImagePlaceholder className="absolute inset-0 w-full h-full" />
              )}

              {!imageError ? (
                <img
                  src={photo.full_url}
                  alt={photo.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>Image unavailable</p>
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                #{photo.id}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-md border border-[#B9B0A5] p-6">
            <h1 className="text-2xl font-bold text-[#B9B0A5] mb-4">
              {photo.title || `Photo #${photo.id}`}
            </h1>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#B9B0A5] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Photographer</p>
                  <p className="font-semibold text-gray-900">
                    {photo.author || 'Unknown Author'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#B9B0A5] shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {photo.description || 'No description available for this photo.'}
            </p>
          </div>


        </div>
      </div>
    </div>
  )
}

export default PhotoDetail
