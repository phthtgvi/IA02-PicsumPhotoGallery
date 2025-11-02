import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlaceholder } from './LoadingSpinner'


const PhotoCard = ({ photo }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  return (
    <Link
      to={`/photos/${photo.id}`}
      className="group block border border-[#B9B0A5] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-fadeIn"
    >
      <div className="relative w-full h-48 overflow-hidden">
        {!imageLoaded && (
          <ImagePlaceholder className="absolute inset-0 w-full h-full" />
        )}

        {!imageError ? (
          <img
            src={photo.thumbnail_url}
            alt={photo.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
            <div className="bg-white bg-opacity-90 px-6 py-3 ">
              <span className="text-gray-900 font-semibold text-sm tracking-wide uppercase">
                VIEW DETAIL
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs font-medium">
          #{photo.id}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#B9B0A5] transition-colors">
          {photo.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{photo.author}</span>
          </div>

        </div>
      </div>
    </Link>
  )
}

export default PhotoCard
