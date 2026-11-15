
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';
import Logo from '../../assets/logo.png';

export default function IniciarSesion() {
    const router = useRouter();

    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [cargando, setCargando] = useState(false);

    function ValidarInicioSesion() {
        if (correo.trim() === '' || contraseña === '') {
            Alert.alert('Atención', 'Todos los campos son obligatorios');
            return false;
        }

        return true;
    }

    async function IniciarSesionUsuario() {
        if (!ValidarInicioSesion()) {
            return;
        }

        try {
            setCargando(true);

            const respuesta = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo,
                    contrasena: contraseña,
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                Alert.alert('Error', datos.mensaje || 'Correo y/o contraseña incorrectos');
                return;
            }

            await AsyncStorage.setItem('usuario', JSON.stringify(datos.usuario));

            Alert.alert('Éxito', 'Inicio de sesión exitoso');

            router.replace('/principal');

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        } finally {
            setCargando(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={estilos.contenedor}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={estilos.contenido}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Image
                    source={Logo}
                    style={estilos.logo}
                    resizeMode="contain"
                />

                <Text style={estilos.titulo}>
                    Bienvenido a Rezips
                </Text>

                <View style={estilos.formulario}>
                    <TextInput
                        style={estilos.input}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={correo}
                        onChangeText={setCorreo}
                        editable={!cargando}
                    />

                    <TextInput
                        style={estilos.input}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={contraseña}
                        onChangeText={setContraseña}
                        editable={!cargando}
                    />

                    <Pressable
                        style={[estilos.boton, cargando && estilos.botonCargando]}
                        onPress={IniciarSesionUsuario}
                        disabled={cargando}
                    >
                        <Text style={estilos.textoBoton}>
                            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </Text>
                    </Pressable>
                </View>

                <View style={estilos.registro}>
                    <Text>¿No tienes una cuenta? </Text>

                    <Pressable
                        onPress={() => router.push('/registrarse')}
                        disabled={cargando}
                    >
                        <Text style={estilos.enlace}>Registrarse</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
    },
    contenido: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    logo: {
        width: 200,
        height: 100,
        marginBottom: 15,
    },
    titulo: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    formulario: {
        width: '100%',
        gap: 18,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
    },
    boton: {
        backgroundColor: '#bc6c16',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    botonCargando: {
        backgroundColor: '#d69a5b',
        opacity: 0.8,
    },
    contenidoBoton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    textoBoton: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registro: {
        flexDirection: 'row',
        marginTop: 25,
    },
    enlace: {
        color: '#208AEF',
        fontWeight: 'bold',
    },
});
