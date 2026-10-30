import './menuSuperior.css'

function MenuSuperior(){
    return(
        <div className="superior">
            <ul>
                <li className='buscador'>
                    <input type="search" placeholder='Buscar...'/>
                </li>
            </ul>
        </div>
    )
}
export default MenuSuperior