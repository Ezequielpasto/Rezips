import API_URL from '../config/api';
import '../estilos/perfil.css'
import MenuLateral from '../componentes/menuLateral'
import ListaRecetas from '../componentes/listaRecetas'
import { useState, useEffect } from 'react'

function Perfil(){
    const [usuario, setUsuario] = useState(null)
    const [recetas, setRecetas] = useState([])

    useEffect(() => {
        async function ObtenerDatos() {
            try {
                const usuarioJSON = localStorage.getItem('usuario')

                if (!usuarioJSON) return

                const usuarioActual = JSON.parse(usuarioJSON)
                setUsuario(usuarioActual)

                const respuesta = await fetch(`${API_URL}/recetas`)

                if (!respuesta.ok) {
                    throw new Error('No se pudieron obtener las recetas')
                }

                const datos = await respuesta.json()

                const recetasUsuario = datos.filter(
                    receta => Number(receta.id_usuario) === Number(usuarioActual.id_usuario)
                )

                setRecetas(recetasUsuario)

            } catch (error) {
                console.error('Error al actualizar el perfil:', error)
            }
        }

        ObtenerDatos()
    }, [])

    return(
        <section className="pantallaPerfil">
            <MenuLateral></MenuLateral>

            <main className="miCuenta">
                <div className="datos">
                    <div className='nombreCirculo'>
                        {usuario?.imagen_perfil ? (
                            <img
                                className="fotoPerfil"
                                src={usuario.imagen_perfil}
                                alt="Foto de perfil"
                            />
                        ) : (
                            <p className='circuloPerfil'>
                                {usuario?.nombre?.[0]}
                                {usuario?.apellido?.[0]}
                            </p>
                        )}

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
