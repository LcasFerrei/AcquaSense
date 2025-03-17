import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const Hubfooter = () => {
    const navigation = useNavigation();
    return (
        <>
            {/* Botões fixos na parte inferior */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("dash")}>
                <Image 
                        source={require('../assets/Home.png')} 
                        style={{ width: 28, height: 28 }} 
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("dash")}>
                <Image 
                        source={require('../assets/Activity.png')} 
                        style={{ width: 28, height: 28 }} 
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.centralButton} onPress={() => navigation.navigate("SearchScreen")}>
                    <Image 
                        source={require('../assets/Search.png')} 
                        style={{ width: 100, height: 100 }} 
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("Grafic")}>
                <Image 
                        source={require('../assets/Graph.png')} 
                        style={{ width: 28, height: 28 }} 
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("UserScreen")}>
                <Image 
                        source={require('../assets/Profile.png')} 
                        style={{ width: 28, height: 28 }} 
                    />
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 70,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    bottomButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    centralButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default Hubfooter;