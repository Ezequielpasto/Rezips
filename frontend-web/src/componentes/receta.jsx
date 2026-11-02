import './receta.css'
import { Link } from 'react-router-dom'

function Receta({id, imagen, nombre, categoria, cantIngredientes, duracion, porciones}){
    return(
        <article className='receta'>
            <div className='imagen'>
                <img src={imagen} alt="Pizza"/>
            </div>
            <div className='informacion'>
                <h5>{nombre}</h5>
                <p>{categoria}</p>
                <p>{cantIngredientes} ingredientes</p>
                <p>{duracion} minutos</p>
                <p>{porciones} porciones</p>
                <Link to={`/receta/${id}`}>Ver detalles</Link>
            </div> 
        </article>
    )
}
export default Receta