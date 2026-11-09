import '../estilos/perfil.css'
import MenuLateral from '../componentes/menuLateral'
import ListaRecetas from '../componentes/listaRecetas'
import { useState, useEffect } from 'react'

function Perfil(){
    const [usuario, setUsuario] = useState(null)
    const [recetas, setRecetas] = useState([])

    useEffect(() => {
        async function ObtenerDatos(){
            const usuarioActual = JSON.parse(localStorage.getItem('usuario'))

            setUsuario(usuarioActual)

            if(usuarioActual) {
                try {
                    const respuesta = await fetch(`http://localhost:3000/recetas?id_usuario=${usuarioActual.id_usuario}`)
                    
                    if (!respuesta.ok) {
                        throw new Error('Error al obtener las recetas')
                    }

                    const datos = await respuesta.json()
                    setRecetas(datos)

                } catch (error) {
                    console.error(error)
                }
            }
        }

        ObtenerDatos()
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