import './iniciarSesion.css'
import { Link } from 'react-router-dom'

function IniciarSesion(){
    return(
        <div className='inicio'>
            <h1>Bienvenido a Rezips</h1>
            <form className='formulario' action="">
                <input type="text" placeholder="Correo electrónico" />
                <input type="password" placeholder="Contraseña" />
                <button>Iniciar sesión</button>
            </form>
            <p>¿No tienes una cuanta? <Link to="/registro">Create una cuenta</Link></p>
            <Link to="/principal">Probar</Link>
        </div>
    )
}
export default IniciarSesion