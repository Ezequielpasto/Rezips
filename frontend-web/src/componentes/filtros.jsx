import './filtros.css'

function Filtros(){
    return(
        <div className="filtros">
            <select name="categorias" id="">
                <option value="toda">Todas</option>
                <option value="Postres">Postres</option>
            </select>
            <select name="calificacion" id="">
                <option value="todo">Todas</option>
                <option value="cinco">5 estrellas</option>
                <option value="cuatro">4 estrellas</option>
                <option value="tres">3 estrellas</option>
                <option value="dos">2 estrellas</option>
                <option value="uno">1 estrella</option>
            </select>
        </div>
    )
}
export default Filtros