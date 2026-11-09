import '../estilos/listaRecetas.css'
import Receta from './receta'

function ListaRecetas({ recetas = [] }){
    return(
        <section className='lista'>
            {recetas.map((receta) => (
                <Receta
                    key={receta.id_receta}
                    id={receta.id_receta}
                    imagen={receta.imagen}
                    nombre={receta.nombre}
                    categoria={receta.categoria}
                    creador={receta.creador}
                    cantIngredientes={(receta.ingredientes || []).length}
                    duracion={receta.duracion}
                    porciones={receta.cantidad_porciones}
                    meGusta={receta.meGusta || []}
                    guardados={receta.guardados || []}
                    calificaciones={receta.calificaciones || []}
                />
            ))}
        </section>
    )
}

export default ListaRecetas