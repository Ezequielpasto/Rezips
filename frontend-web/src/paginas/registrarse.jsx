import './registrarse.css'

function Registrarse(){
    return(
        <div className='registro'>
            <h1>Create una cuenta de Rezips</h1>
            <form action="" className='formRegistro'>
                <div className="nombreApellido">
                    <p>Ingresa tu nombre y tu apellido</p>
                    <div>
                    <input type="text" placeholder="Nombre" />
                    <input type="text" placeholder="Apellido" />
                    </div>
                </div>
                <div className="cumpleaños">
                    <p>Ingresa tu fecha de nacimiento</p>
                    <input type="date"/>
                </div>
                <div className="correo">
                    <p>Ingresa tu correo electrónico</p>
                    <input type="text" placeholder="Correo electrónico" />
                </div>
                <div className="contraseña">
                    <p>Crea una contraseña segura</p>
                    <input type="password" placeholder="Contraseña" />
                </div>
                <button>Crear cuenta</button>
            </form>
            <p>¿Ya tienes una cuenta? <a href="#">Iniciá sesión</a></p>
        </div>
    )
}
export default Registrarse