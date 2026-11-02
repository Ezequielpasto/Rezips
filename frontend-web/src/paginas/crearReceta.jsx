import './crearReceta.css'
import MenuLateral from '../componentes/menuLateral'
import { useState } from 'react'

function CrearReceta(){
    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [duracion, setDuracion] = useState("")
    const [cantidadPorciones, setCantidadPorciones] = useState("")
    const [imagen, setImagen] = useState("")

    const [ingredientes, setIngredientes] = useState([{nombre: '', cantidad: '', unidad: ''}])
    const [pasos, setPasos] = useState([{numero: 1, descripcion: ''}])

    function ValidarReceta(){
        if(nombre.trim() === ''){
            alert("Debes ingresar un nombre para la receta")
            return false
        }

        if(categoria === ''){
            alert("Debes seleccionar una categoría")
            return false
        }
        
        if(Number(duracion) <= 0 || duracion === ''){
            alert("La duracion debe ser mayor a cero")
            return false
        }

        if(Number(cantidadPorciones) <= 0 || cantidadPorciones === ''){
            alert("La cantidad de porciones debe ser mayor a cero")
            return false
        }

        for(const ingrediente of ingredientes){
            if(ingrediente.nombre.trim() === '' || ingrediente.cantidad.trim() === '' || ingrediente.unidad === '' || ingrediente.unidad === 'seleccionarUnidad'){
                alert("Debes completar todos los datos de los ingredientes")
                return false
            }
        }

        for(const paso of pasos){
            if(paso.descripcion.trim() === ''){
                alert("Debes completar la descripción de todos los pasos")
                return false
            }
        }

        return true
    }
    
    async function CrearReceta(event){
        event.preventDefault()

        if(!ValidarReceta()){
            return
        }
        
        const imagenBase64 = await ConvertirImagen(imagen)

        // Convierte un archivo de imagen a formato Base64 para poder almacenarlo en localStorage.
        function ConvertirImagen(archivo){
            return new Promise((resolve, reject) => {
                // Crea un lector para leer el archivo seleccionado.
                const lector = new FileReader();

                // Cuando termina de leer el archivo, devuelve el resultado.
                lector.onload = () => resolve(lector.result);

                // Si ocurre un error durante la lectura, devuelve el error.
                lector.onerror = () => reject(lector.error);

                // Lee el archivo y lo convierte a una URL de datos.
                lector.readAsDataURL(archivo);
            }); 
        }

        const nuevaReceta = {
            id: Date.now(),
            nombre: nombre,
            categoria: categoria,
            duracion: Number(duracion),
            cantidadPorciones: Number(cantidadPorciones),
            imagen: imagenBase64,
            ingredientes: ingredientes,
            pasos: pasos
        }

        const recetasCreadas = JSON.parse(localStorage.getItem('recetas')) || [];
        recetasCreadas.push(nuevaReceta);

        localStorage.setItem('recetas', JSON.stringify(recetasCreadas));
        alert("Receta creada correctamente")
    }

    return(
        <div>
            <MenuLateral></MenuLateral>
            <section className='nuevaReceta'>
                <h1>Crea una nueva receta</h1>
                <form onSubmit={CrearReceta} className='formNuevaReceta'>
                    <div className='nombReceta'>
                        <p>Ingresa elnombre de la receta</p>
                        <input type='text' placeholder='Nombre de la receta' value={nombre} onChange={(event) => setNombre(event.target.value)}/>
                    </div>
                    <div className="catReceta">
                        <p>Seleccione una categoría</p>
                        <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
                            <option value="">Seleccionar categoria</option>
                            <option value="">Postres</option>
                        </select>
                    </div>
                    <div className='durReceta'>
                        <p>Ingresa una duración aproximada (en minutos)</p>
                        <input type='number' placeholder='Duración' value={duracion} onChange={(event) => setDuracion(event.target.value)}/>
                    </div>
                    <div className='cantReceta'>
                        <p>Ingresa la cantidad de porciones que rinde</p>
                        <input type='number' placeholder='Cantidad de porciones' value={cantidadPorciones} onChange={(event) => setCantidadPorciones(event.target.value)}/>
                    </div>
                    <div className='imgReceta'>
                        <p>Selecciona una imagen de muestra</p>
                        <input type='file' id='imagen' accept='image/*' onChange={(event) => setImagen(event.target.files[0])}/>
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
                                    <option value="">Seleccionar unidad</option>
                                    <option value="gramos">gr</option>
                                    <option value="kiloGramos">kg</option>
                            </select>
                        </div> 
                        ))}
                        <button type='button' onClick={() => setIngredientes([...ingredientes, { nombre: '', cantidad: '', unidad: '' }])}>+ Agregar ingrediente</button>
                    </div>
                    <div className="agregarPasos">
                        <h5>Pasos</h5>
                        <p>Ingresa la descripcion de cada paso</p>
                        {pasos.map((paso, indice) => (
                            <div className='paso' key={indice}>
                                <p>Paso {paso.numero}</p>
                                <textarea
                                type='text'
                                placeholder="Nuevo paso"
                                value={paso.descripcion}
                                onChange={(event) => {
                                    const nuevosPasos = [...pasos];
                                    nuevosPasos[indice] = {...paso, descripcion: event.target.value};
                                    setPasos(nuevosPasos);
                                }}
                            />
                            </div>
                        ))}
                        <button type='button' onClick={() => setPasos([...pasos, {numero: pasos.length + 1, descripcion: ''}])}>+ Agregar paso</button>
                    </div>
                    <button type='submit' className='btnCrearReceta'>Crear y publicar receta</button>
                </form>
            </section>        
        </div>
    )
}
export default CrearReceta
