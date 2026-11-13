
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';
import MenuInferior from '../componentes/menuInferior';

export default function CambiarCorreo() {
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [correo, setCorreo] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        async function ObtenerUsuario() {
            try {
                const datos = await AsyncStorage.getItem('usuario');

                if (datos) {
                    const usuarioActual = JSON.parse(datos);
                    setUsuario(usuarioActual);
                    setCorreo(usuarioActual.correo || '');
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudieron cargar tus datos');
            }
        }

        ObtenerUsuario();
    }, []);

    async function GuardarCambios() {
        const nuevoCorreo = correo.trim().toLowerCase();

        if (!nuevoCorreo) {
            Alert.alert('Atención', 'Ingresá un correo electrónico');
            return;
        }

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(nuevoCorreo)) {
            Alert.alert('Atención', 'Ingresá un correo electrónico válido');
            return;
        }

        if (nuevoCorreo === usuario?.correo) {
            Alert.alert('Atención', 'El correo ingresado es el mismo que ya tenés');
            return;
        }

        try {
            setCargando(true);

            const respuesta = await fetch(
                `${API}/usuarios/${usuario.id_usuario}/correo`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo: nuevoCorreo
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo cambiar el correo');
            }

            const usuarioActualizado = {
                ...usuario,
                ...datos.usuario
            };

            await AsyncStorage.setItem(
                'usuario',
                JSON.stringify(usuarioActualizado)
            );

            setUsuario(usuarioActualizado);
            setCorreo(usuarioActualizado.correo);

            Alert.alert(
                'Listo',
                'Tu correo se actualizó correctamente',
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
                <Text style={estilos.titulo}>Cambiar correo</Text>

                <Text style={estilos.descripcion}>
                    Ingresá el nuevo correo electrónico de tu cuenta.
                </Text>

                <Text style={estilos.etiqueta}>Correo electrónico</Text>

                <TextInput
                    style={estilos.input}
                    value={correo}
                    onChangeText={setCorreo}
                    placeholder="correo@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Pressable
                    style={[estilos.boton, cargando && estilos.deshabilitado]}
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
