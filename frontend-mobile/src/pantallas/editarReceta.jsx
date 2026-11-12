
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Image,
    StyleSheet,
    Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API from '../config/api';
import unidades from '../datos/unidades';

export default function EditarReceta() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const idReceta = Array.isArray(id) ? id[0] : id;

    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [duracion, setDuracion] = useState('');
    const [cantidadPorciones, setCantidadPorciones] = useState('');
    const [imagen, setImagen] = useState('');
    const [ingredientes, setIngredientes] = useState([]);
    const [pasos, setPasos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        async function ObtenerReceta() {
            try {
                const [
                    respuestaReceta,
                    respuestaCategorias,
                    respuestaIngredientes,
                    respuestaPasos
                ] = await Promise.all([
                    fetch(`${API}/recetas/${idReceta}`),
                    fetch(`${API}/categorias`),
                    fetch(`${API}/recetas/${idReceta}/ingredientes`),
                    fetch(`${API}/recetas/${idReceta}/pasos`)
                ]);

                if (
                    !respuestaReceta.ok ||
                    !respuestaCategorias.ok ||
                    !respuestaIngredientes.ok ||
                    !respuestaPasos.ok
                ) {
                    throw new Error('Error al obtener los datos');
                }

                const receta = await respuestaReceta.json();
                const datosCategorias = await respuestaCategorias.json();
                const datosIngredientes = await respuestaIngredientes.json();
                const datosPasos = await respuestaPasos.json();

                setCategorias(datosCategorias);
                setNombre(receta.nombre);
                setCategoria(String(receta.id_categoria));
                setDuracion(String(receta.duracion));
                setCantidadPorciones(String(receta.cantidad_porciones));
                setImagen(receta.imagen || '');

                setIngredientes(datosIngredientes.map(ingrediente => ({
                    nombre: ingrediente.nombre,
                    cantidad: String(ingrediente.cantidad ?? ''),
                    unidad: ingrediente.unidad || ''
                })));

                setPasos(datosPasos.map((paso, indice) => ({
                    ...paso,
                    numero: indice + 1,
                    descripcion: paso.descripcion
                })));

            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo cargar la receta');
            } finally {
                setCargando(false);
            }
        }

        if (idReceta) {
            ObtenerReceta();
        } else {
            setCargando(false);
        }
    }, [idReceta]);

    async function SeleccionarImagen() {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permiso.granted) {
            Alert.alert('Atención', 'Necesitas permitir el acceso a tus imágenes');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true
        });

        if (!resultado.canceled) {
            const archivo = resultado.assets[0];

            if (archivo.base64) {
                const tipo = archivo.mimeType || 'image/jpeg';
                setImagen(`data:${tipo};base64,${archivo.base64}`);
            }
        }
    }

    function EliminarIngrediente(indice) {
        setIngredientes(actuales =>
            actuales.filter((_, i) => i !== indice)
        );
    }

    function EliminarPaso(indice) {
        setPasos(actuales =>
            actuales
                .filter((_, i) => i !== indice)
                .map((paso, i) => ({
                    ...paso,
                    numero: i + 1
                }))
        );
    }

    async function GuardarCambios() {
        if (guardando) return;

        const datosUsuario = await AsyncStorage.getItem('usuario');
        const usuario = datosUsuario ? JSON.parse(datosUsuario) : null;

        if (!usuario) {
            Alert.alert('Atención', 'Debes iniciar sesión');
            return;
        }

        if (nombre.trim() === '') {
            Alert.alert('Atención', 'Debes ingresar un nombre para la receta');
            return;
        }

        if (categoria === '') {
            Alert.alert('Atención', 'Debes seleccionar una categoría');
            return;
        }

        if (duracion === '' || Number(duracion) <= 0) {
            Alert.alert('Atención', 'La duración debe ser mayor a cero');
            return;
        }

        if (cantidadPorciones === '' || Number(cantidadPorciones) <= 0) {
            Alert.alert('Atención', 'La cantidad de porciones debe ser mayor a cero');
            return;
        }

        if (ingredientes.length === 0) {
            Alert.alert('Atención', 'Debes agregar al menos un ingrediente');
            return;
        }

        for (const ingrediente of ingredientes) {
            const unidad = unidades.find(
                u => u.valor === ingrediente.unidad
            );

            if (
                ingrediente.nombre.trim() === '' ||
                !unidad ||
                (!unidad.sinCantidad && ingrediente.cantidad.trim() === '')
            ) {
                Alert.alert('Atención', 'Debes completar todos los datos de los ingredientes');
                return;
            }

            if (!unidad.sinCantidad && Number(ingrediente.cantidad) <= 0) {
                Alert.alert('Atención', 'Las cantidades deben ser mayores a cero');
                return;
            }
        }

        if (pasos.length === 0) {
            Alert.alert('Atención', 'Debes agregar al menos un paso');
            return;
        }

        for (const paso of pasos) {
            if (paso.descripcion.trim() === '') {
                Alert.alert('Atención', 'Debes completar todos los pasos');
                return;
            }
        }

        try {
            setGuardando(true);

            const ingredientesActualizados = ingredientes.map(ingrediente => {
                const unidad = unidades.find(
                    u => u.valor === ingrediente.unidad
                );

                return {
                    nombre: ingrediente.nombre.trim(),
                    cantidad: unidad.sinCantidad ? 1 : Number(ingrediente.cantidad),
                    unidad: ingrediente.unidad
                };
            });

            const pasosActualizados = pasos.map((paso, indice) => ({
                numero: indice + 1,
                descripcion: paso.descripcion.trim()
            }));

            const respuesta = await fetch(`${API}/recetas/${idReceta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    duracion: Number(duracion),
                    cantidad_porciones: Number(cantidadPorciones),
                    imagen,
                    id_usuario: usuario.id_usuario,
                    id_categoria: Number(categoria),
                    ingredientes: ingredientesActualizados,
                    pasos: pasosActualizados
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'Error al modificar la receta');
            }

            Alert.alert(
                'Listo',
                'Receta actualizada correctamente',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => router.replace(
                            `/detallesReceta?id=${idReceta}`
                        )
                    }
                ]
            );

        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'No se pudo modificar la receta');
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) {
        return (
            <View style={estilos.centrado}>
                <Text>Cargando receta...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={estilos.pantalla}
            contentContainerStyle={estilos.contenido}
            showsVerticalScrollIndicator={false}
        >
            <Text style={estilos.titulo}>Editar receta</Text>

            <View style={estilos.seccion}>
                <Text style={estilos.etiqueta}>Nombre de la receta</Text>
                <TextInput
                    style={estilos.input}
                    placeholder="Nombre de la receta"
                    value={nombre}
                    onChangeText={setNombre}
                />
            </View>

            <View style={estilos.seccion}>
                <Text style={estilos.etiqueta}>Categoría</Text>
                <View style={estilos.selector}>
                    <Picker
                        selectedValue={categoria}
                        onValueChange={setCategoria}
                    >
                        <Picker.Item label="Seleccionar categoría" value="" />
                        {categorias.map(item => (
                            <Picker.Item
                                key={item.id_categoria}
                                label={item.nombre}
                                value={String(item.id_categoria)}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={estilos.seccion}>
                <Text style={estilos.etiqueta}>Duración (minutos)</Text>
                <TextInput
                    style={estilos.input}
                    placeholder="Duración"
                    keyboardType="numeric"
                    value={duracion}
                    onChangeText={setDuracion}
                />
            </View>

            <View style={estilos.seccion}>
                <Text style={estilos.etiqueta}>Cantidad de porciones</Text>
                <TextInput
                    style={estilos.input}
                    placeholder="Cantidad de porciones"
                    keyboardType="numeric"
                    value={cantidadPorciones}
                    onChangeText={setCantidadPorciones}
                />
            </View>

            <View style={estilos.seccion}>
                <Text style={estilos.etiqueta}>Imagen</Text>

                {imagen !== '' && (
                    <Image
                        source={{ uri: imagen }}
                        style={estilos.imagen}
                    />
                )}

                <Pressable
                    style={estilos.botonSecundario}
                    onPress={SeleccionarImagen}
                >
                    <Text>Seleccionar nueva imagen</Text>
                </Pressable>
            </View>

            <View style={estilos.seccion}>
                <Text style={estilos.subtitulo}>Ingredientes</Text>
                <Text style={estilos.descripcion}>
                    Modifica, elimina o agrega ingredientes.
                </Text>

                {ingredientes.map((ingrediente, indice) => (
                    <View style={estilos.elemento} key={indice}>
                        <Text style={estilos.numero}>Ingrediente {indice + 1}</Text>

                        <TextInput
                            style={estilos.input}
                            placeholder="Nombre del ingrediente"
                            value={ingrediente.nombre}
                            onChangeText={valor => {
                                setIngredientes(actuales =>
                                    actuales.map((item, i) =>
                                        i === indice
                                            ? { ...item, nombre: valor }
                                            : item
                                    )
                                );
                            }}
                        />

                        <TextInput
                            style={estilos.input}
                            placeholder="Cantidad"
                            keyboardType="decimal-pad"
                            value={ingrediente.cantidad}
                            onChangeText={valor => {
                                setIngredientes(actuales =>
                                    actuales.map((item, i) =>
                                        i === indice
                                            ? { ...item, cantidad: valor }
                                            : item
                                    )
                                );
                            }}
                        />

                        <View style={estilos.selector}>
                            <Picker
                                selectedValue={ingrediente.unidad}
                                onValueChange={valor => {
                                    setIngredientes(actuales =>
                                        actuales.map((item, i) =>
                                            i === indice
                                                ? { ...item, unidad: valor }
                                                : item
                                        )
                                    );
                                }}
                            >
                                <Picker.Item label="Seleccionar unidad" value="" />
                                {unidades.map(unidad => (
                                    <Picker.Item
                                        key={unidad.valor}
                                        label={`${unidad.singular} / ${unidad.plural}`}
                                        value={unidad.valor}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <Pressable
                            style={estilos.botonEliminar}
                            onPress={() => EliminarIngrediente(indice)}
                            disabled={ingredientes.length === 1}
                        >
                            <Text style={estilos.textoEliminar}>Eliminar ingrediente</Text>
                        </Pressable>
                    </View>
                ))}

                <Pressable
                    style={estilos.botonSecundario}
                    onPress={() => setIngredientes(actuales => [
                        ...actuales,
                        { nombre: '', cantidad: '', unidad: '' }
                    ])}
                >
                    <Text>+ Agregar ingrediente</Text>
                </Pressable>
            </View>

            <View style={estilos.seccion}>
                <Text style={estilos.subtitulo}>Pasos</Text>
                <Text style={estilos.descripcion}>
                    Modifica, elimina o agrega los pasos de preparación.
                </Text>

                {pasos.map((paso, indice) => (
                    <View style={estilos.elemento} key={indice}>
                        <Text style={estilos.numero}>Paso {indice + 1}</Text>

                        <TextInput
                            style={[estilos.input, estilos.textarea]}
                            placeholder="Descripción del paso"
                            multiline
                            value={paso.descripcion}
                            onChangeText={valor => {
                                setPasos(actuales =>
                                    actuales.map((item, i) =>
                                        i === indice
                                            ? { ...item, descripcion: valor }
                                            : item
                                    )
                                );
                            }}
                        />

                        <Pressable
                            style={estilos.botonEliminar}
                            onPress={() => EliminarPaso(indice)}
                            disabled={pasos.length === 1}
                        >
                            <Text style={estilos.textoEliminar}>Eliminar paso</Text>
                        </Pressable>
                    </View>
                ))}

                <Pressable
                    style={estilos.botonSecundario}
                    onPress={() => setPasos(actuales => [
                        ...actuales,
                        {
                            numero: actuales.length + 1,
                            descripcion: ''
                        }
                    ])}
                >
                    <Text>+ Agregar paso</Text>
                </Pressable>
            </View>

            <Pressable
                style={estilos.botonGuardar}
                onPress={GuardarCambios}
                disabled={guardando}
            >
                <Text style={estilos.textoGuardar}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    contenido: {
        padding: 20,
        paddingBottom: 40,
        gap: 20
    },
    centrado: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    seccion: {
        gap: 10
    },
    etiqueta: {
        fontSize: 16,
        fontWeight: '600'
    },
    subtitulo: {
        fontSize: 21,
        fontWeight: 'bold'
    },
    descripcion: {
        color: '#666666'
    },
    input: {
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        backgroundColor: '#ffffff'
    },
    selector: {
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 10,
        overflow: 'hidden'
    },
    imagen: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    elemento: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 10,
        gap: 10
    },
    numero: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    textarea: {
        minHeight: 100,
        textAlignVertical: 'top'
    },
    botonSecundario: {
        padding: 14,
        backgroundColor: '#eeeeee',
        borderRadius: 10,
        alignItems: 'center'
    },
    botonEliminar: {
        padding: 10,
        backgroundColor: '#ffdddd',
        borderRadius: 8,
        alignItems: 'center'
    },
    textoEliminar: {
        color: '#cc0000',
        fontWeight: '600'
    },
    botonGuardar: {
        padding: 16,
        backgroundColor: '#222222',
        borderRadius: 10,
        alignItems: 'center'
    },
    textoGuardar: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
