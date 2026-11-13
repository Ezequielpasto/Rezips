
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react-native';

export default function MenuSuperior({
    busqueda = '',
    onBuscar,
    categorias = [],
    categoriaSeleccionada = '',
    onCategoriaChange,
    calificacionMinima = 0,
    onCalificacionChange
}) {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    return (
        <View style={estilos.superior}>
            <Text style={estilos.logo}>Recips</Text>

            <View style={estilos.filaBuscador}>
                <View style={estilos.buscador}>
                    <Search size={19} color="#777" />

                    <TextInput
                        style={estilos.input}
                        placeholder="Buscar por nombre o ingredientes"
                        value={busqueda}
                        onChangeText={onBuscar}
                        autoCapitalize="none"
                    />
                </View>

                <Pressable
                    style={estilos.botonFiltros}
                    onPress={() => setMostrarFiltros(!mostrarFiltros)}
                >
                    <SlidersHorizontal size={19} color="#333" />
                    <Text style={estilos.textoFiltros}>Filtros</Text>
                    <ChevronDown size={15} color="#333" />
                </Pressable>
            </View>

            {mostrarFiltros && (
                <View style={estilos.panelFiltros}>
                    <Text style={estilos.tituloFiltro}>Categoría</Text>

                    <View style={estilos.opciones}>
                        <Pressable
                            style={[
                                estilos.opcion,
                                !categoriaSeleccionada && estilos.opcionActiva
                            ]}
                            onPress={() => onCategoriaChange?.('')}
                        >
                            <Text style={estilos.textoOpcion}>Todas</Text>
                        </Pressable>

                        {categorias.map((categoria) => (
                            <Pressable
                                key={categoria.id_categoria}
                                style={[
                                    estilos.opcion,
                                    categoriaSeleccionada === categoria.nombre &&
                                    estilos.opcionActiva
                                ]}
                                onPress={() =>
                                    onCategoriaChange?.(categoria.nombre)
                                }
                            >
                                <Text style={estilos.textoOpcion}>
                                    {categoria.nombre}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={estilos.tituloFiltro}>
                        Calificación mínima
                    </Text>

                    <View style={estilos.opciones}>
                        {[0, 5, 4, 3, 2, 1].map((valor) => (
                            <Pressable
                                key={valor}
                                style={[
                                    estilos.opcion,
                                    Number(calificacionMinima) === valor &&
                                    estilos.opcionActiva
                                ]}
                                onPress={() => onCalificacionChange?.(valor)}
                            >
                                <Text style={estilos.textoOpcion}>
                                    {valor === 0 ? 'Todas' : `${valor} ★`}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

const estilos = StyleSheet.create({
    superior: {
        width: '100%',
        padding: 20,
        gap: 15
    },
    logo: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    filaBuscador: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    buscador: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        gap: 8
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 13
    },
    botonFiltros: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        padding: 12
    },
    textoFiltros: {
        fontSize: 13,
        color: '#333'
    },
    panelFiltros: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: 10,
        padding: 15,
        gap: 12
    },
    tituloFiltro: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
    },
    opciones: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    opcion: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f2f2f2'
    },
    opcionActiva: {
        backgroundColor: '#dcebdc',
        borderWidth: 1,
        borderColor: '#80a880'
    },
    textoOpcion: {
        fontSize: 12,
        color: '#333'
    }
});
