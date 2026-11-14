import API_URL from '../config/api';
import '../estilos/registrarse.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Notificacion from '../componentes/notificacion'

function Registrarse(){
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [fechaNacimiento, setFechaNacimiento] = useState("")
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [imagenPerfil, setImagenPerfil] = useState("")
    const [notificacion, setNotificacion] = useState(null)

    const navegar = useNavigate()

    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    function MostrarNotificacion(mensaje, tipo = 'exito') {
        setNotificacion({ mensaje, tipo })
    }

    function ConvertirImagen(archivo) {
        return new Promise((resolve, reject) => {
            const lector = new FileReader()

            lector.onload = () => resolve(lector.result)
            lector.onerror = () => reject(lector.error)

            lector.readAsDataURL(archivo)
        })
    }

    async function SeleccionarImagen(event) {
        const archivo = event.target.files[0]

        if (!archivo) return

        if (!archivo.type.startsWith('image/')) {
            MostrarNotificacion('Debes seleccionar una imagen válida', 'advertencia')
            event.target.value = ''
            return
        }

        try {
            const imagenBase64 = await ConvertirImagen(archivo)
            setImagenPerfil(imagenBase64)
        } catch(error) {
            console.error(error)
            MostrarNotificacion('No se pudo cargar la imagen', 'error')
        }
    }

    function ValidarRegistro(){
        if (nombre.trim() === '' || apellido.trim() === '' || fechaNacimiento === '' || correo.trim() === '' || contraseña === ''){
            MostrarNotificacion('Todos los campos son obligatorios', 'advertencia')
            return false
        }

        const fechaIngresada = new Date(fechaNacimiento)
        const hoy = new Date()

        if(fechaIngresada > hoy){
            MostrarNotificacion('La fecha ingresada no puede ser futura', 'advertencia')
            return false
        }

        let edad = hoy.getFullYear() - fechaIngresada.getFullYear()
        const diferenciaMeses = hoy.getMonth() - fechaIngresada.getMonth()

        if(diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaIngresada.getDate())){
            edad--
        }

        if(edad < 13){
            MostrarNotificacion('Para poder registrarte debes tener al menos 13 años', 'advertencia')
            return false
        }

        if(contraseña.length < 8){
            MostrarNotificacion('La contraseña debe tener al menos 8 caracteres', 'advertencia')
            return false
        }

        return true
    }

    async function EnviarRegistro(event){
        event.preventDefault()

        if(ValidarRegistro()){
            try{
                const respuesta = await fetch(`${API_URL}/auth/registro`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre,
                        apellido,
                        fecha_nacimiento: fechaNacimiento,
                        correo,
                        contrasena: contraseña,
                        imagen_perfil: imagenPerfil || null
                    })
                })

                const datos = await respuesta.json()

                if(!respuesta.ok){
                    MostrarNotificacion(datos.mensaje || 'Error al registrar el usuario', 'error')
                    return
                }

                MostrarNotificacion('Cuenta creada correctamente', 'exito')

                setTimeout(() => {
                    navegar('/')
                }, 1500)

            } catch(error){
                console.error('Error:', error)
                MostrarNotificacion('No se pudo conectar con el servidor', 'error')
            }
        }
    }

    return(
        <div className='registro'>
            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            <h1>Create una cuenta de Rezips</h1>

            <form onSubmit={EnviarRegistro} className='formRegistro'>
                <div className="nombreApellido">
                    <p>Ingresa tu nombre y tu apellido</p>
                    <div>
                        <input type="text" placeholder="Nombre" value={nombre} onChange={(event) => setNombre(event.target.value)}/>
                        <input type="text" placeholder="Apellido" value={apellido} onChange={(event) => setApellido(event.target.value)}/>
                    </div>
                </div>

                <div className="imagenRegistro">
                    <p>Seleccioná una foto de perfil (opcional)</p>

                    <div className="vistaPreviaRegistro">
                        {imagenPerfil ? (
                            <img src={imagenPerfil} alt="Vista previa de perfil"/>
                        ) : (
                            <div className="imagenRegistroVacia">
                                Sin foto
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={SeleccionarImagen}
                    />
                </div>

                <div className="cumpleaños">
                    <p>Ingresa tu fecha de nacimiento</p>
                    <input type="date" value={fechaNacimiento} onChange={(event) => setFechaNacimiento(event.target.value)}/>
                </div>

                <div className="correo">
                    <p>Ingresa tu correo electrónico</p>
                    <input type="email" placeholder="Correo electrónico" value={correo} onChange={(event) => setCorreo(event.target.value)}/>
                </div>

                <div className="contraseña">
                    <p>Crea una contraseña segura</p>
                    <input type="password" placeholder="Contraseña" value={contraseña} onChange={(event) => setContraseña(event.target.value)}/>
                </div>

                <button type='submit'>Crear cuenta</button>
            </form>

            <p>¿Ya tienes una cuenta? <Link to="/">Iniciá sesión</Link></p>
        </div>
    )
}

export default Registrarse
