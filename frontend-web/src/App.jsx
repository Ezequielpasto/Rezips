import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import IniciarSesion from './paginas/iniciarSesion'
import Registrarse from './paginas/Registrarse'
import Principal from './paginas/principal'
import MeGusta from './paginas/meGusta'
import Guardado from './paginas/guardado'
import Perfil from './paginas/perfil'
import CrearReceta from './paginas/crearReceta'
import DetallesReceta from './paginas/detallesReceta'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Acceso y registro*/}
          <Route path='/' element={<IniciarSesion/>}/>
          <Route path='/registro' element={<Registrarse/>}/>

          {/* Principales */} 
          <Route path="/principal" element={<Principal/>}/>
          <Route path="/perfil" element={<Perfil/>}/>
          <Route path="/meGusta" element={<MeGusta/>}/>
          <Route path="/guardados" element={<Guardado/>}/>
          <Route path="/crearReceta" element={<CrearReceta/>}/>

          {/* Receta especifica detalles */}
          <Route path="/receta/:id" element={<DetallesReceta/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
