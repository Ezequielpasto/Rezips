
import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';

import MenuSuperior from '../componentes/menuSuperior';
import ListaRecetas from '../componentes/listaRecetas';
import MenuInferior from '../componentes/menuInferior';
import API from '../config/api';

export default function Principal() {
    const [recetas, setRecetas] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [calificacionMinima, setCalificacionMinima] = useState(0);

    useFocusEffect(
        useCallback(() => {
            let activo = true;

            async function ObtenerDatos() {
                try {
                    const [respuestaRecetas, respuestaCategorias] =
                        await Promise.all([
                            fetch(`${API}/recetas`),
                            fetch(`${API}/categorias`)
                        ]);

                    if (!respuestaRecetas.ok) {
                        throw new Error('Error al obtener las recetas');
                    }

                    if (!respuestaCategorias.ok) {
                        throw new Error('Error al obtener las categorías');
                    }

                    const datosRecetas = await respuestaRecetas.json();
                    const datosCategorias = await respuestaCategorias.json();

                    if (activo) {
                        setRecetas(datosRecetas);
                        setCategorias(datosCategorias);
                    }
                } catch (error) {
                    console.error('Error al obtener los datos:', error);
                    Alert.alert('Error', 'No se pudieron cargar las recetas o categorías');
                }
            }

            ObtenerDatos();

            return () => {
                activo = false;
            };
        }, [])
    );

    const recetasFiltradas = recetas.filter((receta) => {
        const texto = busqueda.toLowerCase().trim();

        // Buscar por nombre o ingredientes
        const coincideNombre = receta.nombre
            .toLowerCase()
            .includes(texto);

        const ingredientesIngresados = texto
            .split(',')
            .map((ingrediente) => ingrediente.trim())
            .filter((ingrediente) => ingrediente !== '');

        const coincideIngredientes = ingredientesIngresados.length > 0 &&
            ingredientesIngresados.every((buscado) =>
                (receta.ingredientes || []).some((ingrediente) =>
                    ingrediente.nombre.toLowerCase().includes(buscado)
                )
            );

        const coincideBusqueda =
            texto === '' || coincideNombre || coincideIngredientes;

        // Filtrar por categoría
        const coincideCategoria =
            categoriaSeleccionada === '' ||
            receta.categoria === categoriaSeleccionada;

        // Calcular el promedio de calificaciones
        const calificaciones = receta.calificaciones || [];

        const promedio = calificaciones.length > 0
            ? calificaciones.reduce(
                (total, calificacion) =>
                    total + Number(calificacion.valor),
                0
            ) / calificaciones.length
            : 0;

        // Filtrar por calificación mínima
        const coincideCalificacion =
            Number(calificacionMinima) === 0 ||
            promedio >= Number(calificacionMinima);

        return (
            coincideBusqueda &&
            coincideCategoria &&
            coincideCalificacion
        );
    });

    return (
        <View style={estilos.pantalla}>
            <View style={estilos.contenido}>
                <MenuSuperior
                    busqueda={busqueda}
                    onBuscar={setBusqueda}
                    categorias={categorias}
                    categoriaSeleccionada={categoriaSeleccionada}
                    onCategoriaChange={setCategoriaSeleccionada}
                    calificacionMinima={calificacionMinima}
                    onCalificacionChange={setCalificacionMinima}
                />

                <Text style={estilos.cantidad}>
                    {recetasFiltradas.length} recetas encontradas
                </Text>

                <ListaRecetas recetas={recetasFiltradas} />
            </View>

            <MenuInferior />
        </View>
    );
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    contenido: {
        flex: 1,
        paddingTop: 25,
    },

    cantidad: {
        fontSize: 14,
        color: '#666666',
        marginHorizontal: 20,
        marginBottom: 5,
    },
});
