import '../estilos/iniciarSesion.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function IniciarSesion(){
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")

    const navegar = useNavigate()

    function ValidarInicioSesion(){
        if(correo.trim() === '' || contraseña === ''){
            alert("Todos los campos son obligatorios")
            return false
        }

        return true
    }

    async function IniciarSesionUsuario(event){
        event.preventDefault()

        if(ValidarInicioSesion()){
             try{
                const respuesta = await fetch('http://localhost:3000/auth/login', {
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

                if(!respuesta.ok){
                    alert(datos.mensaje || 'Correo y/o contraseña incorrectos')
                    return
                }

                localStorage.setItem('usuario', JSON.stringify(datos.usuario))

                alert("Inicio de sesión exitoso")
                navegar('/principal')

            } catch(error){
                console.error('Error:', error)
                alert('No se pudo conectar con el servidor')
            }
       
        }
    }

    return(
        <div className='inicio'>
            <h1>Bienvenido a Rezips</h1>
            <form className='formulario' onSubmit={IniciarSesionUsuario}>
                <input type="text" placeholder="Correo electrónico" value={correo} onChange={(event) => setCorreo(event.target.value)}/>
                <input type="password" placeholder="Contraseña" value={contraseña} onChange={(event) => setContraseña(event.target.value)}/>
                <button type='submit'>Iniciar sesión</button>
            </form>
            <p>¿No tienes una cuenta? <Link to="/registro">Create una cuenta</Link></p>
        </div>
    )
}
export default IniciarSesion