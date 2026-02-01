import { useState } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import GameCanvas from './components/GameCanvas'
import SettingsMenu from './components/SettingsMenu'
import { generateRandomLocation } from './utils/game'

export default function App() {
  const [apiKey, setApiKey] = useState('')
  const [targetLoc, setTargetLoc] = useState(generateRandomLocation())
  const [round, setRound] = useState(1)

  const nextRound = () => {
    setTargetLoc(generateRandomLocation())
    setRound(r => r + 1)
  }

  return (
    <div className="h-screen w-screen bg-[#F0F4F8]">
      {apiKey ? (
        <APIProvider apiKey={apiKey}>
          <GameCanvas 
            key={round}
            targetLocation={targetLoc} 
            onNextRound={nextRound}
            round={round}
          />
        </APIProvider>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-8xl text-indigo-500 mb-8 drop-shadow-sm -rotate-2">
            <span className="text-indigo-600">Azimuth</span>
          </h1>
          <h2 className="text-2xl text-pink-400 mb-4">inspired by geoguessr</h2>
          <p className="text-1xl text-gray-500 max-w-md">
            open-source, cozy web-based geoguessr esque game
          </p>
          <p className="text-1xl text-gray-400 max-w-md">
            enter a google maps api key at the top-right corner and <span className="text-emerald-300">start playing now!</span>
          </p>
        </div>
      )}
      
      <SettingsMenu apiKey={apiKey} setApiKey={setApiKey} />
    </div>
  )
}