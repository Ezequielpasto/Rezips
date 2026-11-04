import './perfil.css'
import MenuLateral from '../componentes/menuLateral'
import ListaRecetas from '../componentes/listaRecetas'
import { useState, useEffect } from 'react'

function Perfil(){
    const [usuario, setUsuario] = useState(null)
    const [recetas, setRecetas] = useState([])

    useEffect(() => {
        const usuarioActual = JSON.parse(localStorage.getItem('usuario'))
        const recetasExistentes = JSON.parse(localStorage.getItem('recetas')) || []
        console.log(recetasExistentes)
        console.log(usuarioActual)

        setUsuario(usuarioActual)

        if(usuarioActual){
            const recetasUsuario = recetasExistentes.filter(
                (receta) => receta.correoUsuario === usuarioActual.correo
            )

            setRecetas(recetasUsuario)
        }
    }, [])

    return(
        <section>
          <MenuLateral></MenuLateral>  
          <main className="miCuenta">
            <div className="datos">
                <div className='nombreCirculo'>
                    <p className='circuloPerfil'>{usuario?.nombre[0]}{usuario?.apellido[0]}</p>
                    <h4>{usuario?.nombre} {usuario?.apellido}</h4>
                </div>   
                <p>{recetas.length} recetas creadas</p>
            </div>
            <div className='contenido'>
                <ListaRecetas recetas={recetas}></ListaRecetas>
            </div>          
          </main>
        </section>
    )
}
export default Perfil