import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRound, Mail, Lock, LogOut, ChevronRight} from 'lucide-react-native';
import MenuInferior from '../componentes/menuInferior';

export default function Configuracion() {
    const router = useRouter();

    function CerrarSesion() {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que querés cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('usuario');
                            router.replace('/iniciarSesion');
                        } catch (error) {
                            console.error('Error al cerrar sesión:', error);
                            Alert.alert('Error', 'No se pudo cerrar la sesión');
                        }
                    }
                }
            ]
        );
    }

    function Opcion({ icono: Icono, titulo, descripcion, onPress, peligro }) {
        return (
            <Pressable style={estilos.opcion} onPress={onPress}>
                <View style={estilos.icono}>
                    <Icono
                        size={21}
                        color={peligro ? '#d64545' : '#333333'}
                    />
                </View>

                <View style={estilos.informacion}>
                    <Text style={[
                        estilos.tituloOpcion,
                        peligro && estilos.textoPeligro
                    ]}>
                        {titulo}
                    </Text>

                    <Text style={estilos.descripcion}>
                        {descripcion}
                    </Text>
                </View>

                <ChevronRight size={20} color="#999999" />
            </Pressable>
        );
    }

    return (
        <View style={estilos.pantalla}>
            <View style={estilos.contenido}>
                <Text style={estilos.titulo}>Configuración</Text>

                <Text style={estilos.seccion}>CUENTA</Text>

                <View style={estilos.contenedorOpciones}>
                    <Opcion
                        icono={UserRound}
                        titulo="Editar datos personales"
                        descripcion="Modificar nombre, apellido y fecha de nacimiento"
                        onPress={() => router.push('/editarDatos')}
                    />

                    <View style={estilos.divisor} />

                    <Opcion
                        icono={Mail}
                        titulo="Cambiar correo electrónico"
                        descripcion="Actualizar el correo de tu cuenta"
                        onPress={() => router.push('/cambiarCorreo')}
                    />

                    <View style={estilos.divisor} />

                    <Opcion
                        icono={Lock}
                        titulo="Cambiar contraseña"
                        descripcion="Actualizar tu contraseña"
                        onPress={() => router.push('/cambiarContrasenia')}
                    />
                </View>

                <Text style={estilos.seccion}>SESIÓN</Text>

                <View style={estilos.contenedorOpciones}>
                    <Opcion
                        icono={LogOut}
                        titulo="Cerrar sesión"
                        descripcion="Salir de tu cuenta de Recips"
                        peligro
                        onPress={CerrarSesion}
                    />
                </View>
            </View>

            <MenuInferior />
        </View>
    );
}

const estilos = StyleSheet.create({
    pantalla: {
        flex: 1,
        backgroundColor: '#ffffff'
    },

    contenido: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30
    },

    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 30
    },

    seccion: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888888',
        marginBottom: 12,
        marginTop: 10
    },

    contenedorOpciones: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 25
    },

    opcion: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 17,
        gap: 12
    },

    icono: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center'
    },

    informacion: {
        flex: 1,
        gap: 4
    },

    tituloOpcion: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333'
    },

    descripcion: {
        fontSize: 11,
        color: '#888888'
    },

    divisor: {
        height: 1,
        backgroundColor: '#eeeeee'
    },

    textoPeligro: {
        color: '#d64545'
    }
});
