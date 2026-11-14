
import { View, StyleSheet, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, usePathname } from 'expo-router'
import { Home, CirclePlus, UserRound } from 'lucide-react-native'

export default function MenuInferior() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const pathname = usePathname()

    const colorActivo = '#030303'
    const colorInactivo = '#777777'

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
                    <Home
                        size={26}
                        color={pathname === '/principal' ? colorActivo : colorInactivo}
                        strokeWidth={pathname === '/principal' ? 2.5 : 2}
                    />
                </Pressable>

                <Pressable
                    style={estilos.opcion}
                    onPress={() => router.push('/crearReceta')}
                >
                    <CirclePlus
                        size={26}
                        color={pathname === '/crearReceta' ? colorActivo : colorInactivo}
                        strokeWidth={pathname === '/crearReceta' ? 2.5 : 2}
                    />
                </Pressable>

                <Pressable
                    style={estilos.opcion}
                    onPress={() => router.push('/perfil')}
                >
                    <UserRound
                        size={26}
                        color={pathname === '/perfil' ? colorActivo : colorInactivo}
                        strokeWidth={pathname === '/perfil' ? 2.5 : 2}
                    />
                </Pressable>

            </View>
        </View>
    )
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
    }
})
