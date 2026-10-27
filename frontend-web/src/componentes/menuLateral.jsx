import './menuLateral.css'

function MenuLateral(){
    return(
        <nav className="lateral">
            <ul className='enlaces'>
                <li className='logo'>Recips</li>
                <li className='crear'><a href="#" className='crearReceta'>Crear receta</a></li>
                <li><a href="#">Página principal</a></li>
                <li><a href="#">Me gusta</a></li>
                <li><a href="#">Guardado</a></li>
                <li><a href="#">Configuración</a></li>
            </ul>
        </nav>
    )
}
export default MenuLateral