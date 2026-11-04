function ListaPasos({pasos}){
    return(
        <div>
            {pasos.map((paso) => (
                <div key={paso.numero}>
                    <h4>Paso {paso.numero}</h4>
                    <p>{paso.descripcion}</p>
                    <br />
                </div>
            ))}
        </div>
    )
}
export default ListaPasos