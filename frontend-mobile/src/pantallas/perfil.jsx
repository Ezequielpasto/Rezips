import { useRouter, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { Settings } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'

import ListaRecetas from '../componentes/listaRecetas'
import MenuInferior from '../componentes/menuInferior'
import API from '../config/api'

export default function Perfil() {
    const router = useRouter()

    const [usuario, setUsuario] = useState(null)
    const [recetas, setRecetas] = useState([])
    const [cargando, setCargando] = useState(true)

    useFocusEffect(
        useCallback(() => {
            let activo = true

            async function ObtenerDatos() {
                setCargando(true)

                try {
                    const usuarioJSON = await AsyncStorage.getItem('usuario')

                    if (!usuarioJSON || !activo) return

                    const usuarioActual = JSON.parse(usuarioJSON)

                    const respuestaUsuario = await fetch(
                        `${API}/usuarios/${usuarioActual.id_usuario}`
                    )

                    if (!respuestaUsuario.ok) {
                        throw new Error('Error al obtener los datos del usuario')
                    }

                    const datosUsuario = await respuestaUsuario.json()

                    if (activo) {
                        setUsuario(datosUsuario)
                    }

                    const respuesta = await fetch(
                        `${API}/recetas?id_usuario=${usuarioActual.id_usuario}`
                    )

                    if (!respuesta.ok) {
                        throw new Error('Error al obtener las recetas')
                    }

                    const datos = await respuesta.json()

                    if (activo) {
                        setRecetas(datos)
                        await AsyncStorage.setItem('usuario', JSON.stringify(datosUsuario))
                    }

                } catch (error) {
                    console.error('Error al actualizar el perfil:', error)
                } finally {
                    if (activo) {
                        setCargando(false)
                    }
                }
            }

            ObtenerDatos()

            return () => {
                activo = false
            }
        }, [])
    )

    const iniciales = usuario
        ? `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`
        : ''

    const encabezado = (
        <View style={estilos.datos}>
            <View style={estilos.filaSuperior}>
                <Text style={estilos.titulo}>Mi perfil</Text>

                <Pressable
                    style={estilos.botonConfiguracion}
                    onPress={() => router.push('/configuracion')}
                >
                    <Settings size={23} color="#333333" />
                </Pressable>
            </View>

            <View style={estilos.nombreCirculo}>
                {usuario?.imagen_perfil ? (
                    <Image
                        source={{ uri: usuario.imagen_perfil }}
                        style={estilos.circuloPerfil}
                    />
                ) : (
                    <View style={estilos.circuloPerfil}>
                        <Text style={estilos.iniciales}>
                            {iniciales}
                        </Text>
                    </View>
                )}

                <Text style={estilos.nombre}>
                    {usuario
                        ? `${usuario.nombre} ${usuario.apellido}`
                        : 'Mi perfil'}
                </Text>
            </View>

            {!cargando && (
                <Text style={estilos.cantidad}>
                    {recetas.length} recetas creadas
                </Text>
            )}

            <View style={estilos.botones}>
                <Pressable
                    style={estilos.boton}
                    onPress={() => router.push('/meGusta')}
                >
                    <Text style={estilos.textoBoton}>Me gusta</Text>
                </Pressable>

                <Pressable
                    style={estilos.boton}
                    onPress={() => router.push('/guardados')}
                >
                    <Text style={estilos.textoBoton}>Guardados</Text>
                </Pressable>
            </View>
        </View>
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={estilos.pantalla}>
                <View style={estilos.contenidoRecetas}>
                    <ListaRecetas
                        recetas={recetas}
                        encabezado={encabezado}
                        cargando={cargando}
                    />
                </View>
            </View>

            <MenuInferior />
        </SafeAreaView>
    )
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    contenidoRecetas: {
        flex: 1,
        width: '100%'
    },
    datos: {
        width: '100%',
        gap: 15,
        paddingVertical: 15,
    },
    filaSuperior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    titulo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#222222'
    },
    botonConfiguracion: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nombreCirculo: {
        alignItems: 'center',
        gap: 12
    },
    circuloPerfil: {
        width: 95,
        height: 95,
        borderRadius: 50,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iniciales: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333333'
    },
    nombre: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222222'
    },
    cantidad: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center'
    },
    botones: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 15,
        gap: 12
    },
    boton: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 10,
        backgroundColor: '#eeeeee',
        alignItems: 'center'
    },
    textoBoton: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222222'
    }
})
