import { Route, Routes } from 'react-router-dom'
import RootContainer from './container/rootContainer'
import MapComponent from './map/mapComponent'
import EditorComponent from './editor/EditorComponent'

function App() {

  return (
    <RootContainer> 
      <Routes>
        <Route path='/' element={<MapComponent/>}/>
        <Route path='/editor' element={<EditorComponent/>}/>
      </Routes>
    </RootContainer>
  )
}

export default App
