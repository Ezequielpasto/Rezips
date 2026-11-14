
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuLateral from '../componentes/menuLateral'
import Notificacion from '../componentes/notificacion'
import '../estilos/cambiarContrasenia.css'

function CambiarContrasenia() {
    const navegar = useNavigate()

    const [contraseniaActual, setContraseniaActual] = useState('')
    const [contraseniaNueva, setContraseniaNueva] = useState('')
    const [repetirContrasenia, setRepetirContrasenia] = useState('')
    const [cargando, setCargando] = useState(false)
    const [notificacion, setNotificacion] = useState(null)

    const MostrarNotificacion = (mensaje, tipo = 'exito') => {
        setNotificacion({ mensaje, tipo })
    }

    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    async function GuardarCambios(event) {
        event.preventDefault()

        if (!contraseniaActual || !contraseniaNueva || !repetirContrasenia) {
            MostrarNotificacion('Completá todos los campos', 'advertencia')
            return
        }

        if (contraseniaNueva.length < 6) {
            MostrarNotificacion('La nueva contraseña debe tener al menos 6 caracteres', 'advertencia')
            return
        }

        if (contraseniaNueva !== repetirContrasenia) {
            MostrarNotificacion('Las contraseñas nuevas no coinciden', 'advertencia')
            return
        }

        if (contraseniaActual === contraseniaNueva) {
            MostrarNotificacion('La nueva contraseña debe ser diferente a la actual', 'advertencia')
            return
        }

        try {
            setCargando(true)

            const usuario = JSON.parse(localStorage.getItem('usuario'))

            if (!usuario) {
                throw new Error('No se encontró el usuario')
            }

            const respuesta = await fetch(
                `http://localhost:3000/usuarios/${usuario.id_usuario}/contrasenia`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contrasenaActual: contraseniaActual,
                        contrasenaNueva: contraseniaNueva
                    })
                }
            )

            const datos = await respuesta.json()

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo cambiar la contraseña')
            }

            MostrarNotificacion('Tu contraseña se actualizó correctamente')

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
        <section className="pantallaCambiarContrasenia">
            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            <MenuLateral />

            <main className="contenidoCambiarContrasenia">
                <h2>Cambiar contraseña</h2>

                <p className="descripcionCambiarContrasenia">
                    Actualizá la contraseña de tu cuenta.
                </p>

                <form
                    className="formCambiarContrasenia"
                    onSubmit={GuardarCambios}
                >
                    <label>Contraseña actual</label>
                    <input
                        type="password"
                        value={contraseniaActual}
                        onChange={(e) => setContraseniaActual(e.target.value)}
                        placeholder="Ingresá tu contraseña actual"
                    />

                    <label>Nueva contraseña</label>
                    <input
                        type="password"
                        value={contraseniaNueva}
                        onChange={(e) => setContraseniaNueva(e.target.value)}
                        placeholder="Ingresá la nueva contraseña"
                    />

                    <label>Repetir nueva contraseña</label>
                    <input
                        type="password"
                        value={repetirContrasenia}
                        onChange={(e) => setRepetirContrasenia(e.target.value)}
                        placeholder="Repetí la nueva contraseña"
                    />

                    <button
                        type="submit"
                        className="guardarCambiarContrasenia"
                        disabled={cargando}
                    >
                        {cargando ? 'Guardando...' : 'Guardar cambios'}
                    </button>

                    <button
                        type="button"
                        className="cancelarCambiarContrasenia"
                        onClick={() => navegar('/configuracion')}
                    >
                        Cancelar
                    </button>
                </form>
            </main>
        </section>
    )
}

export default CambiarContrasenia
