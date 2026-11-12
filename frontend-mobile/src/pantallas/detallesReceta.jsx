
import { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import { Star, Timer, Utensils, Heart, Bookmark, MessageCircle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';
import ListaIngredientes from '../componentes/listaIngredientes';
import ListaPasos from '../componentes/listaPasos';

export default function DetallesReceta() {
    const router = useRouter();
    const scrollRef = useRef(null);
    const comentariosRef = useRef(null);
    const { id } = useLocalSearchParams();
    const idReceta = Array.isArray(id) ? id[0] : id;

    const [usuario, setUsuario] = useState(null);
    const [receta, setReceta] = useState(null);
    const [ingredientes, setIngredientes] = useState([]);
    const [pasos, setPasos] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [listaMeGusta, setListaMeGusta] = useState([]);
    const [listaGuardados, setListaGuardados] = useState([]);
    const [comentDescripcion, setComentDescripcion] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function ObtenerUsuario() {
            try {
                const datos = await AsyncStorage.getItem('usuario');
                if (datos) setUsuario(JSON.parse(datos));
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
            }
        }

        ObtenerUsuario();
    }, []);

    useEffect(() => {
        async function ObtenerDatos() {
            try {
                const respuesta = await fetch(`${API}/recetas/${idReceta}`);
                if (!respuesta.ok) throw new Error('Error al obtener receta');
                setReceta(await respuesta.json());

                const respuestaPasos = await fetch(`${API}/recetas/${idReceta}/pasos`);
                if (!respuestaPasos.ok) throw new Error('Error al obtener pasos');
                setPasos(await respuestaPasos.json());

                const respuestaComentarios = await fetch(`${API}/recetas/${idReceta}/comentarios`);
                if (!respuestaComentarios.ok) throw new Error('Error al obtener comentarios');
                setComentarios(await respuestaComentarios.json());

                const respuestaIngredientes = await fetch(`${API}/recetas/${idReceta}/ingredientes`);
                if (!respuestaIngredientes.ok) throw new Error('Error al obtener ingredientes');
                setIngredientes(await respuestaIngredientes.json());

                const respuestaMeGusta = await fetch(`${API}/recetas/${idReceta}/me-gusta`);
                if (!respuestaMeGusta.ok) throw new Error('Error al obtener me gusta');
                setListaMeGusta(await respuestaMeGusta.json());

                const respuestaGuardados = await fetch(`${API}/recetas/${idReceta}/guardar`);
                if (!respuestaGuardados.ok) throw new Error('Error al obtener guardados');
                setListaGuardados(await respuestaGuardados.json());

                const respuestaCalificaciones = await fetch(`${API}/recetas/${idReceta}/calificacion`);
                if (!respuestaCalificaciones.ok) throw new Error('Error al obtener calificaciones');
                setCalificaciones(await respuestaCalificaciones.json());

            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudieron obtener los datos de la receta');
            } finally {
                setCargando(false);
            }
        }

        if (idReceta) {
            ObtenerDatos();
        } else {
            setCargando(false);
        }
    }, [idReceta]);

    const esPropietario = usuario?.id_usuario === receta?.id_usuario;

    const usuarioDioMeGusta = listaMeGusta.some(
        (meGusta) => Number(meGusta.id_usuario) === usuario?.id_usuario
    );

    const usuarioGuardo = listaGuardados.some(
        (guardado) => Number(guardado.id_usuario) === usuario?.id_usuario
    );

    const miCalificacion = calificaciones.find(
        (calificacion) => Number(calificacion.id_usuario) === usuario?.id_usuario
    )?.valor || 0;

    const promedio = calificaciones.length > 0
        ? calificaciones.reduce((total, calificacion) => total + Number(calificacion.valor), 0) / calificaciones.length
        : 0;

    async function AlternarMeGusta() {
        if (!usuario) {
            Alert.alert('Atención', 'Debes iniciar sesión');
            return;
        }

        try {
            const respuesta = await fetch(`${API}/recetas/${idReceta}/me-gusta`, {
                method: usuarioDioMeGusta ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuario.id_usuario })
            });

            if (!respuesta.ok) throw new Error('Error al modificar me gusta');

            const respuestaMeGusta = await fetch(`${API}/recetas/${idReceta}/me-gusta`);
            if (!respuestaMeGusta.ok) throw new Error('Error al actualizar me gusta');

            setListaMeGusta(await respuestaMeGusta.json());

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo modificar el me gusta');
        }
    }

    async function AlternarGuardados() {
        if (!usuario) {
            Alert.alert('Atención', 'Debes iniciar sesión');
            return;
        }

        try {
            const respuesta = await fetch(`${API}/recetas/${idReceta}/guardar`, {
                method: usuarioGuardo ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuario.id_usuario })
            });

            if (!respuesta.ok) throw new Error('Error al modificar guardados');

            const respuestaGuardados = await fetch(`${API}/recetas/${idReceta}/guardar`);
            if (!respuestaGuardados.ok) throw new Error('Error al actualizar guardados');

            setListaGuardados(await respuestaGuardados.json());

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo modificar el guardado');
        }
    }

    async function CalificarReceta(valor) {
        if (!usuario) {
            Alert.alert('Atención', 'Debes iniciar sesión para calificar');
            return;
        }

        try {
            const respuesta = await fetch(`${API}/recetas/${idReceta}/calificacion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuario.id_usuario, valor })
            });

            if (!respuesta.ok) throw new Error('Error al guardar la calificación');

            const respuestaCalificaciones = await fetch(`${API}/recetas/${idReceta}/calificacion`);
            if (!respuestaCalificaciones.ok) throw new Error('Error al actualizar las calificaciones');

            setCalificaciones(await respuestaCalificaciones.json());

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo guardar la calificación');
        }
    }

    async function NuevoComentario() {
        if (!usuario) {
            Alert.alert('Atención', 'Debes iniciar sesión');
            return;
        }

        if (comentDescripcion.trim() === '') {
            Alert.alert('Atención', 'Debes escribir un comentario');
            return;
        }

        try {
            const respuesta = await fetch(`${API}/recetas/${idReceta}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    descripcion: comentDescripcion.trim()
                })
            });

            if (!respuesta.ok) throw new Error('Error al enviar el comentario');

            const respuestaComentarios = await fetch(`${API}/recetas/${idReceta}/comentarios`);
            if (!respuestaComentarios.ok) throw new Error('Error al actualizar los comentarios');

            setComentarios(await respuestaComentarios.json());
            setComentDescripcion('');

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo enviar el comentario');
        }
    }

    function EliminarComentario(idComentario) {
        Alert.alert(
            'Eliminar comentario',
            '¿Estás seguro de que querés eliminar este comentario?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const respuesta = await fetch(`${API}/comentarios/${idComentario}`, {
                                method: 'DELETE'
                            });

                            if (!respuesta.ok) throw new Error('Error al eliminar el comentario');

                            setComentarios(actuales =>
                                actuales.filter(comentario => comentario.id_comentario !== idComentario)
                            );

                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'No se pudo eliminar el comentario');
                        }
                    }
                }
            ]
        );
    }

    function EliminarReceta() {
        Alert.alert(
            'Eliminar receta',
            '¿Estás seguro de que querés eliminar esta receta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const respuesta = await fetch(`${API}/recetas/${idReceta}`, {
                                method: 'DELETE'
                            });

                            if (!respuesta.ok) throw new Error('Error al eliminar la receta');

                            Alert.alert('Listo', 'Receta eliminada correctamente');
                            router.replace('/principal');

                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'No se pudo eliminar la receta');
                        }
                    }
                }
            ]
        );
    }

    if (cargando) {
        return <View style={estilos.pantalla}><Text>Cargando receta...</Text></View>;
    }

    if (!receta) {
        return <View style={estilos.pantalla}><Text>No se pudo encontrar la receta</Text></View>;
    }

    return (
        <ScrollView style={estilos.pantalla} showsVerticalScrollIndicator={false}>
            <Image source={{ uri: receta.imagen }} style={estilos.imagen} />

            <View style={estilos.contenido}>
                <View style={estilos.tituloEstrellas}>
                    <View style={estilos.tituloCategoria}>
                        <Text style={estilos.titulo}>{receta.nombre}</Text>
                        <Text style={estilos.categoria}>{receta.categoria}</Text>
                    </View>

                    <View style={estilos.promedio}>
                        {promedio === 0 ? (
                            <Text>Sin calificar</Text>
                        ) : (
                            [1, 2, 3, 4, 5].map(estrella => (
                                <Star key={estrella} size={22} color={estrella <= Math.round(promedio) ? 'gold' : 'gray'} fill={estrella <= Math.round(promedio) ? 'gold' : 'none'} />
                            ))
                        )}
                    </View>
                </View>

                <View style={estilos.duracionPorciones}>
                    <View style={estilos.dato}>
                        <Timer size={28} />
                        <Text style={estilos.textoDato}>{receta.duracion}</Text>
                    </View>

                    <View style={estilos.dato}>
                        <Utensils size={28} />
                        <Text style={estilos.textoDato}>{receta.cantidad_porciones}</Text>
                    </View>
                </View>

                <View style={estilos.interaccion}>
                    <View style={estilos.iconosInteraccion}>
                        <Pressable style={estilos.botonInteraccion} onPress={AlternarMeGusta}>
                            <Heart size={25} color={usuarioDioMeGusta ? 'red' : 'black'} fill={usuarioDioMeGusta ? 'red' : 'none'} />
                            <Text>{listaMeGusta.length}</Text>
                        </Pressable>

                        <Pressable style={estilos.botonInteraccion} onPress={AlternarGuardados}>
                            <Bookmark size={25} color={usuarioGuardo ? 'orange' : 'black'} fill={usuarioGuardo ? 'orange' : 'none'} />
                            <Text>{listaGuardados.length}</Text>
                        </Pressable>

                        <View style={estilos.estrellas}>
                            {[1, 2, 3, 4, 5].map(estrella => (
                                <Pressable key={estrella} onPress={() => CalificarReceta(estrella)}>
                                    <Star size={22} color={estrella <= miCalificacion ? 'black' : 'gray'} fill={estrella <= miCalificacion ? 'black' : 'none'} />
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <Pressable style={estilos.botonComentarios} onPress={() => Alert.alert('Comentarios', `${comentarios.length} comentarios`)}>
                        <MessageCircle size={20} />
                        <Text style={estilos.textoComentarios}>Comentarios ({comentarios.length})</Text>
                    </Pressable>
                </View>

                <View style={estilos.seccion}>
                    <Text style={estilos.subtitulo}>Ingredientes</Text>
                    <ListaIngredientes ingredientes={ingredientes} />
                </View>

                <View style={estilos.seccion}>
                    <Text style={estilos.subtitulo}>Pasos</Text>
                    <ListaPasos pasos={pasos} />
                </View>

                <View style={estilos.seccion}>
                    <Text style={estilos.subtitulo}>Comentarios</Text>

                    <TextInput
                        style={estilos.entradaComentario}
                        placeholder="Escribe un comentario..."
                        value={comentDescripcion}
                        onChangeText={setComentDescripcion}
                        multiline
                    />

                    <Pressable style={estilos.botonEnviarComentario} onPress={NuevoComentario}>
                        <Text style={estilos.textoBoton}>Enviar comentario</Text>
                    </Pressable>

                    {comentarios.map(comentario => (
                        <View key={comentario.id_comentario} style={estilos.comentario}>
                            <View style={estilos.encabezadoComentario}>
                                <Text style={estilos.nombreComentario}>{comentario.nombre} {comentario.apellido}</Text>

                                {usuario?.id_usuario === comentario.id_usuario && (
                                    <Pressable onPress={() => EliminarComentario(comentario.id_comentario)}>
                                        <Text style={estilos.eliminarComentario}>Eliminar</Text>
                                    </Pressable>
                                )}
                            </View>

                            <Text style={estilos.textoComentario}>{comentario.descripcion}</Text>
                            <Text style={estilos.fechaComentario}>{comentario.fecha}</Text>
                        </View>
                    ))}
                </View>

                {esPropietario && (
                    <View style={estilos.propietario}>
                        <Pressable style={estilos.botonPropietario}>
                            <Text style={estilos.textoBoton} onPress={() => router.push(`/editarReceta?id=${idReceta}`)}>Editar receta</Text>
                        </Pressable>

                        <Pressable style={estilos.botonEliminar} onPress={EliminarReceta}>
                            <Text style={estilos.textoBoton}>Eliminar receta</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    imagen: {
        width: '100%',
        height: 280,
        resizeMode: 'cover',
    },
    contenido: {
        padding: 20,
        gap: 20,
    },
    tituloEstrellas: {
        gap: 12,
    },
    tituloCategoria: {
        gap: 5,
    },
    titulo: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    categoria: {
        fontSize: 16,
        color: '#666666',
    },
    promedio: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    duracionPorciones: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eeeeee',
    },
    dato: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textoDato: {
        fontSize: 17,
    },
    interaccion: {
        width: '100%',
        gap: 15,
    },
    iconosInteraccion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    botonInteraccion: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    estrellas: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    botonComentarios: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 10,
    },
    textoComentarios: {
        fontSize: 16,
        fontWeight: '600',
    },
    seccion: {
        gap: 12,
    },
    subtitulo: {
        fontSize: 21,
        fontWeight: 'bold',
    },
    propietario: {
        gap: 12,
        marginBottom: 25,
    },
    botonPropietario: {
        backgroundColor: '#dddddd',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    botonEliminar: {
        backgroundColor: '#ffdddd',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoBoton: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    entradaComentario: {
        minHeight: 90,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 10,
        padding: 12,
        textAlignVertical: 'top',
        fontSize: 15,
    },
    botonEnviarComentario: {
        backgroundColor: '#dddddd',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    comentario: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        gap: 6,
    },
    encabezadoComentario: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nombreComentario: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    textoComentario: {
        fontSize: 15,
    },
    fechaComentario: {
        color: '#777777',
        fontSize: 12,
    },
    eliminarComentario: {
        color: 'red',
        fontSize: 13,
    },
});
