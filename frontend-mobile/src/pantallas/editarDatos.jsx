
import { useState, useCallback } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView, Image } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import API from '../config/api'
import MenuInferior from '../componentes/menuInferior'

export default function EditarDatos() {
    const router = useRouter()

    const [usuario, setUsuario] = useState(null)
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState('')
    const [imagenPerfil, setImagenPerfil] = useState(null)
    const [nuevaImagen, setNuevaImagen] = useState(null)
    const [cargando, setCargando] = useState(false)

    useFocusEffect(
        useCallback(() => {
            async function ObtenerUsuario() {
                try {
                    const datos = await AsyncStorage.getItem('usuario')

                    if (!datos) return

                    const usuarioActual = JSON.parse(datos)

                    const respuesta = await fetch(
                        `${API}/usuarios/${usuarioActual.id_usuario}`
                    )

                    if (!respuesta.ok) {
                        throw new Error('No se pudieron obtener los datos')
                    }

                    const datosUsuario = await respuesta.json()

                    setUsuario(datosUsuario)
                    setNombre(datosUsuario.nombre || '')
                    setApellido(datosUsuario.apellido || '')
                    setFechaNacimiento(
                        datosUsuario.fecha_nacimiento
                            ? datosUsuario.fecha_nacimiento.substring(0, 10)
                            : ''
                    )
                    setImagenPerfil(datosUsuario.imagen_perfil || null)
                    setNuevaImagen(null)

                } catch (error) {
                    console.error(error)
                    Alert.alert('Error', 'No se pudieron cargar tus datos')
                }
            }

            ObtenerUsuario()
        }, [])
    )

    // Elegir cómo cambiar la foto
    function ElegirImagen() {
        Alert.alert(
            'Foto de perfil',
            '¿Cómo querés agregar la foto?',
            [
                {
                    text: 'Tomar foto',
                    onPress: TomarFoto
                },
                {
                    text: 'Elegir de galería',
                    onPress: SeleccionarGaleria
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        )
    }

    // Tomar foto con la cámara
    async function TomarFoto() {
        try {
            const permiso = await ImagePicker.requestCameraPermissionsAsync()

            if (!permiso.granted) {
                Alert.alert(
                    'Permiso necesario',
                    'Necesitamos permiso para acceder a la cámara.'
                )
                return
            }

            const resultado = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
                base64: true
            })

            if (resultado.canceled) return

            GuardarImagen(resultado.assets[0])

        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'No se pudo abrir la cámara')
        }
    }

    // Seleccionar foto de la galería
    async function SeleccionarGaleria() {
        try {
            const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (!permiso.granted) {
                Alert.alert(
                    'Permiso necesario',
                    'Necesitamos permiso para acceder a tus fotos.'
                )
                return
            }

            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
                base64: true
            })

            if (resultado.canceled) return

            GuardarImagen(resultado.assets[0])

        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'No se pudo seleccionar la imagen')
        }
    }

    // Guardar imagen seleccionada
    function GuardarImagen(imagenSeleccionada) {
        const imagenBase64 = imagenSeleccionada.base64

        if (!imagenBase64) {
            Alert.alert('Error', 'No se pudo cargar la imagen')
            return
        }

        const tipo = imagenSeleccionada.mimeType || 'image/jpeg'

        setNuevaImagen(`data:${tipo};base64,${imagenBase64}`)
    }

    // Guardar cambios
    async function GuardarCambios() {
        if (!nombre.trim()) {
            Alert.alert('Atención', 'El nombre es obligatorio')
            return
        }

        if (!usuario) return

        try {
            setCargando(true)

            // Actualizar los datos personales
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
            )

            const datos = await respuesta.json()

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudieron guardar los cambios')
            }

            let usuarioActualizado = {
                ...usuario,
                ...datos.usuario
            }

            // Actualizar la foto solamente si se seleccionó una nueva
            if (nuevaImagen) {
                const respuestaImagen = await fetch(
                    `${API}/usuarios/${usuario.id_usuario}/imagen`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            imagen_perfil: nuevaImagen
                        })
                    }
                )

                const datosImagen = await respuestaImagen.json()

                if (!respuestaImagen.ok) {
                    throw new Error(
                        datosImagen.mensaje || 'No se pudo actualizar la foto'
                    )
                }

                usuarioActualizado = {
                    ...usuarioActualizado,
                    ...datosImagen.usuario
                }
            }

            // Actualizar los datos guardados en el dispositivo
            await AsyncStorage.setItem(
                'usuario',
                JSON.stringify(usuarioActualizado)
            )

            setUsuario(usuarioActualizado)
            setImagenPerfil(usuarioActualizado.imagen_perfil || null)
            setNuevaImagen(null)

            Alert.alert(
                'Listo',
                'Tus datos se actualizaron correctamente',
                [{ text: 'Aceptar', onPress: () => router.back() }]
            )

        } catch (error) {
            console.error(error)
            Alert.alert('Error', error.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <View style={estilos.pantalla}>
            <ScrollView contentContainerStyle={estilos.contenido}>
                <Text style={estilos.titulo}>Editar datos personales</Text>

                <Text style={estilos.descripcion}>
                    Modificá los datos de tu cuenta.
                </Text>

                <Pressable
                    style={estilos.contenedorFoto}
                    onPress={ElegirImagen}
                >
                    {nuevaImagen || imagenPerfil ? (
                        <Image
                            source={{ uri: nuevaImagen || imagenPerfil }}
                            style={estilos.foto}
                        />
                    ) : (
                        <View style={estilos.fotoVacia}>
                            <Text style={estilos.textoFotoVacia}>+</Text>
                        </View>
                    )}

                    <Text style={estilos.textoCambiarFoto}>
                        Cambiar foto de perfil
                    </Text>
                </Pressable>

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
    )
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#fff'
    },
    contenido: {
        padding: 22,
        paddingTop: 50,
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
        marginBottom: 25
    },
    contenedorFoto: {
        alignItems: 'center',
        marginBottom: 30
    },
    foto: {
        width: 115,
        height: 115,
        borderRadius: 60,
        backgroundColor: '#eee'
    },
    fotoVacia: {
        width: 115,
        height: 115,
        borderRadius: 60,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textoFotoVacia: {
        fontSize: 40,
        color: '#777'
    },
    textoCambiarFoto: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        marginTop: 10
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
})
