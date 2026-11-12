
import { View, Text, StyleSheet } from 'react-native';

export default function ListaIngredientes({ ingredientes }) {
    return (
        <View style={estilos.lista}>
            {ingredientes.map((ingrediente, index) => (
                <View key={ingrediente.id_ingrediente ?? index} style={estilos.ingrediente}>
                    <Text style={estilos.nombre}>
                        {ingrediente.nombre}
                    </Text>

                    <Text style={estilos.cantidad}>
                        {ingrediente.cantidad} {ingrediente.unidad}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    lista: {
        gap: 12,
    },
    ingrediente: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    nombre: {
        fontSize: 16,
        fontWeight: '500',
    },
    cantidad: {
        fontSize: 16,
        color: '#555555',
    },
});
