import { useEffect, useRef, useState } from 'react'
import { Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps'
import { calculateDistance, calculateScore } from '../utils/game'
import confetti from 'canvas-confetti'

const StreetView = ({ position, onLocationFound }) => {
  const ref = useRef(null)
  const streetViewLib = useMapsLibrary('streetView')

  useEffect(() => {
    if (!streetViewLib || !ref.current) return
    const service = new streetViewLib.StreetViewService()
    service.getPanorama({
      location: position,
      radius: 500000,
      source: 'outdoor'
    }, (data, status) => {
      if (status === 'OK' && data.location && data.location.latLng) {
        const foundPos = { lat: data.location.latLng.lat(), lng: data.location.latLng.lng() }
        onLocationFound(foundPos)
        new streetViewLib.StreetViewPanorama(ref.current, {
          pano: data.location.pano,
          disableDefaultUI: true,
          showRoadLabels: false,
          zoom: 1
        })
      }
    })
  }, [streetViewLib, position, onLocationFound])

  return <div ref={ref} className="absolute inset-0 z-0 pointer-events-auto" />
}

const Polyline = ({ path }) => {
  const mapsLib = useMapsLibrary('maps')
  const polyRef = useRef(null)

  useEffect(() => {
    if (!mapsLib || !path) return
    if (polyRef.current) polyRef.current.setMap(null)
    polyRef.current = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#6366f1',
      strokeOpacity: 1.0,
      strokeWeight: 4
    })
  }, [mapsLib, path])

  return null
}

export default function GameCanvas({ targetLocation, onNextRound, round }) {
  const [actualPos, setActualPos] = useState(targetLocation)
  const [locationName, setLocationName] = useState('')
  const [guess, setGuess] = useState(null)
  const [hasGuessed, setHasGuessed] = useState(false)
  const [result, setResult] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 288, height: 208 })
  const [isResizing, setIsResizing] = useState(false)
  
  const geocodingLib = useMapsLibrary('geocoding')

  const formatLocation = (name) => {
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  useEffect(() => {
    if (!geocodingLib || !actualPos || !hasGuessed) return
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: actualPos }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressParts = results[0].address_components
        const city = addressParts.find(c => c.types.includes('locality'))?.long_name || 
                     addressParts.find(c => c.types.includes('administrative_area_level_1'))?.long_name
        const country = addressParts.find(c => c.types.includes('country'))?.long_name
        const rawName = city ? `${city}, ${country}` : country
        setLocationName(formatLocation(rawName))
      }
    })
  }, [geocodingLib, actualPos, hasGuessed])

  const handleResizeStart = (e) => {
    if (isExpanded) return
    setIsResizing(true)
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = dimensions.width
    const startHeight = dimensions.height

    const onMouseMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX
      const deltaY = startY - moveEvent.clientY
      setDimensions({
        width: Math.max(200, Math.min(window.innerWidth * 0.8, startWidth + deltaX)),
        height: Math.max(150, Math.min(window.innerHeight * 0.8, startHeight + deltaY))
      })
    }

    const onMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const handleMapClick = (e) => {
    if (hasGuessed) return
    setGuess({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng })
  }

  const submitGuess = () => {
    if (!guess) return
    const distance = calculateDistance(actualPos, guess)
    const score = calculateScore(distance)
    setResult({ distance, score })
    setHasGuessed(true)
    setIsExpanded(true)
    if (score > 4000) confetti()
  }

  const twemoji = (id) => `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${id}.png`

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[#F0F4F8] font-jolly">
      <StreetView position={targetLocation} onLocationFound={setActualPos} />

      <div 
        style={{ 
          padding: '12px',
          borderRadius: isExpanded ? '36px' : '28px',
          width: isExpanded ? '90vw' : `${dimensions.width}px`,
          height: isExpanded ? '80vh' : `${dimensions.height}px`,
          bottom: isExpanded ? '50%' : '2rem',
          right: isExpanded ? '50%' : '2rem',
          transform: isExpanded ? 'translate(50%, 50%)' : 'none',
          transition: isResizing ? 'none' : 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)'
        }}
        className="absolute z-100 bg-white border-4 border-white flex flex-col"
      >
        {!isExpanded && (
          <div 
            onMouseDown={handleResizeStart}
            className="absolute -top-3 -left-3 z-110 bg-white p-2 rounded-xl border-2 border-indigo-100 text-indigo-500 hover:scale-110 transition-transform cursor-nw-resize select-none"
          >
            <div className="w-6 h-6 flex items-center justify-center font-bold">⤡</div>
          </div>
        )}

        <div 
          style={{ borderRadius: isExpanded ? '24px' : '16px' }}
          className="flex-1 overflow-hidden relative border-2 border-indigo-50"
        >
          <Map
            defaultCenter={{ lat: 20, lng: 0 }}
            defaultZoom={2}
            onClick={handleMapClick}
            disableDefaultUI={true}
            gestureHandling={hasGuessed ? 'cooperative' : 'greedy'}
          >
            {guess && <Marker position={guess} />}
            {hasGuessed && (
              <>
                <Marker position={actualPos} />
                <Polyline path={[guess, actualPos]} />
              </>
            )}
          </Map>

          {!hasGuessed && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4 pointer-events-none">
              <button 
                onClick={submitGuess}
                disabled={!guess}
                className="pointer-events-auto w-full max-w-45 bg-indigo-500 text-white py-3 rounded-2xl font-black text-2xl active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-widest"
              >
                GUESS
              </button>
            </div>
          )}
        </div>
      </div>

{result && (
  <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-200 p-6 animate-in fade-in duration-300">
    <div 
      style={{ padding: '40px', borderRadius: '56px' }}
      className="bg-white text-center animate-in zoom-in-95 fade-in duration-300 border-8 border-white max-w-sm w-full"
    >
      <img src={result.score > 4000 ? twemoji('1f973') : twemoji('1f622')} className="w-24 h-24 mx-auto mb-8" alt="emoji" />
      
      <div className="flex flex-col gap-4 mb-10">
        <p className="text-gray-500 text-2xl font-bold tracking-tight">
          {locationName ? `It was ${locationName}!` : 'Target Location'}
        </p>
        <h2 className="text-8xl text-indigo-600 leading-none">{result.score} pt</h2>
        <p className="text-gray-400 text-3xl">{result.distance} km away</p>
      </div>

      <button 
        onClick={onNextRound} 
        style={{ borderRadius: '16px' }}
        className="w-full py-5 bg-[#f0fdf4] text-[#166534] font-black text-4xl active:translate-y-1 transition-all uppercase tracking-tight hover:bg-[#dcfce7] flex items-center justify-center"
      >
        Next Round
      </button>
    </div>
  </div>
)}

      <div 
        style={{ padding: '16px 32px', borderRadius: '32px' }}
        className="absolute top-6 left-6 z-50 bg-white border-4 border-white flex items-baseline gap-3"
      >
        <span className="text-indigo-200 text-2xl uppercase tracking-tighter">Round</span>
        <span className="text-5xl text-indigo-600 leading-none">{round}</span>
      </div>
    </div>
  )
}
