import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SortingVisualiser } from './components/SortingVisualiser'

function App() {

  return (
    <>
      <SortingVisualiser min={5} max={1000} arraySize={100}/>
    </>
  )
}

export default App
