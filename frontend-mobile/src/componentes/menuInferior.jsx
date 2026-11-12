
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function MenuInferior() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[
            estilos.contenedor,
            { paddingBottom: insets.bottom }
        ]}>
            <View style={estilos.menu}>

                <Pressable
                    style={estilos.opcion}
                    onPress={() => router.replace('/principal')}
                >
                    <Text style={estilos.texto}>Inicio</Text>
                </Pressable>

                <Pressable
                    style={estilos.opcion}
                    onPress={() => router.push('/crearReceta')}
                >
                    <Text style={estilos.texto}>Crear receta</Text>
                </Pressable>

                <Pressable
                    style={estilos.opcion}
                    onPress={() => router.push('/perfil')}
                >
                    <Text style={estilos.texto}>Perfil</Text>
                </Pressable>

            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        zIndex: 100,
        elevation: 10
    },
    menu: {
        height: 65,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    opcion: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    texto: {
        fontSize: 12,
        color: '#333333'
    }
});
