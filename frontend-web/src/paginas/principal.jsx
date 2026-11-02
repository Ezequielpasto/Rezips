import './principal.css'
import MenuSuperior from "../componentes/menuSuperior"
import MenuLateral from "../componentes/menuLateral"
import Filtros from '../componentes/filtros'
import ListaRecetas from '../componentes/listaRecetas'
import { useEffect, useState } from 'react'

function Principal(){
    const [recetas, setRecetas] = useState([])

    useEffect(() =>{
        const recetasExistentes = JSON.parse(localStorage.getItem('recetas')) || []
        setRecetas(recetasExistentes)
    }, [])
    


    return(
        <div>
            <MenuSuperior></MenuSuperior>
            <MenuLateral ></MenuLateral>
            <main className='principal'>
                <Filtros></Filtros>
                <ListaRecetas recetas={recetas}></ListaRecetas>
            </main>
        </div>        
    )
}
export default Principal