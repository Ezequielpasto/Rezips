import unidades from "../datos/unidades"

function ListaIngredientes({ingredientes}){
    return(
        <div>
            {ingredientes.map((ingrediente, indice) => {
                const unidad = unidades.find(
                    u => u.valor === ingrediente.unidad
                );
                
                const textoUnidad = unidad.sinCanidad ? unidad.singular : `${ingrediente.cantidad} 
                    ${Number(ingrediente.cantidad) === 1 ? unidad.singular : unidad.plural
                    }`;
            return(
                <div key={indice}>
                    <p>{ingrediente.nombre} - {textoUnidad}</p>
                </div>
                );
            })}
        </div>
    )
}
export default ListaIngredientes