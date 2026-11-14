
import { useState, useCallback } from 'react'
import '../estilos/configuracion.css'
import MenuLateral from '../componentes/menuLateral'
import Notificacion from '../componentes/notificacion'
import Confirmacion from '../componentes/confirmacion'
import { useNavigate } from 'react-router-dom'
import { UserRound, Mail, LockKeyhole, LogOut, Trash2, ChevronRight } from 'lucide-react'

function Configuracion() {
    const navegar = useNavigate()

    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const [notificacion, setNotificacion] = useState(null)
    const [confirmacion, setConfirmacion] = useState(null)

    const MostrarNotificacion = (mensaje, tipo = 'exito') => {
        setNotificacion({ mensaje, tipo })
    }

    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    function CerrarSesion() {
        localStorage.removeItem('usuario')
        navegar('/')
    }

    function SolicitarEliminarCuenta() {
        setConfirmacion({
            mensaje: '¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.',
            onConfirmar: EliminarCuenta
        })
    }

    async function EliminarCuenta() {
        if (!usuario) {
            MostrarNotificacion('No se encontró el usuario.', 'error')
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/usuarios/${usuario.id_usuario}`, {
                method: 'DELETE'
            })

            if (!respuesta.ok) {
                throw new Error('No se pudo eliminar la cuenta.')
            }

            localStorage.removeItem('usuario')

            MostrarNotificacion('Tu cuenta fue eliminada correctamente')

            setTimeout(() => {
                navegar('/')
            }, 1500)

        } catch (error) {
            console.error('Error al eliminar la cuenta:', error)
            MostrarNotificacion('Ocurrió un error al eliminar la cuenta.', 'error')
        }
    }

    function ConfirmarAccion() {
        const accion = confirmacion?.onConfirmar

        setConfirmacion(null)

        if (accion) {
            accion()
        }
    }

    return (
        <section className="pantallaConfiguracion">
            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            <Confirmacion
                mensaje={confirmacion?.mensaje}
                onConfirmar={ConfirmarAccion}
                onCancelar={() => setConfirmacion(null)}
            />

            <MenuLateral />

            <main className="contenidoConfiguracion">
                <h2>Configuración</h2>

                <div className="seccionConfiguracion">
                    <h4>CUENTA</h4>

                    <div className="opcionesConfiguracion">
                        <button className="opcionConfiguracion" onClick={() => navegar('/editarDatos')}>
                            <div className="iconoConfiguracion">
                                <UserRound />
                            </div>

                            <div className="textoConfiguracion">
                                <h5>Editar datos personales</h5>
                                <p>Modificá tu nombre y otros datos personales.</p>
                            </div>

                            <ChevronRight className="flechaConfiguracion" />
                        </button>

                        <button className="opcionConfiguracion" onClick={() => navegar('/cambiarCorreo')}>
                            <div className="iconoConfiguracion">
                                <Mail />
                            </div>

                            <div className="textoConfiguracion">
                                <h5>Cambiar correo electrónico</h5>
                                <p>Actualizá el correo asociado a tu cuenta.</p>
                            </div>

                            <ChevronRight className="flechaConfiguracion" />
                        </button>

                        <button className="opcionConfiguracion" onClick={() => navegar('/cambiarContrasenia')}>
                            <div className="iconoConfiguracion">
                                <LockKeyhole />
                            </div>

                            <div className="textoConfiguracion">
                                <h5>Cambiar contraseña</h5>
                                <p>Actualizá la contraseña de tu cuenta.</p>
                            </div>

                            <ChevronRight className="flechaConfiguracion" />
                        </button>
                    </div>
                </div>

                <div className="seccionConfiguracion">
                    <h4>SESIÓN</h4>

                    <div className="opcionesConfiguracion">
                        <button className="opcionConfiguracion" onClick={CerrarSesion}>
                            <div className="iconoConfiguracion">
                                <LogOut />
                            </div>

                            <div className="textoConfiguracion">
                                <h5>Cerrar sesión</h5>
                                <p>Cerrá tu sesión en este dispositivo.</p>
                            </div>

                            <ChevronRight className="flechaConfiguracion" />
                        </button>
                    </div>
                </div>

                <div className="seccionConfiguracion zonaPeligro">
                    <h4>ZONA DE PELIGRO</h4>

                    <div className="opcionesConfiguracion">
                        <button className="opcionConfiguracion opcionEliminar" onClick={SolicitarEliminarCuenta}>
                            <div className="iconoConfiguracion iconoEliminar">
                                <Trash2 />
                            </div>

                            <div className="textoConfiguracion">
                                <h5>Eliminar cuenta</h5>
                                <p>Eliminá permanentemente tu cuenta y tus datos.</p>
                            </div>

                            <ChevronRight className="flechaConfiguracion" />
                        </button>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Configuracion
