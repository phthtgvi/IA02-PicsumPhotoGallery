import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PhotoList from './pages/PhotoList'
import PhotoDetail from './pages/PhotoDetail'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <Router basename="/IA02-PicsumPhotoGallery">
      <div className="min-h-screen bg-cream">
        <ErrorBoundary>
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/photos" replace />} />
              <Route path="/photos" element={<PhotoList />} />
              <Route path="/photos/:id" element={<PhotoDetail />} />
              <Route path="*" element={<Navigate to="/photos" replace />} />
            </Routes>
          </main>
        </ErrorBoundary>
      </div>
    </Router>
  )
}

export default App
