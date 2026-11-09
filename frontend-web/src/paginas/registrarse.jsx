import '../estilos/registrarse.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Registrarse(){
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [fechaNacimiento, setFechaNacimiento] = useState("")
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")

    const navegar = useNavigate()

    function ValidarRegistro(){
        // Validar campos vacíos
        if (nombre.trim() === '' || apellido.trim() === '' || fechaNacimiento === '' || correo.trim() === '' || contraseña === ''){
            alert('Todos los campos son obligatorios')
            return false
        }

        // Validar fecha
        const fechaIngresada = new Date(fechaNacimiento)
        const hoy = new Date()
        if(fechaIngresada > hoy){
            alert("La fecha ingresada no puede ser futura")
            return false
        }

        // Validar edad
        let edad = hoy.getFullYear() - fechaIngresada.getFullYear()
        const diferenciaMeses = hoy.getMonth() - fechaIngresada.getMonth()
        if(diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaIngresada.getDate())){
            edad--
        }
        if(edad < 13){
            alert("Para poder registrarte debes tener al menos 13 años")
            return false
        }

        // Validar contraseña
        if(contraseña.length < 8){
            alert("La contaseña debe tener al menos 8 caracteres")
            return false
        }

        return true
    }

    async function EnviarRegistro(event){
        event.preventDefault()

        if(ValidarRegistro()){
            try{
                const respuesta = await fetch('http://localhost:3000/auth/registro', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre,
                        apellido,
                        fecha_nacimiento: fechaNacimiento,
                        correo,
                        contrasena: contraseña
                    })
                })

                const datos = await respuesta.json()

                if(!respuesta.ok){
                    alert(datos.mensaje || 'Error al registrar el usuario')
                    return
                }

                alert('Cuenta creada correctamente')
                navegar('/')
            } catch(error){
                console.error('Error:', error)
                alert('No se pudo conectar con el servidor')
            }
        }
    }

    return(
        <div className='registro'>
            <h1>Create una cuenta de Rezips</h1>
            <form onSubmit={EnviarRegistro} className='formRegistro'>
                <div className="nombreApellido">
                    <p>Ingresa tu nombre y tu apellido</p>
                    <div>
                    <input type="text" placeholder="Nombre" value={nombre} onChange={(event => setNombre(event.target.value))}/>
                    <input type="text" placeholder="Apellido" value={apellido} onChange={(event => setApellido(event.target.value))}/>
                    </div>
                </div>
                <div className="cumpleaños">
                    <p>Ingresa tu fecha de nacimiento</p>
                    <input type="date" value={fechaNacimiento} onChange={(event => setFechaNacimiento(event.target.value))}/>
                </div>
                <div className="correo">
                    <p>Ingresa tu correo electrónico</p>
                    <input type="email" placeholder="Correo electrónico" value={correo} onChange={(event => setCorreo(event.target.value))}/>
                </div>
                <div className="contraseña">
                    <p>Crea una contraseña segura</p>
                    <input type="password" placeholder="Contraseña" value={contraseña} onChange={(event => setContraseña(event.target.value))}/>
                </div>
                <button type='submit'>Crear cuenta</button>
            </form>
            <p>¿Ya tienes una cuenta? <Link to="/">Iniciá sesión</Link></p>
        </div>
    )
}
export default Registrarse