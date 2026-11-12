
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Receta from './receta';

export default function ListaRecetas({ recetas = [], encabezado = null }) {
    const [usuario, setUsuario] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function ObtenerUsuario() {
            try {
                const datos = await AsyncStorage.getItem('usuario');

                if (datos) {
                    setUsuario(JSON.parse(datos));
                }
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
            }
        }

        ObtenerUsuario();
    }, []);

    return (
        <FlatList
            data={recetas}
            keyExtractor={(receta) => receta.id_receta.toString()}
            ListHeaderComponent={encabezado}
            renderItem={({ item: receta }) => {
                const promedio = receta.calificaciones?.length
                    ? receta.calificaciones.reduce(
                        (total, calificacion) =>
                            total + Number(calificacion.valor),
                        0
                    ) / receta.calificaciones.length
                    : 0;

                return (
                    <View style={encabezado ? estilos.recetaConEncabezado : null}>
                        <Receta
                            id={receta.id_receta}
                            imagen={receta.imagen}
                            nombre={receta.nombre}
                            categoria={receta.categoria}
                            creador={receta.creador}
                            promedio={promedio}
                            cantIngredientes={(receta.ingredientes || []).length}
                            duracion={receta.duracion}
                            porciones={receta.cantidad_porciones}
                            cantidadMeGusta={(receta.meGusta || []).length}
                            cantidadGuardados={(receta.guardados || []).length}
                            usuarioDioMeGusta={(receta.meGusta || []).includes(usuario?.correo)}
                            usuarioGuardo={(receta.guardados || []).includes(usuario?.correo)}
                            onPress={() => router.push(`/detallesReceta?id=${receta.id_receta}`)}
                        />
                    </View>
                );
            }}
            contentContainerStyle={
                encabezado
                    ? estilos.listaConEncabezado
                    : estilos.lista
            }
            showsVerticalScrollIndicator={false}
        />
    );
}

const estilos = StyleSheet.create({
    lista: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 110,
    },

    listaConEncabezado: {
        paddingTop: 0,
        paddingBottom: 110,
    },

    recetaConEncabezado: {
        marginHorizontal: 15,
        marginBottom: 15,
    },
});
