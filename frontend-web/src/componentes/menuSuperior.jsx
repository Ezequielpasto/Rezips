import '../estilos/menuSuperior.css'
import { Search } from 'lucide-react'

function MenuSuperior({busqueda, setBusqueda}){
    return(
        <div className="superior">
            <Search className='iconoBuscador'/>
            <input type="search" placeholder='Buscar por nombre o por ingredientes' value={busqueda} onChange={(event) => setBusqueda(event.target.value)}/>
        </div>
    )
}
export default MenuSuperior