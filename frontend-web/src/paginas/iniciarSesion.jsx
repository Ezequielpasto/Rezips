import './iniciarSesion.css'

function IniciarSesion(){
    return(
        <div className='inicio'>
            <h1>Bienvenido a Rezips</h1>
            <form className='formulario' action="">
                <input type="text" placeholder="Correo electrónico" />
                <input type="password" placeholder="Contraseña" />
                <button>Iniciar sesión</button>
            </form>
            <p>¿No tienes una cuanta? <a href="#">Create una cuenta</a></p>
        </div>
    )
}
export default IniciarSesion