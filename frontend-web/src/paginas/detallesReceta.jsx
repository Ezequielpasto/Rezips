import '../estilos/detallesReceta.css'
import MenuLateral from '../componentes/menuLateral'
import ListaIngredientes from '../componentes/listaIngredientes'
import ListaPasos from '../componentes/listaPasos'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, Bookmark, Timer, Utensils, MessageCircle } from 'lucide-react'

function DetallesReceta(){
    const {id} = useParams()
    const navegar = useNavigate()

    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const [receta, setReceta] = useState(null)
    const [ingredientes, setIngredientes] = useState([])
    const [pasos, setPasos] = useState([])
    const [comentarios, setComentarios] = useState([])
    const [calificaciones, setCalificaciones] = useState([])
    const [listaMeGusta, setListaMeGusta] = useState([])
    const [listaGuardados, setListaGuardados] = useState([])
    const [comentDescripcion, setComentDescripcion] = useState("")
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        async function ObtenerDatos(){
            try{
                const respuesta = await fetch(`http://localhost:3000/recetas/${id}`)
                if(!respuesta.ok) throw new Error('Error al obtener receta')
                const datos = await respuesta.json()
                console.log(datos)
                setReceta(datos)

                const respuestaPasos = await fetch(`http://localhost:3000/recetas/${id}/pasos`)
                if(!respuestaPasos.ok) throw new Error('Error al obtener pasos')
                setPasos(await respuestaPasos.json())

                const respuestaComentarios = await fetch(`http://localhost:3000/recetas/${id}/comentarios`)
                if(!respuestaComentarios.ok) throw new Error('Error al obtener comentarios')
                setComentarios(await respuestaComentarios.json())

                const respuestaIngredientes = await fetch(`http://localhost:3000/recetas/${id}/ingredientes`)
                if(!respuestaIngredientes.ok) throw new Error('Error al obtener ingredientes')
                setIngredientes(await respuestaIngredientes.json())

                const respuestaMeGusta = await fetch(`http://localhost:3000/recetas/${id}/me-gusta`)
                if(!respuestaMeGusta.ok){
                    throw new Error('Error al obtener me gusta')
                }
                setListaMeGusta(await respuestaMeGusta.json())

                const respuestaGuardados = await fetch(`http://localhost:3000/recetas/${id}/guardar`)
                if(!respuestaGuardados.ok){
                    throw new Error('Error al obtener los guardados')
                }
                setListaGuardados(await respuestaGuardados.json())

                const respuestaCalificaciones = await fetch(`http://localhost:3000/recetas/${id}/calificacion`)
                if(!respuestaCalificaciones.ok){
                    throw new Error('Error al obtener las calificaciones')
                }
                setCalificaciones(await respuestaCalificaciones.json())

            }catch(error){
                console.error(error)
                alert('No se pudieron obtener los datos de la receta')
            }finally{
                setCargando(false)
            }
        }

        ObtenerDatos()
    }, [id])

    const esPropietario = usuario && usuario.id_usuario === receta?.id_usuario

    const usuarioDioMeGusta = listaMeGusta.some(
        (meGusta) => meGusta.id_usuario === usuario?.id_usuario
    )

    const usuarioGuardo = listaGuardados.some(
        (guardado) => guardado.id_usuario === usuario?.id_usuario
    )

    if(cargando){
        return <h2>Cargando receta...</h2>
    }

    if(!receta){
        return <h2>No se pudo encontrar la receta</h2>
    }

    const miCalificacion = calificaciones.find(
        (c) => Number(c.id_usuario) === Number(usuario?.id_usuario)
    )?.valor || 0

    const promedio = calificaciones.length > 0
        ? calificaciones.reduce(
            (total, calificacion) => total + Number(calificacion.valor), 0
        ) / calificaciones.length
        : 0

    async function AlternarMeGusta(){
        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        try {
            const respuesta = await fetch(
                `http://localhost:3000/recetas/${id}/me-gusta`,
                {
                    method: usuarioDioMeGusta ? 'DELETE' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_usuario: usuario.id_usuario
                    })
                }
            )

            if(!respuesta.ok){
                throw new Error('Error al modificar me gusta')
            }

            const respuestaMeGusta = await fetch(
                `http://localhost:3000/recetas/${id}/me-gusta`
            )

            if(!respuestaMeGusta.ok){
                throw new Error('Error al actualizar me gusta')
            }

            setListaMeGusta(await respuestaMeGusta.json())

        } catch(error){
            console.error(error)
            alert("No se pudo modificar el me gusta")
        }
    }

    async function AlternarGuardados(){
        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/recetas/${id}/guardar`,{
                method: usuarioGuardo ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario
                })
            })

            if(!respuesta.ok){
                throw new Error('Error al modificar guardados')
            }

            const respuestaGuardados = await fetch(
                `http://localhost:3000/recetas/${id}/guardar`
            )

            if(!respuestaGuardados.ok){
                throw new Error('Error al actualizar guardados')
            }

            setListaGuardados(await respuestaGuardados.json())

        } catch(error){
            console.error(error)
            alert("No se pudo modificar el guardado")
        }
    }

    async function NuevoComentario(event){
        event.preventDefault()

        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        if(comentDescripcion.trim() === ''){
            alert("Debes escribir un comentario")
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/recetas/${id}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    descripcion: comentDescripcion.trim()
                })
            })

            if(!respuesta.ok){
                throw new Error('Error al enviar el comentario')
            }

            await respuesta.json()

            const respuestaComentarios = await fetch(`http://localhost:3000/recetas/${id}/comentarios`)

            if(!respuestaComentarios.ok){
                throw new Error('Error al actualizar los comentarios')
            }

            const comentariosActualizados = await respuestaComentarios.json()

            setComentarios(comentariosActualizados)
            setComentDescripcion("")

        } catch(error) {
            console.error(error)
            alert("No se pudo enviar el comentario")
        }
    }

    async function EliminarComentario(idComentario){
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este comentario?")

        if(!confirmar){
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/comentarios/${idComentario}`, {
                method: 'DELETE'
            })

            if(!respuesta.ok){
                throw new Error('Error al eliminar el comentario')
            }

            setComentarios((comentariosActuales) =>
                comentariosActuales.filter(
                    (comentario) => comentario.id_comentario !== idComentario
                )
            )

        }catch(error) {
            console.error(error)
            alert("No se pudo eliminar el comentario")
        }
    }

    async function CalificarReceta(valor){
        if (!usuario) {
            alert("Debes iniciar sesión para calificar")
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/recetas/${id}/calificacion`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_usuario: usuario.id_usuario,
                        valor: valor
                    })
                }
            )

            if(!respuesta.ok){
                throw new Error('Error al guardar la calificación')
            }

            const respuestaCalificaciones = await fetch(`http://localhost:3000/recetas/${id}/calificacion`)

            if(!respuestaCalificaciones.ok){
                throw new Error('Error al actualizar las calificaciones')
            }

            setCalificaciones(await respuestaCalificaciones.json())

        } catch(error) {
            console.error(error)
            alert("No se pudo guardar la calificación")
        }
    }

    async function EliminarReceta(){
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta receta?")

        if(!confirmar){
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/recetas/${id}`, {
                method: 'DELETE'
            })

            if(!respuesta.ok){
                throw new Error('Error al eliminar la receta')
            }

            alert("Receta eliminada correctamente")
            navegar('/principal')

        } catch(error) {
            console.error(error)
            alert("No se pudo eliminar la receta")
        }
    }

    return(
        <div>
            <MenuLateral></MenuLateral>
            <div className='detalles'>
                <section className='infoReceta'>
                    <div className='tituloEstrellas'>
                        <div className='tituloCategoria'>
                            <p className='titulo'>{receta.nombre}</p>
                            <p>{receta.categoria}</p>
                        </div>
                        <div className="promedio">
                            {promedio === 0 ?
                                <p>Sin calificar</p> :
                                [1, 2, 3, 4, 5].map((estrella) => (
                                    <Star
                                        key={estrella}
                                        size={30}
                                        color={estrella <= Math.round(promedio) ? "gold" : "gray"}
                                        fill={estrella <= Math.round(promedio) ? "gold" : "none"}
                                    />
                                ))}
                        </div>
                    </div>

                    <div className='imgEInfo'>
                        <div className='imgSup'>
                            <img src={receta.imagen} alt={receta.nombre} />
                        </div>
                        <div className='duracionPorciones'>
                            <p><Timer size={40}/>{receta.duracion}</p>
                            <p><Utensils size={40}/>{receta.cantidad_porciones}</p>
                        </div>
                    </div>

                    <div className='interaccion'>
                        <button type='button' onClick={AlternarMeGusta}>
                            <Heart color={usuarioDioMeGusta ? "red" : "black"} fill={usuarioDioMeGusta ? "red" : "none"}/> {listaMeGusta.length}
                        </button>
                        <button type='button' onClick={AlternarGuardados}>
                            <Bookmark color={usuarioGuardo ? "yellow" : "black"} fill={usuarioGuardo ? "yellow" : "none"}/> {listaGuardados.length}
                        </button>
                        <div className="estrellas">
                            {[1, 2, 3, 4, 5].map((estrella) => (
                                <button
                                    key={estrella}
                                    type='button'
                                    onClick={() => CalificarReceta(estrella)}
                                >
                                    <Star
                                        color={estrella <= miCalificacion ? "black" : "gray"}
                                        fill={estrella <= miCalificacion ? "black" : "none"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='susIngredientes'>
                        <h3>Ingredientes</h3>
                        <ListaIngredientes ingredientes={ingredientes}></ListaIngredientes>
                    </div>

                    <div className="susPasos">
                        <h3>Pasos</h3>
                        <ListaPasos pasos={pasos}></ListaPasos>
                    </div>

                    <div className="propietario">
                        {esPropietario && (
                            <button type="button" onClick={() => navegar(`/editarReceta/${id}`)}>
                                Editar receta
                            </button>
                        )}
                        {esPropietario && (
                            <button type="button" onClick={EliminarReceta}>
                                Eliminar receta
                            </button>
                        )}
                    </div>
                </section>

                <section className='comentarios'>
                    <h4><MessageCircle />Comentarios</h4>
                    <div className='crearComentario'>
                        <textarea
                            placeholder='Escribe un comentario'
                            value={comentDescripcion}
                            onChange={(event) => setComentDescripcion(event.target.value)}
                        />
                        <button onClick={NuevoComentario}>Enviar</button>
                    </div>

                    <div className='todosLosComentarios'>
                        {comentarios.map((comentario) => (
                            <div key={comentario.id_comentario}>
                                <div className='usuarioComentario'>
                                    <p className='circulo'>{comentario.nombre[0]}{comentario.apellido[0]}</p>
                                    <h5>{comentario.nombre} {comentario.apellido}</h5>
                                    {usuario && usuario.id_usuario === comentario.id_usuario && (
                                        <button type="button" onClick={() => EliminarComentario(comentario.id_comentario)}>Eliminar</button>
                                    )}
                                </div>
                                <div className='comentarioFecha'>
                                    <p className='comentario'>{comentario.descripcion}</p>
                                    <small>{comentario.fecha}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default DetallesReceta
