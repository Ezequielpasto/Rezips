import API_URL from '../config/api';
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuLateral from '../componentes/menuLateral'
import Notificacion from '../componentes/notificacion'
import '../estilos/editarDatos.css'

function EditarDatos() {
    const navegar = useNavigate()

    const [usuario, setUsuario] = useState(null)
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState('')
    const [imagenPerfil, setImagenPerfil] = useState('')
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [notificacion, setNotificacion] = useState(null)

    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    function MostrarNotificacion(mensaje, tipo = 'exito') {
        setNotificacion({ mensaje, tipo })
    }

    // Obtener los datos actuales del usuario
    useEffect(() => {
        async function ObtenerUsuario() {
            try {
                const datos = localStorage.getItem('usuario')

                if (!datos) return

                const usuarioActual = JSON.parse(datos)

                const respuesta = await fetch(`${API_URL}/usuarios/${usuarioActual.id_usuario}`)

                const texto = await respuesta.text()

                console.log('Estado:', respuesta.status)
                console.log('URL:', respuesta.url)
                console.log('Respuesta:', texto)

                if (!respuesta.ok) {
                    throw new Error('No se pudieron obtener los datos')
                }

                const datosRespuesta = JSON.parse(texto)
                const datosUsuario = datosRespuesta.usuario || datosRespuesta

                setUsuario(datosUsuario)
                setNombre(datosUsuario.nombre || '')
                setApellido(datosUsuario.apellido || '')
                setFechaNacimiento(
                    datosUsuario.fecha_nacimiento
                        ? datosUsuario.fecha_nacimiento.substring(0, 10)
                        : ''
                )
                setImagenPerfil(datosUsuario.imagen_perfil || '')

            } catch (error) {
                console.error('Error al obtener usuario:', error)
                MostrarNotificacion('No se pudieron cargar tus datos', 'error')
            }
        }

        ObtenerUsuario()
    }, [])

    // Convertir la imagen seleccionada a Base64
    function ConvertirImagen(archivo) {
        return new Promise((resolve, reject) => {
            const lector = new FileReader()

            lector.onload = () => resolve(lector.result)
            lector.onerror = () => reject(lector.error)

            lector.readAsDataURL(archivo)
        })
    }

    // Seleccionar una nueva imagen de perfil
    async function SeleccionarImagen(event) {
        const archivo = event.target.files[0]

        if (!archivo) return

        if (!archivo.type.startsWith('image/')) {
            MostrarNotificacion('Debes seleccionar una imagen válida', 'advertencia')
            return
        }

        setImagenSeleccionada(archivo)

        try {
            const imagenBase64 = await ConvertirImagen(archivo)
            setImagenPerfil(imagenBase64)
        } catch (error) {
            console.error(error)
            MostrarNotificacion('No se pudo cargar la imagen', 'error')
        }
    }

    // Guardar los cambios realizados en los datos personales
    async function GuardarCambios(e) {
        e.preventDefault()

        if (!nombre.trim()) {
            MostrarNotificacion('El nombre es obligatorio', 'advertencia')
            return
        }

        if (!usuario) return

        try {
            setCargando(true)

            // Actualizar nombre, apellido y fecha de nacimiento
            const respuesta = await fetch(`${API_URL}/usuarios/${usuario.id_usuario}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        apellido: apellido.trim(),
                        fecha_nacimiento: fechaNacimiento || null
                    })
                }
            )

            const datos = await respuesta.json()

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudieron guardar los cambios')
            }

            let usuarioActualizado = {
                ...usuario,
                ...datos.usuario
            }

            // Actualizar la imagen solamente si se seleccionó una nueva
            if (imagenSeleccionada) {
                const respuestaImagen = await fetch(`${API_URL}/usuarios/${usuario.id_usuario}/imagen`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            imagen_perfil: imagenPerfil
                        })
                    }
                )

                const datosImagen = await respuestaImagen.json()

                if (!respuestaImagen.ok) {
                    throw new Error(
                        datosImagen.mensaje || 'No se pudo actualizar la imagen'
                    )
                }

                usuarioActualizado = {
                    ...usuarioActualizado,
                    ...datosImagen.usuario
                }
            }

            // Actualizar los datos guardados en el navegador
            localStorage.setItem(
                'usuario',
                JSON.stringify(usuarioActualizado)
            )

            setUsuario(usuarioActualizado)
            setImagenSeleccionada(null)

            MostrarNotificacion(
                'Tus datos se actualizaron correctamente',
                'exito'
            )

            setTimeout(() => {
                navegar('/configuracion')
            }, 1500)

        } catch (error) {
            console.error(error)
            MostrarNotificacion(error.message, 'error')
        } finally {
            setCargando(false)
        }
    }

    return (
        <section className="pantallaEditarDatos">
            <MenuLateral />

            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            <main className="contenidoEditarDatos">
                <h2>Editar datos personales</h2>

                <p className="descripcionEditarDatos">
                    Modificá los datos de tu cuenta.
                </p>

                <form className="formEditarDatos" onSubmit={GuardarCambios}>
                    <label>Foto de perfil</label>

                    <div className="imagenPerfilEditar">
                        {imagenPerfil ? (
                            <img
                                src={imagenPerfil}
                                alt="Foto de perfil"
                            />
                        ) : (
                            <div className="imagenPerfilVacia">
                                Sin foto
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={SeleccionarImagen}
                    />

                    <label>Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                    />

                    <label>Apellido</label>
                    <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        placeholder="Tu apellido"
                    />

                    <label>Fecha de nacimiento</label>
                    <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="guardarEditarDatos"
                        disabled={cargando || !usuario}
                    >
                        {cargando ? 'Guardando...' : 'Guardar cambios'}
                    </button>

                    <button
                        type="button"
                        className="cancelarEditarDatos"
                        onClick={() => navegar('/configuracion')}
                    >
                        Cancelar
                    </button>
                </form>
            </main>
        </section>
    )
}

export default EditarDatos
