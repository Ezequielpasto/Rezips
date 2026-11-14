import '../estilos/crearReceta.css'
import MenuLateral from '../componentes/menuLateral'
import Notificacion from '../componentes/notificacion'
import { useState, useEffect, useCallback } from 'react'
import unidades from '../datos/unidades'
import { useNavigate } from 'react-router-dom'
import { Trash, Plus } from 'lucide-react'

function CrearReceta() {
    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [duracion, setDuracion] = useState("")
    const [cantidadPorciones, setCantidadPorciones] = useState("")
    const [imagen, setImagen] = useState("")
    const [vistaPrevia, setVistaPrevia] = useState("")
    const [ingredientes, setIngredientes] = useState([{ nombre: '', cantidad: '', unidad: '' }])
    const [pasos, setPasos] = useState([{ numero: 1, descripcion: '' }])

    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const [categorias, setCategorias] = useState([])
    const [notificacion, setNotificacion] = useState(null)

    const navegar = useNavigate()

    const MostrarNotificacion = (mensaje, tipo = 'exito') => {
        setNotificacion({ mensaje, tipo })
    }

    const CerrarNotificacion = useCallback(() => {
        setNotificacion(null)
    }, [])

    useEffect(() => {
        async function ObtenerCategorias() {
            try {
                const respuesta = await fetch('http://localhost:3000/categorias')

                if (!respuesta.ok) {
                    throw new Error('No se pudieron obtener las categorías')
                }

                const datos = await respuesta.json()
                setCategorias(datos)
            } catch (error) {
                console.error('Error al obtener las categorías:', error)
                MostrarNotificacion('No se pudieron cargar las categorías', 'error')
            }
        }

        ObtenerCategorias()
    }, [])

    function EliminarIngrediente(indice) {
        const nuevosIngredientes = ingredientes.filter((_, i) => i !== indice)
        setIngredientes(nuevosIngredientes)
    }

    function EliminarPaso(indice) {
        const nuevosPasos = pasos
            .filter((_, i) => i !== indice)
            .map((paso, i) => ({ ...paso, numero: i + 1 }))

        setPasos(nuevosPasos)
    }

    function ValidarReceta() {
        if (nombre.trim() === '') {
            MostrarNotificacion("Debes ingresar un nombre para la receta", 'advertencia')
            return false
        }

        if (categoria === '') {
            MostrarNotificacion("Debes seleccionar una categoría", 'advertencia')
            return false
        }

        if (Number(duracion) <= 0 || duracion === '') {
            MostrarNotificacion("La duracion debe ser mayor a cero", 'advertencia')
            return false
        }

        if (Number(cantidadPorciones) <= 0 || cantidadPorciones === '') {
            MostrarNotificacion("La cantidad de porciones debe ser mayor a cero", 'advertencia')
            return false
        }

        for (const ingrediente of ingredientes) {
            const unidad = unidades.find(
                u => u.valor == ingrediente.unidad
            )

            if (!unidad || ingrediente.nombre.trim() === '' || (!unidad.sinCantidad && ingrediente.cantidad.trim() === '') || ingrediente.unidad === '') {
                MostrarNotificacion("Debes completar todos los datos de los ingredientes", 'advertencia')
                return false
            }

            if (!unidad.sinCantidad && Number(ingrediente.cantidad) <= 0) {
                MostrarNotificacion("La cantidad de los ingredientes debe ser mayor a 0", 'advertencia')
                return false
            }
        }

        for (const paso of pasos) {
            if (paso.descripcion.trim() === '') {
                MostrarNotificacion("Debes completar la descripción de todos los pasos", 'advertencia')
                return false
            }
        }

        return true
    }

    function ConvertirImagen(archivo) {
        return new Promise((resolve, reject) => {
            const lector = new FileReader()

            lector.onload = () => resolve(lector.result)
            lector.onerror = () => reject(lector.error)

            lector.readAsDataURL(archivo)
        })
    }

    async function SeleccionarImagen(event) {
        const archivo = event.target.files[0]

        if (!archivo) return

        if (!archivo.type.startsWith('image/')) {
            MostrarNotificacion('Debes seleccionar una imagen válida', 'advertencia')
            event.target.value = ''
            return
        }

        setImagen(archivo)

        try {
            const imagenBase64 = await ConvertirImagen(archivo)
            setVistaPrevia(imagenBase64)
        } catch (error) {
            console.error(error)
            MostrarNotificacion('No se pudo cargar la imagen', 'error')
        }
    }

    async function CrearReceta(event) {
        event.preventDefault()

        if (!ValidarReceta()) {
            return
        }

        try {
            const imagenBase64 = imagen ? await ConvertirImagen(imagen) : null

            // Crear receta
            const respuesta = await fetch('http://localhost:3000/recetas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    duracion: Number(duracion),
                    cantidad_porciones: Number(cantidadPorciones),
                    imagen: imagenBase64,
                    id_usuario: usuario.id_usuario,
                    id_categoria: Number(categoria)
                })
            })

            const datos = await respuesta.json()

            if (!respuesta.ok) {
                MostrarNotificacion(datos.mensaje || 'Error al crear la receta', 'error')
                return
            }

            const idReceta = datos.receta.id_receta

            // Guardar ingredientes
            for (const ingrediente of ingredientes) {
                const unidadSeleccionada = unidades.find(u => u.valor == ingrediente.unidad)

                const respuestaIngrediente = await fetch('http://localhost:3000/ingredientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_receta: idReceta,
                        nombre: ingrediente.nombre,
                        cantidad: unidadSeleccionada.sinCantidad ? 1 : Number(ingrediente.cantidad),
                        unidad: ingrediente.unidad
                    })
                })

                if (!respuestaIngrediente.ok) {
                    throw new Error('Error al guardar los ingredientes')
                }
            }

            // Guardar pasos
            for (const paso of pasos) {
                const respuestaPaso = await fetch(`http://localhost:3000/recetas/${idReceta}/pasos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        numero: paso.numero,
                        descripcion: paso.descripcion
                    })
                })

                if (!respuestaPaso.ok) {
                    throw new Error('Error al guardar los pasos')
                }
            }

            MostrarNotificacion('Receta creada correctamente')

            setTimeout(() => {
                navegar('/principal')
            }, 1500)

        } catch (error) {
            console.error('Error:', error)
            MostrarNotificacion(error.message || 'Ocurrió un error al crear la receta', 'error')
        }
    }

    return (
        <div>
            <Notificacion
                mensaje={notificacion?.mensaje}
                tipo={notificacion?.tipo}
                onCerrar={CerrarNotificacion}
            />

            <MenuLateral />

            <section className='nuevaReceta'>
                <h1>Crea una nueva receta</h1>

                <form onSubmit={CrearReceta} className='formNuevaReceta'>
                    <div className='nombReceta'>
                        <p>Ingresa el nombre de la receta</p>
                        <input
                            type='text'
                            placeholder='Nombre de la receta'
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)}
                        />
                    </div>

                    <div className="catReceta">
                        <p>Seleccione una categoría</p>
                        <select
                            value={categoria}
                            onChange={(event) => setCategoria(event.target.value)}
                        >
                            <option value="">Seleccionar categoria</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='durReceta'>
                        <p>Ingresa una duración aproximada (en minutos)</p>
                        <input
                            type='number'
                            placeholder='Duración'
                            value={duracion}
                            onChange={(event) => setDuracion(event.target.value)}
                        />
                    </div>

                    <div className='cantReceta'>
                        <p>Ingresa la cantidad de porciones que rinde</p>
                        <input
                            type='number'
                            placeholder='Cantidad de porciones'
                            value={cantidadPorciones}
                            onChange={(event) => setCantidadPorciones(event.target.value)}
                        />
                    </div>

                    <div className='imgReceta'>
                        <p>Selecciona una imagen de muestra</p>

                        <div className="vistaPreviaReceta">
                            {vistaPrevia ? (
                                <img src={vistaPrevia} alt="Vista previa de la receta" />
                            ) : (
                                <div className="imagenRecetaVacia">
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        <input
                            type='file'
                            id='imagen'
                            accept='image/*'
                            onChange={SeleccionarImagen}
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
                                            ...ingrediente,
                                            nombre: event.target.value
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
                                            ...ingrediente,
                                            cantidad: event.target.value
                                        }
                                        setIngredientes(nuevosIngredientes)
                                    }}
                                />

                                <select
                                    value={ingrediente.unidad}
                                    onChange={(event) => {
                                        const nuevosIngredientes = [...ingredientes]
                                        nuevosIngredientes[indice] = {
                                            ...ingrediente,
                                            unidad: event.target.value
                                        }
                                        setIngredientes(nuevosIngredientes)
                                    }}
                                >
                                    <option value="">Seleccionar unidad</option>
                                    {unidades.map((unidad) => (
                                        <option key={unidad.valor} value={unidad.valor}>
                                            {unidad.singular} / {unidad.plural}
                                        </option>
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

                        <button
                            type='button'
                            onClick={() => setIngredientes([...ingredientes, { nombre: '', cantidad: '', unidad: '' }])}
                        >
                            + Agregar ingrediente
                        </button>
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
                                            nuevosPasos[indice] = {
                                                ...paso,
                                                descripcion: event.target.value
                                            }
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

                        <button
                            type='button'
                            onClick={() => setPasos([...pasos, { numero: pasos.length + 1, descripcion: '' }])}
                        >
                            + Agregar paso
                        </button>
                    </div>

                    <button type='submit' className='btnCrearReceta'>
                        <Plus /> Crear y publicar receta
                    </button>
                </form>
            </section>
        </div>
    )
}

export default CrearReceta
