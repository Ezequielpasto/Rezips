import './receta.css'

function Receta(nuevaReceta){
    return(
        <article className='receta'>
            <div className='imagen'>
                <img src={nuevaReceta.imagen} alt="Pizza"/>
            </div>
            <div className='informacion'>
                <h5>{nuevaReceta.nombre}</h5>
                <p>{nuevaReceta.calificacion}</p>
                <p>{nuevaReceta.categoria}</p>
                <p>{nuevaReceta.cantIngredientes}</p>
                <p>{nuevaReceta.duracion}</p>
                <p>{nuevaReceta.porciones}</p>
                <a href="#">Ver detalles</a>
            </div> 
        </article>
    )
}
export default Receta