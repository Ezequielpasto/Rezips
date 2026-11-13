import '../estilos/configuracion.css';
import MenuLateral from '../componentes/menuLateral';
import { useNavigate } from 'react-router-dom';
import { UserRound, Mail, LockKeyhole, LogOut, Trash2, ChevronRight } from 'lucide-react';

function Configuracion() {
    const navegar = useNavigate();

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    function CerrarSesion() {
        localStorage.removeItem('usuario');
        navegar('/');
    }

    async function EliminarCuenta() {
        if (!usuario) {
            alert('No se encontró el usuario.');
            return;
        }

        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.'
        );

        if (!confirmar) return;

        try {
            const respuesta = await fetch(`http://localhost:3000/usuarios/${usuario.id_usuario}`, {
                method: 'DELETE'
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo eliminar la cuenta.');
            }

            localStorage.removeItem('usuario');
            alert('Tu cuenta fue eliminada correctamente.');
            navegar('/');

        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
            alert('Ocurrió un error al eliminar la cuenta.');
        }
    }

    return (
        <section className="pantallaConfiguracion">
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
                        <button className="opcionConfiguracion opcionEliminar" onClick={EliminarCuenta}>
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
    );
}

export default Configuracion;
