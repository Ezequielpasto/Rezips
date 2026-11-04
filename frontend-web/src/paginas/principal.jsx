import './principal.css'
import MenuSuperior from "../componentes/menuSuperior"
import MenuLateral from "../componentes/menuLateral"
import Filtros from '../componentes/filtros'
import ListaRecetas from '../componentes/listaRecetas'
import { useEffect, useState } from 'react'

function Principal(){
    const [recetas, setRecetas] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [calificacionSeleccionada, setCalificacionSeleccionada] = useState("")

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

    useEffect(() =>{
        const recetasExistentes = JSON.parse(localStorage.getItem('recetas')) || []
        setRecetas(recetasExistentes)
    }, [])
    


    return(
        <div>
            <MenuSuperior busqueda={busqueda} setBusqueda={setBusqueda}></MenuSuperior>
            <MenuLateral ></MenuLateral>
            <main className='principal'>
                <Filtros categoriaSeleccionada={categoriaSeleccionada} setCategoriaSeleccionada={setCategoriaSeleccionada} 
                calificacionSeleccionada={calificacionSeleccionada} setCalificacionSeleccionada={setCalificacionSeleccionada}></Filtros>
                <ListaRecetas recetas={recetasFiltradas}></ListaRecetas>
            </main>
        </div>        
    )
}
export default Principal