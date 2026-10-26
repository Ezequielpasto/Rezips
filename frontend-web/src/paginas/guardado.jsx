import MenuSuperior from "../componentes/menuSuperior"
import MenuLateral from "../componentes/menuLateral"
import Filtros from '../componentes/filtros'
import ListaRecetas from '../componentes/listaRecetas'

function Guardado(){
    return(
        <div>
            <MenuSuperior></MenuSuperior>
            <MenuLateral ></MenuLateral>
            <main className='principal'>
                <Filtros></Filtros>
                <ListaRecetas></ListaRecetas>
            </main>
        </div> 
    )
}
export default Guardado