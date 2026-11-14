// Importamos los estilos y componentes que utiliza la pantalla
import '../estilos/detallesReceta.css'
import MenuLateral from '../componentes/menuLateral'
import ListaIngredientes from '../componentes/listaIngredientes'
import ListaPasos from '../componentes/listaPasos'
import Notificacion from '../componentes/notificacion'
import Confirmacion from '../componentes/confirmacion'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, Bookmark, Timer, Utensils, MessageCircle, Trash } from 'lucide-react'

function DetallesReceta() {

    // Obtenemos el ID de la receta desde la URL
    const { id } = useParams()

    // Permite navegar entre las diferentes páginas
    const navegar = useNavigate()

    // Obtenemos el usuario que inició sesión
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    // Estados para almacenar los datos de la receta
    const [receta, setReceta] = useState(null)
    const [ingredientes, setIngredientes] = useState([])
    const [pasos, setPasos] = useState([])
    const [comentarios, setComentarios] = useState([])
    const [calificaciones, setCalificaciones] = useState([])

    // Estados para almacenar los me gusta y las recetas guardadas
    const [listaMeGusta, setListaMeGusta] = useState([])
    const [listaGuardados, setListaGuardados] = useState([])

    // Estado para controlar el texto del nuevo comentario
    const [comentDescripcion, setComentDescripcion] = useState("")

    // Estados para controlar la carga y los mensajes de la pantalla
    const [cargando, setCargando] = useState(true)
    const [notificacion, setNotificacion] = useState(null)
    const [confirmacion, setConfirmacion] = useState(null)

    // Muestra una notificación con el mensaje y el tipo indicado
    function MostrarNotificacion(mensaje, tipo = 'exito') {
        setNotificacion({ mensaje, tipo })
    }

    // Cierra la notificación
    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    // Convierte la fecha recibida en un formato más fácil de leer
    function FormatearFecha(fecha) {
        if (!fecha) return ''

        return new Date(fecha).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        })
    }

    // Quita los decimales cuando la cantidad es un número entero
    function FormatearCantidad(cantidad) {
        const numero = Number(cantidad)

        // Si no es un número válido, devolvemos el valor original
        if (!Number.isFinite(numero)) return cantidad

        // Si es entero, lo mostramos sin decimales
        // Si tiene decimales, conservamos su valor
        return Number.isInteger(numero)
            ? numero
            : numero.toString()
    }

    // Ejecuta la acción seleccionada en la ventana de confirmación
    function ConfirmarAccion() {
        const accion = confirmacion?.onConfirmar

        // Cerramos la ventana antes de ejecutar la acción
        setConfirmacion(null)

        if (accion) {
            accion()
        }
    }

    // Obtiene todos los datos necesarios para mostrar la receta
    useEffect(() => {

        async function ObtenerDatos() {
            try {

                // Obtenemos los datos principales de la receta
                const respuesta = await fetch(`http://localhost:3000/recetas/${id}`)

                if (!respuesta.ok) throw new Error('Error al obtener receta')

                const datos = await respuesta.json()
                setReceta(datos)

                // Obtenemos los pasos de preparación
                const respuestaPasos = await fetch(`http://localhost:3000/recetas/${id}/pasos`)

                if (!respuestaPasos.ok) throw new Error('Error al obtener pasos')

                setPasos(await respuestaPasos.json())

                // Obtenemos los comentarios de la receta
                const respuestaComentarios = await fetch(`http://localhost:3000/recetas/${id}/comentarios`)

                if (!respuestaComentarios.ok) throw new Error('Error al obtener comentarios')

                setComentarios(await respuestaComentarios.json())

                // Obtenemos los ingredientes de la receta
                const respuestaIngredientes = await fetch(`http://localhost:3000/recetas/${id}/ingredientes`)

                if (!respuestaIngredientes.ok) throw new Error('Error al obtener ingredientes')

                setIngredientes(await respuestaIngredientes.json())

                // Obtenemos los usuarios que dieron me gusta
                const respuestaMeGusta = await fetch(`http://localhost:3000/recetas/${id}/me-gusta`)

                if (!respuestaMeGusta.ok) {
                    throw new Error('Error al obtener me gusta')
                }

                setListaMeGusta(await respuestaMeGusta.json())

                // Obtenemos los usuarios que guardaron la receta
                const respuestaGuardados = await fetch(`http://localhost:3000/recetas/${id}/guardar`)

                if (!respuestaGuardados.ok) {
                    throw new Error('Error al obtener los guardados')
                }

                setListaGuardados(await respuestaGuardados.json())

                // Obtenemos las calificaciones de la receta
                const respuestaCalificaciones = await fetch(`http://localhost:3000/recetas/${id}/calificacion`)

                if (!respuestaCalificaciones.ok) {
                    throw new Error('Error al obtener las calificaciones')
                }

                setCalificaciones(await respuestaCalificaciones.json())

            } catch (error) {
                console.error(error)
                MostrarNotificacion('No se pudieron obtener los datos de la receta', 'error')

            } finally {
                // Finalizamos la carga aunque haya ocurrido un error
                setCargando(false)
            }
        }

        ObtenerDatos()

    }, [id])

    // Comprobamos si el usuario actual es el propietario de la receta
    const esPropietario = usuario && usuario.id_usuario === receta?.id_usuario

    // Comprobamos si el usuario actual ya dio me gusta
    const usuarioDioMeGusta = listaMeGusta.some(
        (meGusta) => meGusta.id_usuario === usuario?.id_usuario
    )

    // Comprobamos si el usuario actual ya guardó la receta
    const usuarioGuardo = listaGuardados.some(
        (guardado) => guardado.id_usuario === usuario?.id_usuario
    )

    // Mientras se obtienen los datos mostramos un mensaje de carga
    if (cargando) {
        return (
            <>
                <Notificacion
                    mensaje={notificacion?.mensaje}
                    tipo={notificacion?.tipo}
                    onCerrar={CerrarNotificacion}
                />

                <h2>Cargando receta...</h2>
            </>
        )
    }

    // Si no se encontró la receta mostramos un mensaje
    if (!receta) {
        return (
            <>
                <Notificacion
                    mensaje={notificacion?.mensaje}
                    tipo={notificacion?.tipo}
                    onCerrar={CerrarNotificacion}
                />

                <h2>No se pudo encontrar la receta</h2>
            </>
        )
    }

    // Obtenemos la calificación que dio el usuario actual
    const miCalificacion = calificaciones.find(
        (c) => Number(c.id_usuario) === Number(usuario?.id_usuario)
    )?.valor || 0

    // Calculamos el promedio de todas las calificaciones
    const promedio = calificaciones.length > 0
        ? calificaciones.reduce(
            (total, calificacion) => total + Number(calificacion.valor), 0
        ) / calificaciones.length
        : 0

    // Agrega o quita el me gusta del usuario actual
    async function AlternarMeGusta() {

        // Si no inició sesión, mostramos una advertencia
        if (!usuario) {
            MostrarNotificacion("Debes iniciar sesión", 'advertencia')
            return
        }

        try {

            // Si ya dio me gusta, lo eliminamos; de lo contrario, lo agregamos
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

            if (!respuesta.ok) {
                throw new Error('Error al modificar me gusta')
            }

            // Volvemos a obtener la lista actualizada
            const respuestaMeGusta = await fetch(
                `http://localhost:3000/recetas/${id}/me-gusta`
            )

            if (!respuestaMeGusta.ok) {
                throw new Error('Error al actualizar me gusta')
            }

            setListaMeGusta(await respuestaMeGusta.json())

        } catch (error) {
            console.error(error)
            MostrarNotificacion("No se pudo modificar el me gusta", 'error')
        }
    }

    // Guarda o quita la receta de la lista del usuario
    async function AlternarGuardados() {

        if (!usuario) {
            MostrarNotificacion("Debes iniciar sesión", 'advertencia')
            return
        }

        try {

            // Comprobamos si debemos guardar o quitar la receta
            const respuesta = await fetch(`http://localhost:3000/recetas/${id}/guardar`, {
                method: usuarioGuardo ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario
                })
            })

            if (!respuesta.ok) {
                throw new Error('Error al modificar guardados')
            }

            // Actualizamos la lista de recetas guardadas
            const respuestaGuardados = await fetch(
                `http://localhost:3000/recetas/${id}/guardar`
            )

            if (!respuestaGuardados.ok) {
                throw new Error('Error al actualizar guardados')
            }

            setListaGuardados(await respuestaGuardados.json())

        } catch (error) {
            console.error(error)
            MostrarNotificacion("No se pudo modificar el guardado", 'error')
        }
    }

    // Envía un nuevo comentario para la receta
    async function NuevoComentario(event) {
        event.preventDefault()

        if (!usuario) {
            MostrarNotificacion("Debes iniciar sesión", 'advertencia')
            return
        }

        // Evitamos enviar comentarios vacíos
        if (comentDescripcion.trim() === '') {
            MostrarNotificacion("Debes escribir un comentario", 'advertencia')
            return
        }

        try {

            // Enviamos el comentario al backend
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

            if (!respuesta.ok) {
                throw new Error('Error al enviar el comentario')
            }

            await respuesta.json()

            // Volvemos a obtener los comentarios actualizados
            const respuestaComentarios = await fetch(`http://localhost:3000/recetas/${id}/comentarios`)

            if (!respuestaComentarios.ok) {
                throw new Error('Error al actualizar los comentarios')
            }

            const comentariosActualizados = await respuestaComentarios.json()

            setComentarios(comentariosActualizados)

            // Limpiamos el campo de texto
            setComentDescripcion("")

        } catch (error) {
            console.error(error)
            MostrarNotificacion("No se pudo enviar el comentario", 'error')
        }
    }

    // Abre la confirmación antes de eliminar un comentario
    function SolicitarEliminarComentario(idComentario) {
        setConfirmacion({
            mensaje: '¿Estás seguro de que deseas eliminar este comentario?',
            onConfirmar: () => EliminarComentario(idComentario)
        })
    }

    // Elimina un comentario del backend
    async function EliminarComentario(idComentario) {
        try {

            const respuesta = await fetch(`http://localhost:3000/comentarios/${idComentario}`, {
                method: 'DELETE'
            })

            if (!respuesta.ok) {
                throw new Error('Error al eliminar el comentario')
            }

            // Quitamos el comentario eliminado de la lista actual
            setComentarios((comentariosActuales) =>
                comentariosActuales.filter(
                    (comentario) => comentario.id_comentario !== idComentario
                )
            )

        } catch (error) {
            console.error(error)
            MostrarNotificacion("No se pudo eliminar el comentario", 'error')
        }
    }

    // Guarda la calificación que el usuario le da a la receta
    async function CalificarReceta(valor) {

        if (!usuario) {
            MostrarNotificacion("Debes iniciar sesión para calificar", 'advertencia')
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

            if (!respuesta.ok) {
                throw new Error('Error al guardar la calificación')
            }

            // Actualizamos las calificaciones después de guardar
            const respuestaCalificaciones = await fetch(`http://localhost:3000/recetas/${id}/calificacion`)

            if (!respuestaCalificaciones.ok) {
                throw new Error('Error al actualizar las calificaciones')
            }

            setCalificaciones(await respuestaCalificaciones.json())

        } catch (error) {
            console.error(error)
            MostrarNotificacion("No se pudo guardar la calificación", 'error')
        }
    }

    // Abre la confirmación antes de eliminar la receta
    function SolicitarEliminarReceta() {
        setConfirmacion({
            mensaje: '¿Estás seguro de que deseas eliminar esta receta?',
            onConfirmar: EliminarReceta
        })
    }

    // Elimina la receta del backend
    async function EliminarReceta() {
        try {

            const respuesta = await fetch(`http://localhost:3000/recetas/${id}`, {
                method: 'DELETE'
            })

            if (!respuesta.ok) {
                throw new Error('Error al eliminar la receta')
            }

            MostrarNotificacion("Receta eliminada correctamente", 'exito')

            // Esperamos para que el usuario pueda ver la notificación
            setTimeout(() => {
                navegar('/principal')
            }, 1500)

        } catch (error) {
            console.error(error)
            MostrarNotificacion("No se pudo eliminar la receta", 'error')
        }
    }

    return (
        <div>

            {/* Menú lateral de navegación */}
            <MenuLateral />

            {/* Notificación reutilizable para mostrar mensajes */}
            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            {/* Ventana reutilizable para confirmar eliminaciones */}
            <Confirmacion
                mensaje={confirmacion?.mensaje}
                onConfirmar={ConfirmarAccion}
                onCancelar={() => setConfirmacion(null)}
            />

            <div className='detalles'>

                {/* Información principal de la receta */}
                <section className='infoReceta'>

                    <div className='tituloEstrellas'>

                        <div className='tituloCategoria'>
                            <p className='titulo'>{receta.nombre}</p>
                            <p>{receta.categoria}</p>

                            {/* Mostramos la fecha si viene en los datos de la receta */}
                            {receta.fecha && (
                                <p>{FormatearFecha(receta.fecha)}</p>
                            )}
                        </div>

                        {/* Promedio de las calificaciones */}
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

                    {/* Imagen, duración y porciones de la receta */}
                    <div className='imgEInfo'>

                        <div className='imgSup'>
                            <img src={receta.imagen} alt={receta.nombre} />
                        </div>

                        <div className='duracionPorciones'>
                            <p><Timer size={40} />{receta.duracion}</p>
                            <p><Utensils size={40} />{receta.cantidad_porciones}</p>
                        </div>
                    </div>

                    {/* Botones de interacción */}
                    <div className='interaccion'>

                        <button type='button' onClick={AlternarMeGusta}>
                            <Heart
                                color={usuarioDioMeGusta ? "red" : "black"}
                                fill={usuarioDioMeGusta ? "red" : "none"}
                            />
                            {listaMeGusta.length}
                        </button>

                        <button type='button' onClick={AlternarGuardados}>
                            <Bookmark
                                color={usuarioGuardo ? "yellow" : "black"}
                                fill={usuarioGuardo ? "yellow" : "none"}
                            />
                            {listaGuardados.length}
                        </button>

                        {/* Permite calificar la receta con estrellas */}
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

                    {/* Lista de ingredientes con las cantidades formateadas */}
                    <div className='susIngredientes'>
                        <h3>Ingredientes</h3>
                        <ListaIngredientes
                            ingredientes={ingredientes.map((ingrediente) => ({
                                ...ingrediente,
                                cantidad: FormatearCantidad(ingrediente.cantidad)
                            }))}
                        />
                    </div>

                    {/* Lista de pasos de preparación */}
                    <div className="susPasos">
                        <h3>Pasos</h3>
                        <ListaPasos pasos={pasos} />
                    </div>

                    {/* Opciones disponibles solamente para el propietario */}
                    <div className="propietario">

                        {esPropietario && (
                            <button
                                className='editarReceta'
                                type="button"
                                onClick={() => navegar(`/editarReceta/${id}`)}
                            >
                                Editar receta
                            </button>
                        )}

                        {esPropietario && (
                            <button className='eliminarReceta'
                                type="button"
                                onClick={SolicitarEliminarReceta}
                            >
                                Eliminar receta
                            </button>
                        )}
                    </div>
                </section>

                {/* Sección de comentarios */}
                <section className='comentarios'>
                    <h4><MessageCircle />Comentarios</h4>
                    {/* Formulario para escribir un comentario */}
                    <div className='crearComentario'>
                        <textarea
                            placeholder='Escribe un comentario'
                            value={comentDescripcion}
                            onChange={(event) => setComentDescripcion(event.target.value)}
                        />
                        <button className='botonEnviar' onClick={NuevoComentario}>
                            Enviar
                        </button>
                    </div>
                    {/* Mostramos todos los comentarios de la receta */}
                    <div className='todosLosComentarios'>
                        {comentarios.length === 0 ?
                            <p>Todavía no hay comentarios</p>
                        :
                        comentarios.map((comentario) => (
                            <div key={comentario.id_comentario}>
                                <div className='usuarioComentario'>
                                    {/* Iniciales y nombre del usuario que comentó */}
                                    {comentario.imagen_perfil ? (
                                        <img
                                            className="fotoComentario"
                                            src={comentario.imagen_perfil}
                                            alt="Foto de perfil"
                                        />
                                    ) : (
                                        <p className='circulo'>
                                            {comentario.nombre?.[0]}{comentario.apellido?.[0]}
                                        </p>
                                    )}

                                    <h5>
                                        {comentario.nombre} {comentario.apellido}
                                    </h5>
                                    {/* Cada usuario puede eliminar sus propios comentarios */}
                                    {usuario && usuario.id_usuario === comentario.id_usuario && (
                                        <button
                                            type="button"
                                            onClick={() => SolicitarEliminarComentario(comentario.id_comentario)}
                                        >
                                            <Trash size={20}/>
                                        </button>
                                    )}
                                </div>
                                {/* Texto y fecha del comentario */}
                                <div className='comentarioFecha'>
                                    <p className='comentario'>
                                        {comentario.descripcion}
                                    </p>
                                    <small>{FormatearFecha(comentario.fecha)}</small>
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
