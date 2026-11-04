import './receta.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Star, Heart, Bookmark } from 'lucide-react'

function Receta({id, imagen, nombre, categoria, cantIngredientes, duracion, porciones, meGusta, guardados, calificaciones = []}){
    const [listaMeGusta, setListaMeGusta] = useState(meGusta || [])
    const [listaGuardados, setListaGuardados] = useState(guardados|| [])
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const usuarioDioMeGusta = listaMeGusta.includes(usuario?.correo)
    const usuarioGuardo = listaGuardados.includes(usuario?.correo)

    const navegar = useNavigate()

    const promedio = calificaciones.length > 0
        ? calificaciones.reduce((total, calificacion) => total + calificacion.valor, 0) / calificaciones.length
        : 0

    const tituloRef = useRef(null)

    useEffect(() => {
        const titulo = tituloRef.current
        if (!titulo) return

        let tamanio = 24

        titulo.style.fontSize = `${tamanio}px`

        while (
            titulo.scrollHeight > titulo.clientHeight &&
            tamanio > 12
        ) {
            tamanio--
            titulo.style.fontSize = `${tamanio}px`
        }
    }, [nombre])

    function AlternarMeGusta(){
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        const recetas = JSON.parse(localStorage.getItem('recetas')) || []
        const recetaActual = recetas.find((receta) => receta.id === id)
        if(!recetaActual)
            return

        const usuarios = recetaActual.meGusta || []
        let actualizados
        if(usuarios.includes(usuario.correo)){
            actualizados = usuarios.filter((correo) => correo !== usuario.correo)
        }else{
            actualizados = [...usuarios, usuario.correo]
        }
        recetaActual.meGusta = actualizados
        localStorage.setItem('recetas', JSON.stringify(recetas))
         setListaMeGusta(actualizados)
    }

    function AlternarGuardados(){
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        const recetas = JSON.parse(localStorage.getItem('recetas')) || []
        const recetaActual = recetas.find((receta) => receta.id === id)
        if(!recetaActual)
            return

        const usuarios = recetaActual.guardados || []
        let actualizados
        if(usuarios.includes(usuario.correo)){
            actualizados = usuarios.filter((correo) => correo !== usuario.correo)
        }else{
            actualizados = [...usuarios, usuario.correo]
        }
        recetaActual.guardados = actualizados
        localStorage.setItem('recetas', JSON.stringify(recetas))
         setListaGuardados(actualizados)
    }

    return(
        <article className='receta' onClick={() => navegar(`/receta/${id}`)}>
                <div className='imagen'>
                    <img src={imagen} alt="Pizza"/>
                </div>
                <div className='informacion'>
                    <h5 ref={tituloRef}>{nombre}</h5>
                    <div className="estrellas">
                        {promedio === 0 ? 
                        <p>Sin calificar</p> :
                        [1, 2, 3, 4, 5].map((estrella) => (
                            <Star
                                key={estrella}
                                color={estrella <= Math.round(promedio) ? "gold" : "gray"}
                                fill={estrella <= Math.round(promedio) ? "gold" : "none"}
                            />
                        ))}
                    </div>
                    <p>{categoria}</p>
                    <p>{cantIngredientes} ingredientes</p>
                    <p>{duracion} minutos</p>
                    <p>{porciones} porciones</p>
                    <div className='acciones'>
                        <button type='button' onClick={(event) => {event.stopPropagation()
                            AlternarMeGusta()}}><Heart color={usuarioDioMeGusta ? "red" : "black"} fill={usuarioDioMeGusta ? "red" : "none"}/> {listaMeGusta.length}
                            </button>
                        <button type='button' onClick={(event) => {event.stopPropagation() 
                            AlternarGuardados()}}><Bookmark color={usuarioGuardo ? "yellow" : "black"} fill={usuarioGuardo ? "yellow" : "none"}/> {listaGuardados.length}
                        </button>
                    </div>
                </div> 
            </article>
    )
}
export default Receta