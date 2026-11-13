import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../componentes/menuLateral';
import '../estilos/editarDatos.css';

function EditarDatos() {
    const navegar = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
    async function ObtenerUsuario() {
        try {
            const datos = localStorage.getItem('usuario');

            if (!datos) return;

            const usuarioActual = JSON.parse(datos);

            const respuesta = await fetch(
                `http://localhost:3000/usuarios/${usuarioActual.id_usuario}`
            );

            const texto = await respuesta.text();

            console.log('Estado:', respuesta.status);
            console.log('URL:', respuesta.url);
            console.log('Respuesta:', texto);

            if (!respuesta.ok) {
                throw new Error('No se pudieron obtener los datos');
            }

            const datosUsuario = JSON.parse(texto).usuario || JSON.parse(texto);

            setUsuario(datosUsuario);
            setNombre(datosUsuario.nombre || '');
            setApellido(datosUsuario.apellido || '');
            setFechaNacimiento(
                datosUsuario.fecha_nacimiento
                    ? datosUsuario.fecha_nacimiento.substring(0, 10)
                    : ''
            );

        } catch (error) {
            console.error('Error al obtener usuario:', error);
            alert('No se pudieron cargar tus datos');
        }
    }

    ObtenerUsuario();
}, []);

    async function GuardarCambios(e) {
        e.preventDefault();

        if (!nombre.trim()) {
            alert('El nombre es obligatorio');
            return;
        }

        try {
            setCargando(true);

            const respuesta = await fetch(`http://localhost:3000/usuarios/${usuario.id_usuario}`,
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
            );

            const texto = await respuesta.text();

            console.log('Estado:', respuesta.status);
            console.log('URL:', respuesta.url);
            console.log('Respuesta:', texto);

            const datos = JSON.parse(texto);

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudieron guardar los cambios');
            }

            // Actualizar los datos guardados en el navegador
            const usuarioActualizado = {
                ...usuario,
                ...datos.usuario
            };

            localStorage.setItem(
                'usuario',
                JSON.stringify(usuarioActualizado)
            );

            setUsuario(usuarioActualizado);

            alert('Tus datos se actualizaron correctamente');
            navegar('/configuracion');

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <section className="pantallaEditarDatos">
            <MenuLateral />

            <main className="contenidoEditarDatos">
                <h2>Editar datos personales</h2>

                <p className="descripcionEditarDatos">
                    Modificá los datos de tu cuenta.
                </p>

                <form className="formEditarDatos" onSubmit={GuardarCambios}>
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
    );
}

export default EditarDatos;
