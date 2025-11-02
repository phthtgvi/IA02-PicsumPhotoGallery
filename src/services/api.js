

const BASE_URL = 'https://picsum.photos/v2'
const PHOTOS_PER_PAGE = 20


export const fetchPhotos = async (page = 1, limit = PHOTOS_PER_PAGE) => {
  try {
    const response = await fetch(`${BASE_URL}/list?page=${page}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const photos = await response.json()

    return photos.map(photo => ({
      id: photo.id,
      author: photo.author,
      width: photo.width,
      height: photo.height,
      url: photo.url,
      download_url: photo.download_url,
      thumbnail_url: `https://picsum.photos/id/${photo.id}/300/200`,
      full_url: `https://picsum.photos/id/${photo.id}/800/600`,
      title: `Photo by ${photo.author}`,
      description: `A beautiful photograph captured by ${photo.author}. This image showcases the artistic vision and technical skill of the photographer.`
    }))
  } catch (error) {
    console.error('Error fetching photos:', error)
    throw new Error('Failed to fetch photos. Please check your internet connection and try again.')
  }
}


export const fetchPhotoById = async (id) => {
  try {
    const infoResponse = await fetch(`https://picsum.photos/id/${id}/info`)

    if (infoResponse.ok) {
      const photo = await infoResponse.json()

      return {
        id: photo.id,
        author: photo.author,
        width: photo.width,
        height: photo.height,
        url: photo.url,
        download_url: photo.download_url,
        full_url: `https://picsum.photos/id/${photo.id}/800/600`,
        title: `Photo by ${photo.author}`,
        description: `A stunning photograph captured by ${photo.author}. This image demonstrates exceptional composition and technical excellence. The photograph showcases the photographer's unique perspective and artistic vision, making it a remarkable piece of visual art.`
      }
    }

    for (let page = 1; page <= 50; page++) {
      try {
        const listResponse = await fetch(`${BASE_URL}/list?page=${page}&limit=100`)

        if (!listResponse.ok) continue

        const photos = await listResponse.json()
        const photo = photos.find(p => p.id === id)

        if (photo) {
          return {
            id: photo.id,
            author: photo.author,
            width: photo.width,
            height: photo.height,
            url: photo.url,
            download_url: photo.download_url,
            full_url: `https://picsum.photos/id/${photo.id}/800/600`,
            title: `Photo by ${photo.author}`,
            description: `A stunning photograph captured by ${photo.author}. This image demonstrates exceptional composition and technical excellence. The photograph showcases the photographer's unique perspective and artistic vision, making it a remarkable piece of visual art.`
          }
        }

        if (photos.some(p => parseInt(p.id) > parseInt(id))) {
          break
        }
      } catch (pageError) {
        console.warn(`Error fetching page ${page}:`, pageError)
        continue
      }
    }

    throw new Error('Photo not found')
  } catch (error) {
    console.error('Error fetching photo:', error)
    throw new Error('Failed to fetch photo details. This photo may not exist or may be temporarily unavailable.')
  }
}

export const hasMorePhotos = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/list?page=${page + 1}&limit=1`)
    return response.ok && (await response.json()).length > 0
  } catch (error) {
    console.error('Error checking for more photos:', error)
    return false
  }
}
