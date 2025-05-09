import './App.css'
import { SortingVisualiser } from './components/SortingVisualiser/SortingVisualiser'

function App() {

  return (
    <>
      <SortingVisualiser min={5} max={1000} arraySize={200}/>
    </>
  )
}

export default App
