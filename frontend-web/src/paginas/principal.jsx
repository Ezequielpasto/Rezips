import './principal.css'
import MenuSuperior from "../componentes/menuSuperior"
import MenuLateral from "../componentes/menuLateral"

function Principal(){
    return(
        <div>
            <MenuSuperior></MenuSuperior>
            <MenuLateral></MenuLateral>
            <main className='recetas'>
                <p>hola</p>
            </main>
        </div>        
    )
}
export default Principal