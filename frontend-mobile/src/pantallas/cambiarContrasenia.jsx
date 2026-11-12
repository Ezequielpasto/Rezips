
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';
import MenuInferior from '../componentes/menuInferior';

export default function CambiarContraseña() {
    const router = useRouter();

    const [contraseñaActual, setContraseñaActual] = useState('');
    const [contraseñaNueva, setContraseñaNueva] = useState('');
    const [repetirContraseña, setRepetirContraseña] = useState('');
    const [cargando, setCargando] = useState(false);

    async function GuardarCambios() {
        if (!contraseñaActual || !contraseñaNueva || !repetirContraseña) {
            Alert.alert('Atención', 'Completá todos los campos');
            return;
        }

        if (contraseñaNueva.length < 6) {
            Alert.alert('Atención', 'La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (contraseñaNueva !== repetirContraseña) {
            Alert.alert('Atención', 'Las contraseñas nuevas no coinciden');
            return;
        }

        try {
            setCargando(true);

            const usuarioJSON = await AsyncStorage.getItem('usuario');

            if (!usuarioJSON) {
                throw new Error('No se encontró el usuario');
            }

            const usuario = JSON.parse(usuarioJSON);

            const respuesta = await fetch(
                `${API}/usuarios/${usuario.id_usuario}/contrasenia`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contrasenaActual: contraseñaActual,
                        contrasenaNueva: contraseñaNueva
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo cambiar la contraseña');
            }

            Alert.alert(
                'Listo',
                'Tu contraseña se cambió correctamente',
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
            <View style={estilos.contenido}>
                <Text style={estilos.titulo}>Cambiar contraseña</Text>
                <Text style={estilos.descripcion}>
                    Ingresá tu contraseña actual y elegí una nueva.
                </Text>

                <Text style={estilos.etiqueta}>Contraseña actual</Text>
                <TextInput
                    style={estilos.input}
                    value={contraseñaActual}
                    onChangeText={setContraseñaActual}
                    placeholder="Contraseña actual"
                    secureTextEntry
                />

                <Text style={estilos.etiqueta}>Nueva contraseña</Text>
                <TextInput
                    style={estilos.input}
                    value={contraseñaNueva}
                    onChangeText={setContraseñaNueva}
                    placeholder="Nueva contraseña"
                    secureTextEntry
                />

                <Text style={estilos.etiqueta}>Repetir nueva contraseña</Text>
                <TextInput
                    style={estilos.input}
                    value={repetirContraseña}
                    onChangeText={setRepetirContraseña}
                    placeholder="Repetir contraseña"
                    secureTextEntry
                />

                <Pressable
                    style={[estilos.boton, cargando && estilos.deshabilitado]}
                    onPress={GuardarCambios}
                    disabled={cargando}
                >
                    <Text style={estilos.textoBoton}>
                        {cargando ? 'Guardando...' : 'Cambiar contraseña'}
                    </Text>
                </Pressable>

                <Pressable
                    style={estilos.botonCancelar}
                    onPress={() => router.back()}
                >
                    <Text style={estilos.textoCancelar}>Cancelar</Text>
                </Pressable>
            </View>

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
        padding: 22
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8
    },
    descripcion: {
        color: '#777',
        fontSize: 14,
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
        height: 50,
        backgroundColor: '#222',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    deshabilitado: {
        opacity: 0.5
    },
    textoBoton: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },
    botonCancelar: {
        alignItems: 'center',
        padding: 15
    },
    textoCancelar: {
        color: '#666'
    }
});
