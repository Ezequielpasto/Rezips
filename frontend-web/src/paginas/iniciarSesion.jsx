import '../estilos/iniciarSesion.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Notificacion from '../componentes/notificacion'
import API_URL from '../config/api';

function IniciarSesion() {
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [notificacion, setNotificacion] = useState(null)

    const navegar = useNavigate()

    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    function MostrarNotificacion(mensaje, tipo = 'exito') {
        setNotificacion({ mensaje, tipo })
    }

    function ValidarInicioSesion() {
        if (correo.trim() === '' || contraseña === '') {
            MostrarNotificacion('Todos los campos son obligatorios', 'advertencia')
            return false
        }

        return true
    }

    async function IniciarSesionUsuario(event) {
        event.preventDefault()

        if (ValidarInicioSesion()) {
            try {
                const respuesta = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo,
                        contrasena: contraseña
                    })
                })

                const datos = await respuesta.json()

                if (!respuesta.ok) {
                    MostrarNotificacion(datos.mensaje || 'Correo y/o contraseña incorrectos', 'error')
                    return
                }

                localStorage.setItem('usuario', JSON.stringify(datos.usuario))

                MostrarNotificacion('Inicio de sesión exitoso', 'exito')

                setTimeout(() => {
                    navegar('/principal')
                }, 1500)

            } catch (error) {
                console.error('Error:', error)
                MostrarNotificacion('No se pudo conectar con el servidor', 'error')
            }
        }
    }

    return (
        <div className='inicio'>
            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            <h1>Bienvenido a Rezips</h1>
            <form className='formulario' onSubmit={IniciarSesionUsuario}>
                <input
                    type="text"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(event) => setCorreo(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(event) => setContraseña(event.target.value)}
                />

                <button type='submit'>Iniciar sesión</button>
            </form>

            <p>¿No tienes una cuenta? <Link to="/registro">Create una cuenta</Link></p>
        </div>
    )
}

export default IniciarSesion