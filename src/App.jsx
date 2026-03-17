import React, { useState } from 'react'
import Navbar from './components/Navbar'
import EmotionDetector from './components/EmotionDetector'
import { createBrowserRouter } from 'react-router-dom'
import Recommendation from './components/Recommendation'
import { createContext } from 'react'

export let EmotionContext = createContext()

const App = () => {
  let [emotion,setEmotion]=useState("")
 

  return (
    <div className="min-h-screen bg-black text-white">
      <EmotionContext.Provider value={{emotion,setEmotion}}>
        <Navbar/>
        <EmotionDetector/>
        <Recommendation/>
        {/* <h1 className="text-5xl text-red-500">Tailwind Working 🚀</h1> */}
      </EmotionContext.Provider>
      
      {/* <h1>Emotion Based Recommendation System</h1> */}
      {/* <p>Detect your emotion and get music/movie suggestions</p> */}
    </div>
  )
}

export default App