import './perfil.css'
import MenuLateral from '../componentes/menuLateral'
import ListaRecetas from '../componentes/listaRecetas'

function Perfil(){
    return(
        <div>
          <MenuLateral></MenuLateral>  
          <main className="miCuenta">
            <div className="datos">
                <h4>Ezequiel Pastorino</h4>
                <p>10 Recetas</p>
            </div>
            <div className='contenido'>
                <ListaRecetas></ListaRecetas>
            </div>          
          </main>
        </div>
    )
}
export default Perfil