
import { View, Text, StyleSheet } from 'react-native';

export default function ListaPasos({ pasos }) {
    return (
        <View style={estilos.lista}>
            {pasos.map((paso, index) => (
                <View key={paso.id_paso ?? index} style={estilos.paso}>
                    <View style={estilos.numero}>
                        <Text style={estilos.textoNumero}>
                            {paso.numero}
                        </Text>
                    </View>

                    <Text style={estilos.descripcion}>
                        {paso.descripcion}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    lista: {
        gap: 15,
    },
    paso: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 10,
    },
    numero: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoNumero: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    descripcion: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
    },
});
