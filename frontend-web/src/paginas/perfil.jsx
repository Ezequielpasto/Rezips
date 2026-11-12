import '../estilos/perfil.css'
import MenuLateral from '../componentes/menuLateral'
import ListaRecetas from '../componentes/listaRecetas'
import { useState, useEffect } from 'react'
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

function Perfil(){
    const [usuario, setUsuario] = useState(null)
    const [recetas, setRecetas] = useState([])

    useFocusEffect(
        useCallback(() => {
            async function ObtenerDatos() {
                try {
                    const usuarioJSON = await AsyncStorage.getItem('usuario');

                    if (!usuarioJSON) return;

                    const usuarioActual = JSON.parse(usuarioJSON);
                    setUsuario(usuarioActual);

                    const respuesta = await fetch(`${API}/recetas`);

                    if (!respuesta.ok) {
                        throw new Error('No se pudieron obtener las recetas');
                    }

                    const datos = await respuesta.json();

                    const recetasUsuario = datos.filter(
                        receta => Number(receta.id_usuario) === Number(usuarioActual.id_usuario)
                    );

                    setRecetas(recetasUsuario);

                } catch (error) {
                    console.error('Error al actualizar el perfil:', error);
                }
            }

            ObtenerDatos();
        }, [])
    );

    return(
        <section>
          <MenuLateral></MenuLateral>  
          <main className="miCuenta">
            <div className="datos">
                <div className='nombreCirculo'>
                    <p className='circuloPerfil'>{usuario?.nombre[0]}{usuario?.apellido[0]}</p>
                    <h4>{usuario?.nombre} {usuario?.apellido}</h4>
                </div>   
                <p>{recetas.length} recetas creadas</p>
            </div>
            <div className='contenido'>
                <ListaRecetas recetas={recetas}></ListaRecetas>
            </div>          
          </main>
        </section>
    )
}
export default Perfil