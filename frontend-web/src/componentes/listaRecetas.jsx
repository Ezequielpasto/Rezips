import './listaRecetas.css'
import Receta from './receta'

function ListaRecetas(){
    return(
        <section className='lista'>
            <Receta nombre="Pizza" calificacion="5" categoria="Panaderia" cantIngredientes="6" duracion="100" porciones="8"></Receta>
            <Receta nombre="Panqueques" calificacion="5" categoria="Panaderia" cantIngredientes="6" duracion="15" porciones="8"></Receta>
        </section>
    )
}
export default ListaRecetas