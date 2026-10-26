import './receta.css'
import pizza from './OIP.jpg'

function Receta(){
    return(
        <article className='receta'>
            <div className='imagen'>
                <img src={pizza} alt="Pizza"/>
            </div>
            <div className='informacion'>
                <h5>Pizza</h5>
                <p>promedio 5 estrellas</p>
                <p>Postres</p>
                <p>6 ingredientes</p>
                <p>100 minutos</p>
                <p>8 porciones</p>
                <a href="#">Ver detalles</a>
            </div> 
        </article>
    )
}
export default Receta