import '../estilos/listaPasos.css';

function ListaPasos({ pasos }) {
    return (
        <div className="listaPasos">
            {pasos.map((paso, index) => (
                <div
                    key={paso.id_paso ?? index}
                    className="paso"
                >
                    <div className="numero">
                        <span className="textoNumero">
                            {paso.numero}
                        </span>
                    </div>

                    <p className="descripcion">
                        {paso.descripcion}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default ListaPasos;