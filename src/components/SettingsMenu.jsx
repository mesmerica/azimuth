import { useState } from 'react'
import { Settings, X } from 'lucide-react'

export default function SettingsMenu({ apiKey, setApiKey, onValidate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputKey, setInputKey] = useState(apiKey)
  const [error, setError] = useState(false)

  const handleSave = () => {
    const keyRegex = /^AIza[0-9A-Za-z-_]{35}$/
    if (keyRegex.test(inputKey)) {
      setApiKey(inputKey)
      setError(false)
      onValidate?.()
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-9999 font-jolly">
      {isOpen && (
        <div 
          style={{ padding: '24px', borderRadius: '32px' }}
          className="absolute top-16 right-0 bg-white border-4 border-white w-72 animate-in fade-in zoom-in-95 duration-200 ease-out origin-top-right"
        >
          <label className="block text-2xl mb-2 text-indigo-500 tracking-tight">API Key</label>
          <input 
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            style={{ borderRadius: '8px' }}
            className="w-full p-4 bg-indigo-50 border-2 border-indigo-100 focus:outline-none focus:border-indigo-300 text-sm font-jolly mb-4 transition-colors placeholder:font-jolly"
            placeholder="AiZa...."
          />
          {error && (
            <p className="text-red-400 text-xs mb-4 font-jolly font-bold italic">
              Invalid format. Key must start with AIza.
            </p>
          )}
          <button 
            onClick={handleSave}
            style={{ borderRadius: '8px' }}
            className="w-full py-4 bg-indigo-500 text-white font-black text-2xl active:translate-y-1 transition-all"
          >
            SAVE
          </button>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderRadius: '16px' }}
        className={`bg-white p-3 transition-all hover:bg-indigo-50 text-indigo-500 border-2 border-white ${isOpen ? 'scale-90 bg-indigo-50' : ''}`}
      >
        {isOpen ? <X size={32} /> : <Settings size={32} />}
      </button>
    </div>
  )
}
