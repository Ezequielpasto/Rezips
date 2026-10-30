import './detallesReceta.css'
import MenuLateral from '../componentes/menuLateral'
import pizza from '../datos/OIP.jpg'
import ListaIngredientes from '../componentes/listaIngredientes'
import ListaPasos from '../componentes/listaPasos'
import { useState } from 'react'

function DetallesReceta(){
    const[comentDescripcion, setComentDescripcion] = useState("")
    const[comentarios, setComentarios] = useState([])

    function NuevoComentario(event){
        event.preventDefault()

        setComentarios([...comentarios, comentDescripcion])
        setComentDescripcion("")
    }

    return(
        <div>
            <MenuLateral></MenuLateral>
            <div className='detalles'>
                <section className='infoReceta'>
                    <div className='imgSup'>
                        <img src={pizza} alt="pizza" />
                    </div>
                    <div className='descripcion'>
                        <div className='tituloEstrellas'>
                            <p className='titulo'>Pizza</p>
                            <p>5 estrellas</p>
                        </div>
                        <div className='restoInfo'>
                            <p>categoría</p>
                            <p>Duración</p>
                            <p>Cant porciones</p>
                            <p>me gusta</p>
                            <p>guardar</p>
                        </div>
                    </div>
                    <div className='susIngredientes'>
                        <h3>Ingredientes</h3>
                        <ListaIngredientes></ListaIngredientes>
                    </div>
                    <div className="susPasos">
                        <h3>Pasos</h3>
                        <ListaPasos></ListaPasos>
                    </div>
                </section>
                <section className='comentarios'>
                    <h4>Comentarios</h4>
                    <div className='crearComentario'>
                        <textarea placeholder='Escribe un comentario' value={comentDescripcion} onChange={(event) => setComentDescripcion(event.target.value)}/>
                        <button onClick={NuevoComentario}>Enviar</button>
                    </div>
                    <div className='todosLosComentarios'>
                        {comentarios.map((comentario, indice) => (
                            <div key={indice}>
                                <p>{comentario}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
export default DetallesReceta