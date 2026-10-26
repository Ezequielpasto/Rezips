import './menuSuperior.css'

function MenuSuperior(){
    return(
        <div className="superior">
            <ul>
                <li>
                    <h2 className='logo'>Rezips</h2>
                </li>
                <li className='buscador'>
                    <input type="search" placeholder='Buscar...'/>
                </li>
                <li>
                    <a href="" className='perfil'>EP</a>
                </li>
            </ul>
        </div>
    )
}
export default MenuSuperior