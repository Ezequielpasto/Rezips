import './crearReceta.css'
import MenuLateral from '../componentes/menuLateral'
import { useState } from 'react'

function CrearReceta(){
    const [ingredientes, setIngredientes] = useState([{nombre: '', cantidad: '', unidad: ''}])
    const [pasos, setPasos] = useState([''])
    return(
        <div>
            <MenuLateral></MenuLateral>
            <section className='nuevaReceta'>
                <h1>Crea una nueva receta</h1>
                <form action="">
                    <input type='text' placeholder='Nombre de la receta' />
                    <input type='number' placeholder='Duración'/>
                    <input type='number' placeholder='Cantidad de porciones' />
                    <input type='file' id='imagen' accept='image/*' />

                    <div className='agregarIngredientes'>
                        <p>Ingredientes</p>
                        {ingredientes.map((ingrediente, indice) => (
                        <div className="ingrediente" key={indice}>
                            <input
                                type='text'
                                placeholder="Ingrediente"
                                value={ingrediente.nombre}
                                onChange={(event) => {
                                    const nuevosIngredientes = [...ingredientes];
                                    nuevosIngredientes[indice] = {
                                        ...ingrediente, nombre: event.target.value
                                    };
                                    setIngredientes(nuevosIngredientes)
                                }}
                            />
                            <input
                                type='text'
                                placeholder="Cantidad"
                                value={ingrediente.cantidad}
                                onChange={(event) => {
                                    const nuevosIngredientes = [...ingredientes];
                                    nuevosIngredientes[indice] = {
                                        ...ingrediente, cantidad: event.target.value
                                    };
                                    setIngredientes(nuevosIngredientes)
                                }}
                            />
                            <select
                                value={ingrediente.unidad}
                                onChange={(event) => {
                                    const nuevosIngredientes = [...ingredientes];
                                    nuevosIngredientes[indice] = {
                                        ...ingrediente, unidad: event.target.value
                                    };
                                    setIngredientes(nuevosIngredientes)
                                }}>
                                    <option value="gramos">gr</option>
                                    <option value="kiloGramos">kg</option>
                            </select>
                        </div> 
                        ))}
                        <button type='button' onClick={() => setIngredientes([...ingredientes, ''])}>+</button>
                    </div>
                    <div className="agregarPasos">
                        <p>Pasos</p>
                        {pasos.map((paso, indice) => (
                            <div className='paso' key={indice}>
                                <p>Paso {indice + 1}</p>
                                <textarea
                                type='text'
                                placeholder="Nuevo paso"
                                value={paso}
                                onChange={(event) => {
                                    const nuevosPasos = [...pasos];
                                    nuevosPasos[indice] = event.target.value;
                                    setpasos(nuevosPasos);
                                }}
                            />
                            </div>
                        ))}
                        <button type='button' onClick={() => setPasos([...pasos, ''])}>+</button>
                    </div>
                </form>
            </section>        
        </div>
    )
}
export default CrearReceta