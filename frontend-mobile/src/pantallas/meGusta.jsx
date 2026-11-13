import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search } from 'lucide-react-native';

import API from '../config/api';
import ListaRecetas from '../componentes/listaRecetas';
import MenuInferior from '../componentes/menuInferior';

export default function MeGusta() {
    const [recetas, setRecetas] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        async function ObtenerRecetas() {
            try {
                const usuarioJSON = await AsyncStorage.getItem('usuario');

                if (!usuarioJSON) return;

                const usuario = JSON.parse(usuarioJSON);

                const respuesta = await fetch(`${API}/recetas`);

                if (!respuesta.ok) {
                    throw new Error('No se pudieron obtener las recetas');
                }

                const datos = await respuesta.json();

                const recetasMeGusta = datos.filter((receta) =>
                    (receta.meGusta || []).includes(usuario.correo)
                );

                setRecetas(recetasMeGusta);

            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudieron cargar tus recetas');
            }
        }

        ObtenerRecetas();
    }, []);

    
    const recetasFiltradas = recetas.filter((receta) => {
        const texto = busqueda.toLowerCase().trim();

        if (texto === '') {
            return true;
        }

        const coincideNombre = receta.nombre?.toLowerCase()
            .includes(texto);

        const ingredientesBuscados = texto
            .split(',')
            .map((ingrediente) => ingrediente.trim())
            .filter((ingrediente) => ingrediente !== '');

        const coincideIngredientes = ingredientesBuscados.every((buscado) =>
            (receta.ingredientes || []).some((ingrediente) =>
                ingrediente.nombre.toLowerCase().includes(buscado)
            )
        );

        return coincideNombre || coincideIngredientes;
    });


    return (
        <View style={estilos.pantalla}>
            <View style={estilos.encabezado}>
                <Text style={estilos.titulo}>Mis Me gusta</Text>

                <View style={estilos.buscador}>
                    <Search size={20} color="#777" />

                    <TextInput
                        style={estilos.input}
                        placeholder="Buscar recetas o ingredientes"
                        value={busqueda}
                        onChangeText={setBusqueda}
                    />
                </View>
            </View>

            <View style={estilos.lista}>
                <ListaRecetas recetas={recetasFiltradas} />
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

    encabezado: {
        padding: 20,
        gap: 18
    },

    titulo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#222'
    },

    buscador: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
        gap: 10
    },

    input: {
        flex: 1,
        fontSize: 14
    },

    lista: {
        flex: 1,
        paddingHorizontal: 20
    }
});