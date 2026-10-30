import './menuLateral.css'
import { Link } from 'react-router-dom'

function MenuLateral(){
    return(
        <nav className="lateral">
            <ul className='enlaces'>
                <li className='logo'>Recips</li>
                <li className='crear'><Link to="/crearReceta" className='crearReceta'>Crear receta</Link></li>
                <li><Link to="/principal">Página principal</Link></li>
                <li><Link to="/meGusta">Me gusta</Link></li>
                <li><Link to="/guardados">Guardado</Link></li>
                <li><Link>Configuración</Link></li>
            </ul>
            <Link to="/perfil" className='perfil'>EP</Link>
        </nav>
    )
}
export default MenuLateral