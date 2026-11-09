import MenuSuperior from "../componentes/menuSuperior"
import MenuLateral from "../componentes/menuLateral"
import Filtros from '../componentes/filtros'
import ListaRecetas from '../componentes/listaRecetas'
import { useState, useEffect } from "react"

function MeGusta(){
    const [recetas, setRecetas] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [calificacionSeleccionada, setCalificacionSeleccionada] = useState("")

    useEffect(() => {
    async function ObtenerDatos() {
        const usuario = JSON.parse(localStorage.getItem('usuario'))

        if (!usuario) return
        try {
            const respuesta = await fetch(`http://localhost:3000/recetas/usuario/${usuario.id_usuario}/me-gusta`)
            if (!respuesta.ok) {
                throw new Error('Error al obtener los me gusta')
            }

            const datos = await respuesta.json()
            setRecetas(datos)

        } catch (error) {
            console.error(error)
        }
    }

    ObtenerDatos()
}, [])

    const recetasFiltradas = recetas.filter((receta) => {
        const texto = busqueda.toLowerCase().trim()

        // Buscar por nombre
        const coincideNombre = receta.nombre.toLowerCase().includes(texto)

        // Separar los ingredientes ingresados por coma
        const ingredientesIngresados = texto.split(',')
        .map((ingrediente) => ingrediente.trim())
        .filter((ingrediente) => ingrediente !== '')

        // Comprobar que la receta tenga todos los ingredientes buscados
        const coincideIngredientes = ingredientesIngresados.every(
            (buscado) => receta.ingredientes.some(
            (ingredientes) => ingredientes.nombre.toLowerCase().includes(buscado))
        )

        const coincideCategoria = categoriaSeleccionada === "" || receta.categoria === categoriaSeleccionada
        
        const promedio = (receta.calificaciones || []).length > 0
            ? receta.calificaciones.reduce(
                (total, calificacion) => total + calificacion.valor, 0
            ) / receta.calificaciones.length
            : 0
        const coincideCalificacion = calificacionSeleccionada === "" || Math.round(promedio) === Number(calificacionSeleccionada)
            
        return (coincideNombre || coincideIngredientes) && coincideCategoria && coincideCalificacion
    })

    return(
        <section>
            <MenuSuperior></MenuSuperior>
            <MenuLateral ></MenuLateral>
            <main className='principal'>
                <Filtros categoriaSeleccionada={categoriaSeleccionada} setCategoriaSeleccionada={setCategoriaSeleccionada} 
                calificacionSeleccionada={calificacionSeleccionada} setCalificacionSeleccionada={setCalificacionSeleccionada}></Filtros>
                <ListaRecetas recetas={recetasFiltradas}></ListaRecetas>
            </main>
        </section> 
    )
}
export default MeGusta