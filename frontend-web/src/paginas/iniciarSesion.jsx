import './iniciarSesion.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function IniciarSesion(){
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")

    const navegar = useNavigate()

    function ValidarInicioSesion(){
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuario')) 

        if(usuarioGuardado === null){
            alert("No hay ningun usuario registrado")
            return false
        }

        if(correo !== usuarioGuardado.correo || contraseña !== usuarioGuardado.contraseña){
            alert("Correo y/o contraseña incorrectos")
            return false
        }
        return true
    }

    function IniciarSesionUsuario(event){
        event.preventDefault()

        if(ValidarInicioSesion()){
            alert("Inicio de sesión exitoso")
            navegar('/principal')
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
            <Link to="/principal">Probar</Link>
        </div>
    )
}
export default IniciarSesion