import '../estilos/crearReceta.css'
import MenuLateral from '../componentes/menuLateral'
import Notificacion from '../componentes/notificacion'
import { useState, useEffect, useCallback } from 'react'
import unidades from '../datos/unidades'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash, Plus } from 'lucide-react'

function EditarReceta() {
    const { id } = useParams()
    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
    const [duracion, setDuracion] = useState("")
    const [cantidadPorciones, setCantidadPorciones] = useState("")
    const [imagen, setImagen] = useState("")
    const [archivoImagen, setArchivoImagen] = useState(null)

    const [ingredientes, setIngredientes] = useState([])
    const [pasos, setPasos] = useState([])
    const [notificacion, setNotificacion] = useState(null)

    const navegar = useNavigate()

    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    function MostrarNotificacion(mensaje, tipo = 'exito') {
        setNotificacion({ mensaje, tipo })
    }

    useEffect(() => {
        async function ObtenerReceta() {
            try {
                const respuestaReceta = await fetch(`http://localhost:3000/recetas/${id}`)
                const respuestaCategorias = await fetch('http://localhost:3000/categorias')
                const respuestaIngredientes = await fetch(`http://localhost:3000/recetas/${id}/ingredientes`)
                const respuestaPasos = await fetch(`http://localhost:3000/recetas/${id}/pasos`)

                if (!respuestaReceta.ok || !respuestaCategorias.ok || !respuestaIngredientes.ok || !respuestaPasos.ok) {
                    throw new Error('Error al obtener los datos')
                }

                const receta = await respuestaReceta.json()
                const datosCategorias = await respuestaCategorias.json()
                const datosIngredientes = await respuestaIngredientes.json()
                const datosPasos = await respuestaPasos.json()

                setCategorias(datosCategorias)

                setNombre(receta.nombre)
                setCategoria(String(receta.id_categoria))
                setDuracion(receta.duracion)
                setCantidadPorciones(receta.cantidad_porciones)
                setImagen(receta.imagen || "")

                setIngredientes(datosIngredientes.map(ingrediente => ({
                    nombre: ingrediente.nombre,
                    cantidad: String(ingrediente.cantidad),
                    unidad: ingrediente.unidad || ""
                })))

                setPasos(datosPasos)

            } catch (error) {
                console.error(error)
                MostrarNotificacion('No se pudo cargar la receta', 'error')
            }
        }

        ObtenerReceta()
    }, [id])

    function ConvertirImagen(archivo) {
        return new Promise((resolve, reject) => {
            const lector = new FileReader()

            lector.onload = () => resolve(lector.result)
            lector.onerror = () => reject(lector.error)

            lector.readAsDataURL(archivo)
        })
    }

    async function GuardarCambios(event) {
        event.preventDefault()

        const usuario = JSON.parse(localStorage.getItem('usuario'))

        if (!usuario) {
            MostrarNotificacion('Debes iniciar sesión', 'advertencia')
            return
        }

        // Validaciones
        if (nombre.trim() === '') {
            MostrarNotificacion('Debes ingresar un nombre para la receta', 'advertencia')
            return
        }

        if (categoria === '') {
            MostrarNotificacion('Debes seleccionar una categoría', 'advertencia')
            return
        }

        if (Number(duracion) <= 0 || duracion === '') {
            MostrarNotificacion('La duración debe ser mayor a cero', 'advertencia')
            return
        }

        if (Number(cantidadPorciones) <= 0 || cantidadPorciones === '') {
            MostrarNotificacion('La cantidad de porciones debe ser mayor a cero', 'advertencia')
            return
        }

        for (const ingrediente of ingredientes) {
            const unidad = unidades.find(
                u => u.valor === ingrediente.unidad
            )

            if (
                ingrediente.nombre.trim() === '' || !unidad || (!unidad.sinCantidad && ingrediente.cantidad.trim() === '')
            ) {
                MostrarNotificacion('Debes completar todos los datos de los ingredientes', 'advertencia')
                return
            }

            if (!unidad.sinCantidad && Number(ingrediente.cantidad) <= 0) {
                MostrarNotificacion('La cantidad de los ingredientes debe ser mayor a 0', 'advertencia')
                return
            }
        }

        for (const paso of pasos) {
            if (paso.descripcion.trim() === '') {
                MostrarNotificacion('Debes completar la descripción de todos los pasos', 'advertencia')
                return
            }
        }

        // Determinar qué imagen utilizar
        let imagenActualizada = imagen

        if (archivoImagen) {
            imagenActualizada = await ConvertirImagen(archivoImagen)
        }

        try {
            const ingredientesActualizados = ingredientes.map(ingrediente => {
                const unidad = unidades.find(
                    u => u.valor === ingrediente.unidad
                )

                return {
                    nombre: ingrediente.nombre.trim(),
                    cantidad: unidad.sinCantidad ? 1 : Number(ingrediente.cantidad),
                    unidad: ingrediente.unidad
                }
            })

            const pasosActualizados = pasos.map((paso, indice) => ({
                numero: indice + 1,
                descripcion: paso.descripcion.trim()
            }))

            const respuesta = await fetch(`http://localhost:3000/recetas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    duracion: Number(duracion),
                    cantidad_porciones: Number(cantidadPorciones),
                    imagen: imagenActualizada,
                    id_usuario: usuario.id_usuario,
                    id_categoria: Number(categoria),
                    ingredientes: ingredientesActualizados,
                    pasos: pasosActualizados
                })
            })

            const datos = await respuesta.json()

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'Error al modificar la receta')
            }

            MostrarNotificacion('Receta actualizada correctamente', 'exito')

            setTimeout(() => {
                navegar(`/receta/${id}`)
            }, 1500)

        } catch (error) {
            console.error(error)
            MostrarNotificacion(error.message || 'Error al modificar la receta', 'error')
        }
    }

    function EliminarIngrediente(indice) {
        const nuevosIngredientes = ingredientes.filter((_, i) => i !== indice)
        setIngredientes(nuevosIngredientes)
    }

    function EliminarPaso(indice) {
        const nuevosPasos = pasos.filter((_, i) => i !== indice).map((paso, i) => ({ ...paso, numero: i + 1 }))
        setPasos(nuevosPasos)
    }

    return (
        <div>
            <MenuLateral />

            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            <section className='nuevaReceta'>
                <h1>Editar receta</h1>
                <form onSubmit={GuardarCambios} className='formNuevaReceta'>
                    <div className='nombReceta'>
                        <p>Ingresa el nombre de la receta</p>
                        <input type='text' placeholder='Nombre de la receta' value={nombre} onChange={(event) => setNombre(event.target.value)} />
                    </div>

                    <div className="catReceta">
                        <p>Seleccione una categoría</p>
                        <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
                            <option value="">Seleccionar categoria</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id_categoria} value={categoria.id_categoria}> {categoria.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className='durReceta'>
                        <p>Ingresa una duración aproximada (en minutos)</p>
                        <input type='number' placeholder='Duración' value={duracion} onChange={(event) => setDuracion(event.target.value)} />
                    </div>

                    <div className='cantReceta'>
                        <p>Ingresa la cantidad de porciones que rinde</p>
                        <input type='number' placeholder='Cantidad de porciones' value={cantidadPorciones} onChange={(event) => setCantidadPorciones(event.target.value)} />
                    </div>

                    <div className='imgReceta'>
                        <p>Selecciona una nueva imagen (opcional)</p>
                        <img src={imagen} alt={nombre} width="150" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => setArchivoImagen(event.target.files[0])}
                        />
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
                                        const nuevosIngredientes = [...ingredientes]
                                        nuevosIngredientes[indice] = {
                                            ...ingrediente, nombre: event.target.value
                                        }
                                        setIngredientes(nuevosIngredientes)
                                    }}
                                />

                                <input
                                    type='number'
                                    step="any"
                                    placeholder="Cantidad"
                                    value={ingrediente.cantidad}
                                    onChange={(event) => {
                                        const nuevosIngredientes = [...ingredientes]
                                        nuevosIngredientes[indice] = {
                                            ...ingrediente, cantidad: event.target.value
                                        }
                                        setIngredientes(nuevosIngredientes)
                                    }}
                                />

                                <select
                                    value={ingrediente.unidad}
                                    onChange={(event) => {
                                        const nuevosIngredientes = [...ingredientes]
                                        nuevosIngredientes[indice] = {
                                            ...ingrediente, unidad: event.target.value
                                        }
                                        setIngredientes(nuevosIngredientes)
                                    }}>
                                    <option value="">Seleccionar unidad</option>
                                    {unidades.map((unidad) => (
                                        <option key={unidad.valor} value={unidad.valor}>{unidad.singular} / {unidad.plural}</option>
                                    ))}
                                </select>

                                <button
                                    type='button'
                                    onClick={() => EliminarIngrediente(indice)}
                                    disabled={ingredientes.length === 1}
                                >
                                    <Trash/>
                                </button>
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
                                <div className="interaccion">
                                    <textarea
                                        type='text'
                                        placeholder="Nuevo paso"
                                        value={paso.descripcion}
                                        onChange={(event) => {
                                            const nuevosPasos = [...pasos]
                                            nuevosPasos[indice] = { ...paso, descripcion: event.target.value }
                                            setPasos(nuevosPasos)
                                        }}
                                    />

                                    <button
                                        type='button'
                                        onClick={() => EliminarPaso(indice)}
                                        disabled={pasos.length === 1}
                                    >
                                        <Trash color='red'/>
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button type='button' onClick={() => setPasos([...pasos, { numero: pasos.length + 1, descripcion: '' }])}>+ Agregar paso</button>
                    </div>

                    <button type='submit' className='btnCrearReceta'><Plus/>Guardar cambios</button>
                </form>
            </section>
        </div>
    )
}

export default EditarReceta