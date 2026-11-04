import './detallesReceta.css'
import MenuLateral from '../componentes/menuLateral'
import ListaIngredientes from '../componentes/listaIngredientes'
import ListaPasos from '../componentes/listaPasos'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, Bookmark, Timer, Utensils, MessageCircle} from 'lucide-react'

function DetallesReceta(){
    const[comentDescripcion, setComentDescripcion] = useState("")

    const {id} = useParams()
    const recetasExistentes = JSON.parse(localStorage.getItem('recetas')) || []
    const receta = recetasExistentes.find((receta) => receta.id === Number(id))
    const [listaMeGusta, setListaMeGusta] = useState(receta?.meGusta || [])
    const [listaGuardados, setListaGuardados] = useState(receta?.guardados || [])
    const [comentarios, setComentarios] = useState(receta?.comentarios || [])
    const [calificaciones, setCalificaciones] = useState(receta?.calificaciones || [])
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const navegar = useNavigate()

    const esPropietario = usuario && usuario.correo === receta.correoUsuario
    const usuarioDioMeGusta = listaMeGusta.includes(usuario?.correo)
    const usuarioGuardo = listaGuardados.includes(usuario?.correo)

    if(!receta){
        return <h2>No se pudo encontrar la receta</h2>
    }

    const miCalificacion = calificaciones.find(
        (c) => c.correoUsuario === usuario?.correo
        )?.valor || 0
    
    const promedio = calificaciones.length > 0
        ? calificaciones.reduce((total, calificacion) => total + calificacion.valor, 0) / calificaciones.length
        : 0

    function AlternarMeGusta(){
        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        const recetas = JSON.parse(localStorage.getItem('recetas')) || []
        const recetaActual = recetas.find((receta) => receta.id === Number(id))
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

        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        const recetas = JSON.parse(localStorage.getItem('recetas')) || []
        const recetaActual = recetas.find((receta) => receta.id === Number(id))
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


    function NuevoComentario(event){
        event.preventDefault()

        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        if(comentDescripcion.trim() === ''){
            alert("Debes escribir un comentario")
            return
        }

        const nuevoComentario = {
            id: Date.now(),
            nombreUsuario: usuario.nombre,
            apellidoUsuario: usuario.apellido,
            correoUsuario: usuario.correo,
            descripcion: comentDescripcion.trim(),
            fecha: new Date().toLocaleDateString()
        }

        const recetas = JSON.parse(localStorage.getItem('recetas')) || []
        const recetaActual = recetas.find((r) => r.id === Number(id))

        if(!recetaActual){
            return
        }

        const comentariosActualizados = [...(recetaActual.comentarios || []), nuevoComentario]
        recetaActual.comentarios = comentariosActualizados

        localStorage.setItem('recetas', JSON.stringify(recetas))

        setComentarios(comentariosActualizados)
        setComentDescripcion("")
    }

    function EliminarComentario(idComentario){
        const recetas = JSON.parse(localStorage.getItem('recetas')) || []

        const recetaActual = recetas.find((r) => r.id === Number(id))

        if(!recetaActual){
            return
        }
        
        const comentariosActualizados = recetaActual.comentarios.filter(
            (comentario) => comentario.id !== idComentario
        )

        recetaActual.comentarios = comentariosActualizados

        localStorage.setItem('recetas', JSON.stringify(recetas))

        setComentarios(comentariosActualizados)
    }

    function CalificarReceta(valor){
        if (!usuario) {
            alert("Debes iniciar sesión para calificar")
            return
        }

        const recetas = JSON.parse(localStorage.getItem('recetas')) || []
        const recetaActual = recetas.find((r) => r.id === Number(id))

        if(!recetaActual){
            return
        }

        const calificacionesActualizadas = [...(recetaActual.calificaciones || []).filter(
                (c) => c.correoUsuario !== usuario.correo), {
                    correoUsuario: usuario.correo,
                    valor: valor
                }]

        recetaActual.calificaciones = calificacionesActualizadas

        localStorage.setItem('recetas', JSON.stringify(recetas))
        setCalificaciones(calificacionesActualizadas)
    }

    function EliminarReceta() {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta receta?")

        if (!confirmar){
            return
        }

        const recetasActuales = JSON.parse(localStorage.getItem('recetas')) || []

        const recetasActualizadas = recetasActuales.filter(
            (r) => r.id !== Number(id)
        )

        localStorage.setItem('recetas', JSON.stringify(recetasActualizadas))
        alert("Receta eliminada correctamente")
        navegar('/principal')
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
                            <p><Utensils size={40}/>{receta.cantidadPorciones}</p>
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
                                    <Star color={estrella <= miCalificacion ? "black" : "gray"} 
                                    fill={estrella <= miCalificacion ? "black" : "none"}/>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='susIngredientes'>
                        <h3>Ingredientes</h3>
                        <ListaIngredientes ingredientes={receta.ingredientes}></ListaIngredientes>
                    </div>
                    <div className="susPasos">
                        <h3>Pasos</h3>
                        <ListaPasos pasos={receta.pasos}></ListaPasos>
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
                        <textarea placeholder='Escribe un comentario' value={comentDescripcion} onChange={(event) => setComentDescripcion(event.target.value)}/>
                        <button onClick={NuevoComentario}>Enviar</button>
                    </div>
                    <div className='todosLosComentarios'>
                        {comentarios.map((comentario) => (
                            <div key={comentario.id}>
                                <div className='usuarioComentario'>
                                    <p className='circulo'>{comentario.nombreUsuario[0]}{comentario.apellidoUsuario[0]}</p>
                                    <h5>{comentario.nombreUsuario} {comentario.apellidoUsuario}</h5>
                                    {usuario && usuario.correo === comentario.correoUsuario && (
                                        <button type="button" onClick={() => EliminarComentario(comentario.id)}>Eliminar</button>
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