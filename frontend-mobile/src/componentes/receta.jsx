import { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Pressable, StyleSheet, Alert } from 'react-native';
import { Star, Carrot, Timer, Utensils, Heart, Bookmark } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';

export default function Receta({ id, nombre, categoria, imagen, creador, promedio, cantIngredientes, duracion, porciones, cantidadMeGusta, cantidadGuardados, usuarioDioMeGusta, usuarioGuardo, onPress }) {

    const [usuario, setUsuario] = useState(null);
    const [meGusta, setMeGusta] = useState(usuarioDioMeGusta);
    const [guardado, setGuardado] = useState(usuarioGuardo);
    const [totalMeGusta, setTotalMeGusta] = useState(cantidadMeGusta);
    const [totalGuardados, setTotalGuardados] = useState(cantidadGuardados);

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

    useEffect(() => {
        setMeGusta(usuarioDioMeGusta);
        setGuardado(usuarioGuardo);
        setTotalMeGusta(cantidadMeGusta);
        setTotalGuardados(cantidadGuardados);
    }, [usuarioDioMeGusta, usuarioGuardo, cantidadMeGusta, cantidadGuardados]);

    async function AlternarMeGusta(){
        if (!usuario) {
            Alert.alert('Atención', 'Debes iniciar sesión');
            return;
        }

        try {
            // Consultar el estado real en el servidor
            const respuestaActual = await fetch(`${API}/recetas/${id}/me-gusta`);

            if (!respuestaActual.ok) {
                throw new Error('No se pudo consultar el me gusta');
            }

            const lista = await respuestaActual.json();

            const yaDioMeGusta = lista.some(
                (item) => Number(item.id_usuario) === Number(usuario.id_usuario)
            );

            // Agregar o eliminar según el estado real
            const respuesta = await fetch(`${API}/recetas/${id}/me-gusta`, {
                method: yaDioMeGusta ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuario.id_usuario })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo actualizar el me gusta');
            }

            // Actualizar el estado visual
            setMeGusta(!yaDioMeGusta);
            setTotalMeGusta(actual =>
                yaDioMeGusta ? Math.max(0, actual - 1) : actual + 1
            );

        } catch (error) {
            console.error('Error al modificar me gusta:', error);
            Alert.alert('Error', 'No se pudo actualizar el me gusta');
        }
    }

    async function AlternarGuardados() {
        if (!usuario) {
            Alert.alert('Atención', 'Debes iniciar sesión');
            return;
        }

        try {
            const respuesta = await fetch(`${API}/recetas/${id}/guardar`, {
                method: guardado ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuario.id_usuario })
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo actualizar el guardado');
            }

            setGuardado(!guardado);
            setTotalGuardados(actual => guardado ? actual - 1 : actual + 1);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar el guardado');
        }
    }

    return (
        <View style={estilos.receta}>

            <Pressable onPress={onPress}>
                <ImageBackground source={{ uri: imagen }} style={estilos.imagen} imageStyle={estilos.imagenBordes} resizeMode="cover">
                    <View style={estilos.encabezado}>
                        <Text style={estilos.nombre}>{nombre}</Text>
                        <Text style={estilos.categoria}>{categoria}</Text>
                    </View>

                    <View style={estilos.creador}>
                        <Text style={estilos.textoCreador}>{creador?.nombre} {creador?.apellido}</Text>
                    </View>
                </ImageBackground>

                <View style={estilos.informacion}>

                    <View style={estilos.estrellas}>
                        {promedio === 0 ? (
                            <Text>Sin calificar</Text>
                        ) : (
                            [1, 2, 3, 4, 5].map((estrella) => (
                                <Star
                                    key={estrella}
                                    size={18}
                                    color={estrella <= Math.round(promedio) ? 'gold' : 'gray'}
                                    fill={estrella <= Math.round(promedio) ? 'gold' : 'none'}
                                />
                            ))
                        )}
                    </View>

                    <View style={estilos.datos}>
                        <View style={estilos.dato}>
                            <Carrot size={22} />
                            <Text>{cantIngredientes}</Text>
                        </View>

                        <View style={estilos.dato}>
                            <Timer size={22} />
                            <Text>{duracion}</Text>
                        </View>

                        <View style={estilos.dato}>
                            <Utensils size={22} />
                            <Text>{porciones}</Text>
                        </View>
                    </View>

                </View>
            </Pressable>

            <View style={estilos.acciones}>
                <Pressable style={estilos.botonAccion} onPress={AlternarMeGusta}>
                    <Heart size={23} color={meGusta ? 'red' : 'black'} fill={meGusta ? 'red' : 'none'} />
                    <Text>{totalMeGusta}</Text>
                </Pressable>

                <Pressable style={estilos.botonAccion} onPress={AlternarGuardados}>
                    <Bookmark size={23} color={guardado ? 'orange' : 'black'} fill={guardado ? 'orange' : 'none'} />
                    <Text>{totalGuardados}</Text>
                </Pressable>
            </View>

        </View>
    );
}

const estilos = StyleSheet.create({
    receta: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 3,
    },

    imagen: {
        width: '105%',
        height: 190,
        justifyContent: 'space-between',
        padding: 12,
    },

    imagenBordes: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },

    encabezado: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },

    nombre: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    categoria: {
        color: '#ffffff',
        fontSize: 13,
    },

    creador: {
        position: 'absolute',
        bottom: 0,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },

    textoCreador: {
        color: '#ffffff',
        fontSize: 12,
    },

    informacion: {
        padding: 12,
        gap: 12,
    },

    estrellas: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },

    datos: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    dato: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    acciones: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
    },

    botonAccion: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});