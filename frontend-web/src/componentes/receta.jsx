import '../estilos/receta.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Star, Heart, Bookmark, Carrot, Timer, Utensils } from 'lucide-react'

function Receta({ id, imagen, nombre, categoria, creador, cantIngredientes, duracion, porciones, meGusta = [], guardados = [], calificaciones = []
}){
    const [listaMeGusta, setListaMeGusta] = useState(meGusta)
    const [listaGuardados, setListaGuardados] = useState(guardados)

    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const navegar = useNavigate()

    useEffect(() => {
        setListaMeGusta(meGusta)
        setListaGuardados(guardados)
    }, [meGusta, guardados])

    const usuarioDioMeGusta = listaMeGusta.includes(usuario?.correo)
    const usuarioGuardo = listaGuardados.includes(usuario?.correo)

    const promedio = calificaciones.length > 0 ? calificaciones.reduce((total, calificacion) => total + Number(calificacion.valor), 0) / calificaciones.length : 0

    async function AlternarMeGusta(){
        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/recetas/${id}/me-gusta`,{
                    method: usuarioDioMeGusta ? 'DELETE' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_usuario: usuario.id_usuario
                    })
                }
            )

            if(!respuesta.ok){
                throw new Error('No se pudo actualizar el me gusta')
            }

            setListaMeGusta(actuales => usuarioDioMeGusta ? actuales.filter(correo => correo !== usuario.correo) : [...actuales, usuario.correo]
            )

        } catch(error) {
            console.error(error)
            alert('No se pudo actualizar el me gusta')
        }
    }

    async function AlternarGuardados(){
        if(!usuario){
            alert("Debes iniciar sesión")
            return
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/recetas/${id}/guardar`, {
                    method: usuarioGuardo ? 'DELETE' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_usuario: usuario.id_usuario
                    })
                }
            )

            if(!respuesta.ok){
                throw new Error('No se pudo actualizar el guardado')
            }

            setListaGuardados(actuales =>
                usuarioGuardo
                    ? actuales.filter(correo => correo !== usuario.correo)
                    : [...actuales, usuario.correo]
            )

        } catch(error) {
            console.error(error)
            alert('No se pudo actualizar el guardado')
        }
    }

    return (
        <article className='receta' onClick={() => navegar(`/receta/${id}`)}>
            <div className='imagen'>
                <div className='encabezadoReceta'>
                    <h2>{nombre}</h2>
                    <p>{categoria}</p>
                </div>

                <div className='creadorReceta'>
                    <p> {creador?.nombre} {creador?.apellido} </p>
                </div>

                <img src={imagen} alt={nombre}/>
            </div>

            <div className='informacion'>
                <div className="estrellas">
                    {promedio === 0 ?
                        <p>Sin calificar</p> :
                        [1, 2, 3, 4, 5].map((estrella) => (
                            <Star
                                key={estrella}
                                size={18}
                                color={estrella <= Math.round(promedio) ? "gold" : "gray"}
                                fill={estrella <= Math.round(promedio) ? "gold" : "none"}
                            />
                        ))
                    }
                </div>

                <p><Carrot size={30} /> {cantIngredientes}</p>
                <p><Timer size={30} /> {duracion}</p>
                <p><Utensils size={30} /> {porciones}</p>

                <div className='acciones'>
                    <button type='button' onClick={(event) => {
                        event.stopPropagation()
                        AlternarMeGusta()
                        }}
                    >
                        <Heart
                            color={usuarioDioMeGusta ? "red" : "black"}
                            fill={usuarioDioMeGusta ? "red" : "none"}
                        />
                        {listaMeGusta.length}
                    </button>

                    <button type='button' onClick={(event) => {
                            event.stopPropagation()
                            AlternarGuardados()
                        }}
                    >
                        <Bookmark
                            color={usuarioGuardo ? "yellow" : "black"}
                            fill={usuarioGuardo ? "yellow" : "none"}
                        />
                        {listaGuardados.length}
                    </button>
                </div>
            </div>
        </article>
    )
}

export default Receta