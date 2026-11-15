import '../estilos/menuLateral.css'
import { NavLink, Link } from 'react-router-dom'
import { Plus, House, Heart, Bookmark, Settings } from 'lucide-react'
import logoRezips from '../../public/logo.png'

function MenuLateral(){
    const usuarioActual = JSON.parse(localStorage.getItem('usuario'))

    return(
        <nav className="lateral">
            <ul className='enlaces'>
                <li className='logo'>
                    <Link to="/principal">
                        <img src={logoRezips} alt="Rezips" />
                    </Link>
                </li>
                <li className='crear'><Link to="/crearReceta" className='crearReceta'><Plus size={30} style={{paddingRight: 10}}/>Crear receta</Link></li>
                <li><NavLink to="/principal"><House style={{paddingRight: 10}}/>Página principal</NavLink></li>
                <li><NavLink to="/meGusta"><Heart style={{paddingRight: 10}}/>Me gusta</NavLink></li>
                <li><NavLink to="/guardados"><Bookmark style={{paddingRight: 10}}/>Guardado</NavLink></li>
                <li><NavLink to="/configuracion"><Settings style={{paddingRight: 10}}/>Configuración</NavLink></li>
            </ul>

            <Link to="/perfil" className='perfil'>
                {usuarioActual?.imagen_perfil ? (
                    <img
                        src={usuarioActual.imagen_perfil}
                        alt="Foto de perfil"
                        className="fotoPerfilMenu"
                    />
                ) : (
                    <>
                        {usuarioActual?.nombre?.[0]}
                        {usuarioActual?.apellido?.[0]}
                    </>
                )}
            </Link>
        </nav>
    )
}

export default MenuLateral
