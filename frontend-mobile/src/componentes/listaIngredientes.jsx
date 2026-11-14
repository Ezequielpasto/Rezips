
import { View, Text, StyleSheet } from 'react-native'
import unidades from '../datos/unidades'

export default function ListaIngredientes({ ingredientes }) {
    return (
        <View style={estilos.lista}>
            {ingredientes.map((ingrediente, indice) => {
                const unidad = unidades.find(
                    u => u.valor === ingrediente.unidad
                )

                const textoUnidad = !unidad
                    ? `${ingrediente.cantidad} ${ingrediente.unidad}`
                    : unidad.sinCantidad
                        ? unidad.singular
                        : `${ingrediente.cantidad} ${
                            Number(ingrediente.cantidad) === 1
                                ? unidad.singular
                                : unidad.plural
                        }`

                return (
                    <View
                        key={ingrediente.id_ingrediente ?? indice}
                        style={estilos.ingrediente}
                    >
                        <Text style={estilos.nombre}>
                            {ingrediente.nombre}
                        </Text>

                        <Text style={estilos.cantidad}>
                            {textoUnidad}
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}

const estilos = StyleSheet.create({
    lista: {
        gap: 12
    },
    ingrediente: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },
    nombre: {
        fontSize: 16,
        fontWeight: '500'
    },
    cantidad: {
        fontSize: 16,
        color: '#555555'
    }
})
