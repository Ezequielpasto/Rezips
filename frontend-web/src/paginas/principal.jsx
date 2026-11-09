import '../estilos/principal.css'
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

    useEffect(() => {
        async function ObtenerRecetas(){
            try {
                const respuesta = await fetch('http://localhost:3000/recetas')
                const datos = await respuesta.json()

                if(!respuesta.ok){
                    alert('Error al obtener las recetas')
                    return
                }

                setRecetas(datos)

            } catch(error) {
                console.error('Error:', error)
                alert('No se pudieron cargar las recetas')
            }
        }

        ObtenerRecetas()
    }, [])

    const recetasFiltradas = recetas.filter((receta) => {
        const texto = busqueda.toLowerCase().trim()

        const coincideNombre = receta.nombre.toLowerCase().includes(texto)

        const ingredientesIngresados = texto.split(',')
            .map((ingrediente) => ingrediente.trim())
            .filter((ingrediente) => ingrediente !== '')

        const coincideIngredientes = ingredientesIngresados.every(
            (buscado) => (receta.ingredientes || []).some(
                (ingrediente) => ingrediente.nombre.toLowerCase().includes(buscado)
            )
        )

        const coincideCategoria =
            categoriaSeleccionada === "" ||
            receta.categoria === categoriaSeleccionada

        const calificaciones = receta.calificaciones || []

        const promedio = calificaciones.length > 0
            ? calificaciones.reduce(
                (total, calificacion) => total + Number(calificacion.valor), 0
            ) / calificaciones.length
            : 0

        const coincideCalificacion =
            calificacionSeleccionada === "" ||
            Math.round(promedio) === Number(calificacionSeleccionada)

        return (coincideNombre || coincideIngredientes) &&
            coincideCategoria &&
            coincideCalificacion
    })

    return(
        <div>
            <MenuSuperior
                busqueda={busqueda}
                setBusqueda={setBusqueda}
            />

            <MenuLateral />

            <main className='principal'>
                <Filtros
                    categoriaSeleccionada={categoriaSeleccionada}
                    setCategoriaSeleccionada={setCategoriaSeleccionada}
                    calificacionSeleccionada={calificacionSeleccionada}
                    setCalificacionSeleccionada={setCalificacionSeleccionada}
                />

                <ListaRecetas recetas={recetasFiltradas} />
            </main>
        </div>
    )
}

export default Principal