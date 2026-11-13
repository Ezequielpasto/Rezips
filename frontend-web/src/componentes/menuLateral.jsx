import '../estilos/menuLateral.css'
import { Link } from 'react-router-dom'

function MenuLateral(){
    const usuarioActual = JSON.parse(localStorage.getItem('usuario'))

    return(
        <nav className="lateral">
            <ul className='enlaces'>
                <li className='logo'><Link to="/principal">Rezips</Link></li>
                <li className='crear'><Link to="/crearReceta" className='crearReceta'>Crear receta</Link></li>
                <li><Link to="/principal">Página principal</Link></li>
                <li><Link to="/meGusta">Me gusta</Link></li>
                <li><Link to="/guardados">Guardado</Link></li>
                <li><Link to="/configuracion">Configuración</Link></li>
            </ul>
            <Link to="/perfil" className='perfil'>{usuarioActual.nombre[0]}{usuarioActual.apellido[0]}</Link>
        </nav>
    )
}
export default MenuLateral