import './filtros.css'
import categorias from '../datos/categorias'

function Filtros({categoriaSeleccionada, setCategoriaSeleccionada, calificacionSeleccionada, setCalificacionSeleccionada}){
    return(
        <div className="filtros">
            <select value={categoriaSeleccionada} onChange={(event) => setCategoriaSeleccionada(event.target.value)}>
                <option value="">Todas las categorias</option>
                {categorias.map((categoria) => (
                <option key={categoria.valor} value={categoria.valor}> {categoria.opcion}</option>
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