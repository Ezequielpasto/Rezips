import './listaRecetas.css'
import Receta from './receta'

function ListaRecetas({recetas = []}){
    return(
        <section className='lista'>
            {recetas.map((receta) => (
                <Receta 
                    key={receta.id}
                    id={receta.id}
                    imagen={receta.imagen}
                    nombre={receta.nombre}
                    categoria={receta.categoria}
                    cantIngredientes={receta.ingredientes.length}
                    duracion={receta.duracion}
                    porciones={receta.cantidadPorciones}
                    meGusta={receta.meGusta || []}
                    guardados={receta.guardados || []}
                    calificaciones={receta.calificaciones || []}
                />
            ))}
        </section>
    )
}
export default ListaRecetas