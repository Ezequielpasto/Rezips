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
                <form action="" className='formNuevaReceta'>
                    <div className='nombReceta'>
                        <p>Ingresa elnombre de la receta</p>
                        <input type='text' placeholder='Nombre de la receta' />
                    </div>
                    <div className='durReceta'>
                        <p>Ingresa una duración aproximada (en minutos)</p>
                        <input type='number' placeholder='Duración'/>
                    </div>
                    <div className='cantReceta'>
                        <p>Ingresa la cantidad de porciones que rinde</p>
                        <input type='number' placeholder='Cantidad de porciones' />
                    </div>
                    <div className='imgReceta'>
                        <p>Selecciona una imagen de muestra</p>
                        <input type='file' id='imagen' accept='image/*' />
                    </div>
                    <div className='agregarIngredientes'>
                        <h5>Ingredientes</h5>
                        <p>Ingresa el nombre, la cantidad y la unidad por cada ingrediente</p>
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
                        <button type='button' onClick={() => setIngredientes([...ingredientes, ''])}>+ Agregar ingrediente</button>
                    </div>
                    <div className="agregarPasos">
                        <h5>Pasos</h5>
                        <p>Ingresa la descripcion de cada paso</p>
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
                                    setPasos(nuevosPasos);
                                }}
                            />
                            </div>
                        ))}
                        <button type='button' onClick={() => setPasos([...pasos, ''])}>+ Agregar paso</button>
                    </div>
                    <button className='btnCrearReceta'>Crear y publicar receta</button>
                </form>
            </section>        
        </div>
    )
}
export default CrearReceta