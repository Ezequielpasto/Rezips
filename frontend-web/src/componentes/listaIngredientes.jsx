import unidades from "../datos/unidades";
import '../estilos/listaIngredientes.css';

function ListaIngredientes({ ingredientes }) {
    return (
        <div className="listaIngredientes">
            {ingredientes.map((ingrediente, indice) => {
                const unidad = unidades.find(
                    u => u.valor === ingrediente.unidad
                );

                const textoUnidad = unidad.sinCanidad
                    ? unidad.singular
                    : `${ingrediente.cantidad} ${
                        Number(ingrediente.cantidad) === 1
                            ? unidad.singular
                            : unidad.plural
                    }`;

                return (
                    <div
                        key={ingrediente.id_ingrediente ?? indice}
                        className="ingrediente"
                    >
                        <p className="nombre">
                            {ingrediente.nombre}
                        </p>

                        <p className="cantidad">
                            {textoUnidad}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default ListaIngredientes;