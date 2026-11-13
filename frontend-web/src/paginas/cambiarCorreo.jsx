
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../componentes/menuLateral';
import '../estilos/cambiarCorreo.css';

function CambiarCorreo() {
    const navegar = useNavigate();

    const [correoActual, setCorreoActual] = useState('');
    const [correoNuevo, setCorreoNuevo] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        async function ObtenerUsuario() {
            try {
                const datos = localStorage.getItem('usuario');

                if (!datos) return;

                const usuario = JSON.parse(datos);

                const respuesta = await fetch(
                    `http://localhost:3000/usuarios/${usuario.id_usuario}`
                );

                if (!respuesta.ok) {
                    throw new Error('No se pudo obtener el usuario');
                }

                const datosUsuario = await respuesta.json();

                setCorreoActual(datosUsuario.correo || '');
            } catch (error) {
                console.error(error);
                alert('No se pudo cargar tu correo actual');
            }
        }

        ObtenerUsuario();
    }, []);

    async function GuardarCambios(e) {
        e.preventDefault();

        if (!correoNuevo.trim()) {
            alert('Ingresá el nuevo correo');
            return;
        }

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correoNuevo.trim())) {
            alert('Ingresá un correo válido');
            return;
        }

        if (correoNuevo.trim().toLowerCase() === correoActual.toLowerCase()) {
            alert('El nuevo correo debe ser diferente al actual');
            return;
        }

        try {
            setCargando(true);

            const datos = JSON.parse(localStorage.getItem('usuario'));

            const respuesta = await fetch(
                `http://localhost:3000/usuarios/${datos.id_usuario}/correo`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo: correoNuevo.trim()
                    })
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || 'No se pudo cambiar el correo');
            }

            const usuarioActualizado = {
                ...datos,
                correo: resultado.usuario?.correo || correoNuevo.trim()
            };

            localStorage.setItem(
                'usuario',
                JSON.stringify(usuarioActualizado)
            );

            alert('Tu correo se actualizó correctamente');
            navegar('/configuracion');

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <section className="pantallaCambiarCorreo">
            <MenuLateral />

            <main className="contenidoCambiarCorreo">
                <h2>Cambiar correo electrónico</h2>

                <p className="descripcionCambiarCorreo">
                    Actualizá el correo asociado a tu cuenta.
                </p>

                <form className="formCambiarCorreo" onSubmit={GuardarCambios}>
                    <label>Correo actual</label>
                    <input
                        type="email"
                        value={correoActual}
                        disabled
                    />

                    <label>Nuevo correo</label>
                    <input
                        type="email"
                        value={correoNuevo}
                        onChange={(e) => setCorreoNuevo(e.target.value)}
                        placeholder="Ingresá tu nuevo correo"
                    />

                    <button
                        type="submit"
                        className="guardarCambiarCorreo"
                        disabled={cargando}
                    >
                        {cargando ? 'Guardando...' : 'Guardar cambios'}
                    </button>

                    <button
                        type="button"
                        className="cancelarCambiarCorreo"
                        onClick={() => navegar('/configuracion')}
                    >
                        Cancelar
                    </button>
                </form>
            </main>
        </section>
    );
}

export default CambiarCorreo;
