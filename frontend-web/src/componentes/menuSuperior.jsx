import './menuSuperior.css'

function MenuSuperior({busqueda, setBusqueda}){
    return(
        <div className="superior">
            <input type="search" placeholder='Buscar por nombre o por ingredientes' value={busqueda} onChange={(event) => setBusqueda(event.target.value)}/>
        </div>
    )
}
export default MenuSuperior