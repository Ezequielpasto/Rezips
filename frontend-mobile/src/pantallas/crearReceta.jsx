
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
import unidades from '../datos/unidades';
import API from '../config/api';
import MenuInferior from '../componentes/menuInferior';

export default function CrearReceta() {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [duracion, setDuracion] = useState('');
    const [cantidadPorciones, setCantidadPorciones] = useState('');
    const [imagen, setImagen] = useState(null);

    const [ingredientes, setIngredientes] = useState([
        { nombre: '', cantidad: '', unidad: '' },
    ]);

    const [pasos, setPasos] = useState([
        { numero: 1, descripcion: '' },
    ]);

    const [categorias, setCategorias] = useState([]);

    // Obtener categorías
    useEffect(() => {
        async function ObtenerCategorias() {
            try {
                const respuesta = await fetch(`${API}/categorias`);
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error('No se pudieron obtener las categorías');
                }

                setCategorias(datos);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
                Alert.alert('Error', 'No se pudieron cargar las categorías');
            }
        }

        ObtenerCategorias();
    }, []);

    // Seleccionar imagen
    async function SeleccionarImagen() {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permiso.granted) {
            Alert.alert(
                'Permiso necesario',
                'Necesitás permitir el acceso a las imágenes'
            );
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
            base64: true,
        });

        if (!resultado.canceled) {
            const imagenBase64 = resultado.assets[0].base64;

            if (imagenBase64) {
                const tipo = resultado.assets[0].mimeType || 'image/jpeg';
                setImagen(`data:${tipo};base64,${imagenBase64}`);
            }
        }
    }

    // Ingredientes
    function EliminarIngrediente(indice) {
        setIngredientes(ingredientes.filter((_, i) => i !== indice));
    }

    function ActualizarIngrediente(indice, campo, valor) {
        setIngredientes(actuales =>
            actuales.map((ingrediente, i) =>
                i === indice
                    ? { ...ingrediente, [campo]: valor }
                    : ingrediente
            )
        );
    }

    // Pasos
    function EliminarPaso(indice) {
        setPasos(actuales =>
            actuales
                .filter((_, i) => i !== indice)
                .map((paso, i) => ({ ...paso, numero: i + 1 }))
        );
    }

    function ActualizarPaso(indice, descripcion) {
        setPasos(actuales =>
            actuales.map((paso, i) =>
                i === indice ? { ...paso, descripcion } : paso
            )
        );
    }

    // Validaciones
    function ValidarReceta() {
        if (nombre.trim() === '') {
            Alert.alert('Atención', 'Debés ingresar un nombre para la receta');
            return false;
        }

        if (categoria === '') {
            Alert.alert('Atención', 'Debés seleccionar una categoría');
            return false;
        }

        if (duracion === '' || Number(duracion) <= 0) {
            Alert.alert('Atención', 'La duración debe ser mayor a cero');
            return false;
        }

        if (cantidadPorciones === '' || Number(cantidadPorciones) <= 0) {
            Alert.alert('Atención', 'La cantidad de porciones debe ser mayor a cero');
            return false;
        }

        for (const ingrediente of ingredientes) {
            const unidad = unidades.find(
                u => u.valor === ingrediente.unidad
            );

            if (!unidad) {
                Alert.alert('Atención', 'Debés seleccionar una unidad válida');
                return false;
            }

            if (
                ingrediente.nombre.trim() === '' ||
                (!unidad.sinCantidad && ingrediente.cantidad.trim() === '') ||
                ingrediente.unidad === ''
            ) {
                Alert.alert(
                    'Atención',
                    'Debés completar todos los datos de los ingredientes'
                );
                return false;
            }

            if (!unidad.sinCantidad && Number(ingrediente.cantidad) <= 0) {
                Alert.alert('Atención', 'La cantidad debe ser mayor a cero');
                return false;
            }
        }

        for (const paso of pasos) {
            if (paso.descripcion.trim() === '') {
                Alert.alert(
                    'Atención',
                    'Debés completar la descripción de todos los pasos'
                );
                return false;
            }
        }

        return true;
    }

    // Crear receta
    async function CrearReceta() {
        if (!ValidarReceta()) return;

        try {
            const usuarioGuardado = await import(
                '@react-native-async-storage/async-storage'
            );
            const usuarioJSON = await usuarioGuardado.default.getItem('usuario');

            if (!usuarioJSON) {
                Alert.alert(
                    'Error',
                    'Debés iniciar sesión para publicar una receta'
                );
                return;
            }

            const usuario = JSON.parse(usuarioJSON);

            if (!usuario?.id_usuario) {
                Alert.alert('Error', 'No se encontró el usuario');
                return;
            }

            // Crear receta
            const respuesta = await fetch(`${API}/recetas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    duracion: Number(duracion),
                    cantidad_porciones: Number(cantidadPorciones),
                    imagen,
                    id_usuario: usuario.id_usuario,
                    id_categoria: Number(categoria),
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'Error al crear la receta');
            }

            const idReceta = datos.receta.id_receta;

            // Guardar ingredientes
            for (const ingrediente of ingredientes) {
                const unidadSeleccionada = unidades.find(
                    u => u.valor === ingrediente.unidad
                );

                const respuestaIngrediente = await fetch(`${API}/ingredientes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_receta: idReceta,
                        nombre: ingrediente.nombre,
                        cantidad: unidadSeleccionada?.sinCantidad
                            ? 1
                            : Number(ingrediente.cantidad),
                        unidad: ingrediente.unidad,
                    }),
                });

                if (!respuestaIngrediente.ok) {
                    throw new Error('Error al guardar los ingredientes');
                }
            }

            // Guardar pasos
            for (const paso of pasos) {
                const respuestaPaso = await fetch(
                    `${API}/recetas/${idReceta}/pasos`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            numero: paso.numero,
                            descripcion: paso.descripcion,
                        }),
                    }
                );

                if (!respuestaPaso.ok) {
                    throw new Error('Error al guardar los pasos');
                }
            }

            Alert.alert('¡Éxito!', 'Receta creada correctamente', [
                {
                    text: 'Aceptar',
                },
            ]);
        } catch (error) {
            console.error('Error al crear receta:', error);
            Alert.alert(
                'Error',
                error instanceof Error
                    ? error.message
                    : 'Ocurrió un error al crear la receta'
            );
        }
    }

    return (
        <View style={estilos.pantalla}>

            <ScrollView
                style={estilos.scroll}
                contentContainerStyle={estilos.contenido}
                showsVerticalScrollIndicator={false}
            >
                <Text style={estilos.titulo}>Crea una nueva receta</Text>

                <View style={estilos.campo}>
                    <Text style={estilos.etiqueta}>Nombre de la receta</Text>
                    <TextInput
                        style={estilos.input}
                        placeholder="Nombre de la receta"
                        value={nombre}
                        onChangeText={setNombre}
                    />
                </View>

                <View style={estilos.campo}>
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

                <View style={estilos.campo}>
                    <Text style={estilos.etiqueta}>
                        Duración aproximada (minutos)
                    </Text>
                    <TextInput
                        style={estilos.input}
                        placeholder="Duración"
                        keyboardType="numeric"
                        value={duracion}
                        onChangeText={setDuracion}
                    />
                </View>

                <View style={estilos.campo}>
                    <Text style={estilos.etiqueta}>Cantidad de porciones</Text>
                    <TextInput
                        style={estilos.input}
                        placeholder="Cantidad de porciones"
                        keyboardType="numeric"
                        value={cantidadPorciones}
                        onChangeText={setCantidadPorciones}
                    />
                </View>

                {/* Imagen */}
                <View style={estilos.campo}>
                    <Text style={estilos.etiqueta}>Imagen de la receta</Text>

                    <Pressable
                        style={estilos.botonSecundario}
                        onPress={SeleccionarImagen}
                    >
                        <Text style={estilos.textoBotonSecundario}>
                            Seleccionar imagen
                        </Text>
                    </Pressable>

                    {imagen && (
                        <Image
                            source={{ uri: imagen }}
                            style={estilos.imagen}
                        />
                    )}
                </View>

                {/* Ingredientes */}
                <View style={estilos.seccion}>
                    <Text style={estilos.subtitulo}>Ingredientes</Text>
                    <Text style={estilos.descripcion}>
                        Ingresá el nombre, la cantidad y la unidad de cada ingrediente
                    </Text>

                    {ingredientes.map((ingrediente, indice) => (
                        <View style={estilos.tarjeta} key={indice}>
                            <TextInput
                                style={estilos.input}
                                placeholder="Ingrediente"
                                value={ingrediente.nombre}
                                onChangeText={valor =>
                                    ActualizarIngrediente(indice, 'nombre', valor)
                                }
                            />

                            <TextInput
                                style={estilos.input}
                                placeholder="Cantidad"
                                keyboardType="decimal-pad"
                                value={ingrediente.cantidad}
                                onChangeText={valor =>
                                    ActualizarIngrediente(indice, 'cantidad', valor)
                                }
                            />

                            <View style={estilos.selector}>
                                <Picker
                                    selectedValue={ingrediente.unidad}
                                    onValueChange={valor =>
                                        ActualizarIngrediente(indice, 'unidad', valor)
                                    }
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
                                style={[
                                    estilos.botonEliminar,
                                    ingredientes.length === 1 && estilos.deshabilitado,
                                ]}
                                disabled={ingredientes.length === 1}
                                onPress={() => EliminarIngrediente(indice)}
                            >
                                <Text style={estilos.textoEliminar}>
                                    Eliminar ingrediente
                                </Text>
                            </Pressable>
                        </View>
                    ))}

                    <Pressable
                        style={estilos.botonSecundario}
                        onPress={() =>
                            setIngredientes([
                                ...ingredientes,
                                { nombre: '', cantidad: '', unidad: '' },
                            ])
                        }
                    >
                        <Text style={estilos.textoBotonSecundario}>
                            + Agregar ingrediente
                        </Text>
                    </Pressable>
                </View>

                {/* Pasos */}
                <View style={estilos.seccion}>
                    <Text style={estilos.subtitulo}>Pasos</Text>
                    <Text style={estilos.descripcion}>
                        Ingresá la descripción de cada paso
                    </Text>

                    {pasos.map((paso, indice) => (
                        <View style={estilos.tarjeta} key={indice}>
                            <Text style={estilos.etiqueta}>Paso {paso.numero}</Text>

                            <TextInput
                                style={[estilos.input, estilos.textArea]}
                                placeholder="Nuevo paso"
                                multiline
                                value={paso.descripcion}
                                onChangeText={valor => ActualizarPaso(indice, valor)}
                            />

                            <Pressable
                                style={[
                                    estilos.botonEliminar,
                                    pasos.length === 1 && estilos.deshabilitado,
                                ]}
                                disabled={pasos.length === 1}
                                onPress={() => EliminarPaso(indice)}
                            >
                                <Text style={estilos.textoEliminar}>
                                    Eliminar paso
                                </Text>
                            </Pressable>
                        </View>
                    ))}

                    <Pressable
                        style={estilos.botonSecundario}
                        onPress={() =>
                            setPasos([
                                ...pasos,
                                { numero: pasos.length + 1, descripcion: '' },
                            ])
                        }
                    >
                        <Text style={estilos.textoBotonSecundario}>
                            + Agregar paso
                        </Text>
                    </Pressable>
                </View>

                <Pressable
                    style={estilos.botonCrear}
                    onPress={CrearReceta}
                >
                    <Text style={estilos.textoCrear}>
                        Crear y publicar receta
                    </Text>
                </Pressable>

            </ScrollView>

            <MenuInferior />

        </View>
    );
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scroll: {
        flex: 1,
    },
    contenido: {
        padding: 20,
        gap: 20,
        paddingBottom: 110,
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    campo: {
        gap: 8,
    },
    etiqueta: {
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    selector: {
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 10,
        overflow: 'hidden',
    },
    seccion: {
        gap: 12,
    },
    subtitulo: {
        fontSize: 21,
        fontWeight: 'bold',
    },
    descripcion: {
        fontSize: 14,
        color: '#666666',
    },
    tarjeta: {
        padding: 14,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 10,
        gap: 12,
    },
    botonSecundario: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#eeeeee',
        alignItems: 'center',
    },
    textoBotonSecundario: {
        fontSize: 15,
        fontWeight: '600',
    },
    botonEliminar: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#ffdddd',
        alignItems: 'center',
    },
    textoEliminar: {
        color: '#bb2222',
        fontWeight: '600',
    },
    deshabilitado: {
        opacity: 0.4,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    imagen: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    botonCrear: {
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#222222',
        alignItems: 'center',
    },
    textoCrear: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
