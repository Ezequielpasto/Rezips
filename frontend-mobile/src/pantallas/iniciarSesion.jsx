import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';

export default function IniciarSesion() {
    const router = useRouter();

    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

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

        console.log('Intentando conectar con el servidor');

        try {
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

            console.log('Respuesta del servidor:', respuesta.status);

            const datos = await respuesta.json();
            console.log('Datos recibidos:', datos);

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
        }
    }

    return (
        <View style={estilos.contenedor}>
            <Text style={estilos.titulo}>
                Bienvenido a Recips
            </Text>

            <View style={estilos.formulario}>
                <TextInput
                    style={estilos.input}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={correo}
                    onChangeText={setCorreo}
                />

                <TextInput
                    style={estilos.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={contraseña}
                    onChangeText={setContraseña}
                />

                <Pressable style={estilos.boton} onPress={IniciarSesionUsuario}>
                    <Text style={estilos.textoBoton}>
                        Iniciar sesión
                    </Text>
                </Pressable>
            </View>

            <View style={estilos.registro}>
                <Text>¿No tienes una cuenta? </Text>

                <Pressable onPress={() => router.push('/registrarse')}>
                    <Text style={estilos.enlace}>Registrarse</Text>
                </Pressable>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
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