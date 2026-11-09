import { useEffect, useState } from 'react'
import '../estilos/filtros.css'

function Filtros({categoriaSeleccionada, setCategoriaSeleccionada, calificacionSeleccionada, setCalificacionSeleccionada}){
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        async function ObtenerCategorias() {
            try{
                const respuestaCategorias = await fetch('http://localhost:3000/categorias')

                if(!respuestaCategorias.ok){
                    throw new Error('Error al obtener los datos')
                }

                const datosCategorias = await respuestaCategorias.json()
                console.log('Categorías recibidas:', datosCategorias)

                setCategorias(datosCategorias)
            } catch(error){
                console.error(error)
            }
        } 
        ObtenerCategorias() 
    }, [])

    return(
        <div className="filtros">
            <select value={categoriaSeleccionada} onChange={(event) => setCategoriaSeleccionada(event.target.value)}>
                <option value="">Todas las categorias</option>
                {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.nombre}> {categoria.nombre}</option>
                ))}
            </select>
            <select value={calificacionSeleccionada} onChange={(event) => setCalificacionSeleccionada(event.target.value)}>
                <option value="">Todas las calificaciones</option>
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
            </select>
        </div>
    )
}
export default Filtros