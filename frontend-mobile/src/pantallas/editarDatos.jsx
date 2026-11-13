
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';
import MenuInferior from '../componentes/menuInferior';

export default function EditarDatos() {
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [cargando, setCargando] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function ObtenerUsuario() {
                try {
                    const datos = await AsyncStorage.getItem('usuario');

                    if (!datos) return;

                    const usuarioActual = JSON.parse(datos);

                    const respuesta = await fetch(
                        `${API}/usuarios/${usuarioActual.id_usuario}`
                    );

                    if (!respuesta.ok) {
                        throw new Error('No se pudieron obtener los datos');
                    }

                    const datosUsuario = await respuesta.json();

                    setUsuario(datosUsuario);
                    setNombre(datosUsuario.nombre || '');
                    setApellido(datosUsuario.apellido || '');
                    setFechaNacimiento(
                        datosUsuario.fecha_nacimiento
                            ? datosUsuario.fecha_nacimiento.substring(0, 10)
                            : ''
                    );

                } catch (error) {
                    console.error(error);
                    Alert.alert('Error', 'No se pudieron cargar tus datos');
                }
            }

            ObtenerUsuario();
        }, [])
    );

    async function GuardarCambios() {
        if (!nombre.trim()) {
            Alert.alert('Atención', 'El nombre es obligatorio');
            return;
        }

        try {
            setCargando(true);

            const respuesta = await fetch(
                `${API}/usuarios/${usuario.id_usuario}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        apellido: apellido.trim(),
                        fecha_nacimiento: fechaNacimiento || null
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudieron guardar los cambios');
            }

            // Actualizar los datos guardados en el dispositivo
            const usuarioActualizado = {
                ...usuario,
                ...datos.usuario
            };

            await AsyncStorage.setItem(
                'usuario',
                JSON.stringify(usuarioActualizado)
            );

            setUsuario(usuarioActualizado);

            Alert.alert(
                'Listo',
                'Tus datos se actualizaron correctamente',
                [{ text: 'Aceptar', onPress: () => router.back() }]
            );

        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <View style={estilos.pantalla}>
            <ScrollView contentContainerStyle={estilos.contenido}>
                <Text style={estilos.titulo}>Editar datos personales</Text>

                <Text style={estilos.descripcion}>
                    Modificá los datos de tu cuenta.
                </Text>

                <Text style={estilos.etiqueta}>Nombre</Text>
                <TextInput
                    style={estilos.input}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Tu nombre"
                />

                <Text style={estilos.etiqueta}>Apellido</Text>
                <TextInput
                    style={estilos.input}
                    value={apellido}
                    onChangeText={setApellido}
                    placeholder="Tu apellido"
                />

                <Text style={estilos.etiqueta}>Fecha de nacimiento</Text>
                <TextInput
                    style={estilos.input}
                    value={fechaNacimiento}
                    onChangeText={setFechaNacimiento}
                    placeholder="AAAA-MM-DD"
                />

                <Pressable
                    style={[
                        estilos.boton,
                        cargando && estilos.botonDeshabilitado
                    ]}
                    onPress={GuardarCambios}
                    disabled={cargando || !usuario}
                >
                    <Text style={estilos.textoBoton}>
                        {cargando ? 'Guardando...' : 'Guardar cambios'}
                    </Text>
                </Pressable>

                <Pressable
                    style={estilos.botonCancelar}
                    onPress={() => router.back()}
                >
                    <Text style={estilos.textoCancelar}>Cancelar</Text>
                </Pressable>
            </ScrollView>

            <MenuInferior />
        </View>
    );
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#fff'
    },
    contenido: {
        padding: 22,
        paddingBottom: 100
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8
    },
    descripcion: {
        fontSize: 14,
        color: '#777',
        marginBottom: 30
    },
    etiqueta: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 20,
        fontSize: 15
    },
    boton: {
        backgroundColor: '#222',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    botonDeshabilitado: {
        opacity: 0.5
    },
    textoBoton: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
    botonCancelar: {
        alignItems: 'center',
        padding: 15,
        marginTop: 5
    },
    textoCancelar: {
        color: '#666',
        fontSize: 14
    }
});
