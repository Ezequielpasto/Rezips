import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import API from '../config/api';

export default function Registrarse() {
    const router = useRouter();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

    function ValidarRegistro() {
        if (
            nombre.trim() === '' ||
            apellido.trim() === '' ||
            fechaNacimiento.trim() === '' ||
            correo.trim() === '' ||
            contraseña === ''
        ) {
            Alert.alert('Atención', 'Todos los campos son obligatorios');
            return false;
        }

        const partesFecha = fechaNacimiento.split('-');

        if (
            partesFecha.length !== 3 ||
            partesFecha.some(parte => parte.trim() === '') ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)
        ) {
            Alert.alert('Atención', 'Ingresá una fecha válida con formato AAAA-MM-DD');
            return false;
        }

        const fechaIngresada = new Date(`${fechaNacimiento}T00:00:00`);
        const hoy = new Date();

        if (Number.isNaN(fechaIngresada.getTime())) {
            Alert.alert('Atención', 'La fecha ingresada no es válida');
            return false;
        }

        const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);

        if (
            fechaIngresada.getFullYear() !== anio ||
            fechaIngresada.getMonth() !== mes - 1 ||
            fechaIngresada.getDate() !== dia
        ) {
            Alert.alert('Atención', 'La fecha ingresada no es válida');
            return false;
        }

        if (fechaIngresada > hoy) {
            Alert.alert('Atención', 'La fecha ingresada no puede ser futura');
            return false;
        }

        let edad = hoy.getFullYear() - fechaIngresada.getFullYear();

        const diferenciaMeses = hoy.getMonth() - fechaIngresada.getMonth();

        if (
            diferenciaMeses < 0 ||
            (diferenciaMeses === 0 && hoy.getDate() < fechaIngresada.getDate())
        ) {
            edad--;
        }

        if (edad < 13) {
            Alert.alert('Atención', 'Para poder registrarte debes tener al menos 13 años');
            return false;
        }

        if (contraseña.length < 8) {
            Alert.alert('Atención', 'La contraseña debe tener al menos 8 caracteres');
            return false;
        }

        return true;
    }

    async function EnviarRegistro() {
        if (!ValidarRegistro()) {
            return;
        }

        try {
            const respuesta = await fetch(`${API}/auth/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    apellido: apellido.trim(),
                    fecha_nacimiento: fechaNacimiento,
                    correo: correo.trim(),
                    contrasena: contraseña,
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                Alert.alert('Error', datos.mensaje || 'Error al registrar el usuario');
                return;
            }

            Alert.alert('Éxito', 'Cuenta creada correctamente', [
                {
                    text: 'Aceptar',
                    onPress: () => router.replace('/'),
                },
            ]);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        }
    }

    return (
        <ScrollView contentContainerStyle={estilos.contenedor}>
            <Text style={estilos.titulo}>Crea una cuenta de Recips</Text>

            <View style={estilos.formulario}>
                <View style={estilos.nombreApellido}>
                    <Text style={estilos.descripcion}>
                        Ingresa tu nombre y tu apellido
                    </Text>

                    <View style={estilos.fila}>
                        <TextInput style={estilos.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                        <TextInput style={estilos.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
                    </View>
                </View>

                <View style={estilos.campo}>
                    <Text style={estilos.descripcion}>
                        Ingresa tu fecha de nacimiento (AAAA-MM-DD)
                    </Text>

                    <TextInput
                        style={estilos.input}
                        placeholder="AAAA-MM-DD"
                        value={fechaNacimiento}
                        onChangeText={setFechaNacimiento}
                    />
                </View>

                <View style={estilos.campo}>
                    <Text style={estilos.descripcion}>
                        Ingresa tu correo electrónico
                    </Text>

                    <TextInput
                        style={estilos.input}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={correo}
                        onChangeText={setCorreo}
                    />
                </View>

                <View style={estilos.campo}>
                    <Text style={estilos.descripcion}>
                        Crea una contraseña segura
                    </Text>

                    <TextInput
                        style={estilos.input}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={contraseña}
                        onChangeText={setContraseña}
                    />
                </View>

                <Pressable onPress={EnviarRegistro} style={estilos.boton}>
                    <Text style={estilos.textoBoton}>
                        Crear cuenta
                    </Text>
                </Pressable>
            </View>

            <View style={estilos.iniciarSesion}>
                <Text>¿Ya tienes una cuenta? </Text>

                <Pressable onPress={() => router.push('/')}>
                    <Text style={estilos.enlace}>Iniciá sesión</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flexGrow: 1,
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
        gap: 22,
    },
    nombreApellido: {
        gap: 10,
    },
    fila: {
        flexDirection: 'row',
        gap: 10,
    },
    campo: {
        gap: 10,
    },
    descripcion: {
        fontSize: 15,
    },
    input: {
        flex: 1,
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
    iniciarSesion: {
        flexDirection: 'row',
        marginTop: 25,
    },
    enlace: {
        color: '#208AEF',
        fontWeight: 'bold',
    },
});