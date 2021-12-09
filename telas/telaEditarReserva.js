import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking, TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider, IconButton } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import telaAddQuarto from "../telas/telaAddQuarto.js";
import * as ImagePicker from "expo-image-picker";

import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";

import { logout } from "../firebase/firebaseMethods.js";

import logo from "./assets/logo.png";

export default function telaEditarReserva({ route, navigation }) {


    const [inicioReserva, setinicioReserva] = React.useState(new Date(2021, 0, 1, 15, 0, 0));
    const [fimReserva, setfimReserva] = React.useState(new Date(2021, 0, 1, 15, 0, 0));
    const [image, setImage] = useState(route.params.obj.urlImg);
    const [categoria, setCategoria] = useState(route.params.obj.categoria);
    const [nome, setNome] = React.useState(route.params.obj.nome);
    const [path, sete] = React.useState(route.params.obj.nome);
    const [desc, setDesc] = React.useState(route.params.obj.fimReserva);
    const [preço, setPreço] = React.useState(route.params.obj.preço);
    const [visible, setVisible] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [visibleDialog2, setVisibleDialog2] = React.useState(false);
    const userId = firebase.auth().currentUser.uid;
    const [info, setInfo] = React.useState([]);
    const [changedImage, setChangedImage] = React.useState(false);
    const [visibleMenu, setVisibleMenu] = React.useState(false);
    var storage = firebase.storage();
    useEffect(() => {
        async function getPermissions() {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                navigation.goBack();
            }
        }

        getPermissions();

        getInfo();

    }, []);
    async function getInfo() {


        let doc = await firebase.firestore()
            .collection('users')
            .doc(userId)
            .collection('reservas')
            .doc(route.params.id)
            .get();

        if (doc.exists) {
            setLoading(false);
            setInfo(doc.data());
        }
    }

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            setChangedImage(true);
        }
    };

    function verificarEntradas() {
        return (image !== null && nome !== '' && categoria !== '' && fimReserva !== '' && inicioReserva !== '' && preço !== '');
    }

    function onChange(event, selectedDate) {

        const currentDate = selectedDate || inicioReserva;
        setVisible(false);
        setinicioReserva(currentDate);

    };
    function onChange2(event, selectedDate) {

        const currentDate = selectedDate || fimReserva;
        setVisible2(false);
        setfimReserva(currentDate);

    };
    async function salvar() {
        setVisibleDialog(true);
        let strHora = inicioReserva.getDate() + '/' + String(inicioReserva.getMonth() + 1) + '/' + inicioReserva.getFullYear();
        let strFim = fimReserva.getDate() + '/' + String(fimReserva.getMonth() + 1) + '/' + fimReserva.getFullYear();
        if (changedImage) {

            let i = await fetch(image);
            let file = await i.blob();
            let n = new Date();
            let dateTime = n.getFullYear() + '_' + (n.getMonth() + 1) + '_' + n.getDate() + '_' +
                n.getHours() + '_' + n.getMinutes() + '_' + n.getSeconds();
            let path =  'reserva' + userId + '/' + dateTime;

            let doc = firebase.storage().ref()
                .child(path)
                .put(file)
                .then((snapshot) => {
                    snapshot.ref.getDownloadURL().then((u) => {
                        

                        firebase.firestore()
                            .collection('users')
                            .doc(userId)
                            .collection('reservas')
                            .doc(route.params.id)
                            .set({
                                nome: nome,
                                fimReserva: strFim,
                                inicioReserva: strHora,
                                preço: preço,
                                categoria: categoria,
                                urlImg: u,
                                path: path
                            })
                            firebase.storage().ref()
                            .child(info.path)
                            .delete();


                    })
                })
        } else {
            let doc = await firebase;
            firebase
                .firestore()
                .collection('users')
                .doc(userId)
                .collection('reservas')
                .doc(route.params.id)
                .update({
                    nome: nome,
                    fimReserva: strFim,
                    inicioReserva: strHora,
                    preço: preço,
                    categoria: categoria
                }).then(() => {
                    setVisibleDialog(true);
                });
        }
    }
    function a() {
        navigation.goBack();
        setVisibleDialog(false);
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => pickImage()}>
                <Image source={image ? { uri: image } : placeholder} resizeMode="contain" style={{ width: 100, height: 100 }} />
            </TouchableOpacity>
            <TextInput
                style={styles.txtInput}
                placeholder='Nome do quarto'
                onChangeText={setNome}
                value={nome}
                underlineColor='#d4161d'
            />

            <TextInput
                style={styles.txtInput}
                placeholder='Preço do quarto'
                onChangeText={setPreço}
                value={preço}
                underlineColor='#d4161d'
                keyboardType={'numeric'}
            />
            <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={<Button mode='contained' onPress={() => setVisibleMenu(true)}>{categoria}</Button>}
            >
                <Menu.Item onPress={() => { setCategoria('praia'); setVisibleMenu(false) }} title="Praia" />
                <Menu.Item onPress={() => { setCategoria('campo'); setVisibleMenu(false) }} title="Campo" />
            </Menu>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15, marginTop: 15, marginLeft: 15, marginRight: 15 }}>
                <Text>Data do inicio da reserva: </Text>
                <Button onPress={() => setVisible(true)}>Selecionar</Button>
                {visible && <DateTimePicker
                    value={inicioReserva}
                    mode={'date'}
                    display="default"
                    onChange={onChange}
                />}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15, marginTop: 15, marginLeft: 15, marginRight: 15 }}>
                <Text>Data do fim da reserva: </Text>
                <Button onPress={() => setVisible2(true)}>Selecionar</Button>
                {visible2 && <DateTimePicker
                    value={fimReserva}
                    mode={'date'}
                    display="default"
                    onChange={onChange2}
                />}
            </View>
            <Button mode='contained' style={{ marginTop: 15, marginBottom: 15 ,backgroundColor: verificarEntradas() ? 'blue' : 'gray' }} onPress={() => salvar()} disabled={!verificarEntradas()}>salvar</Button>
            <Button mode='contained' style={{ marginTop: 15, marginBottom: 15 }} onPress={() => navigation.goBack()}>voltar</Button>
            <Portal>
                <Dialog visible={visibleDialog} dismissable={true}>

                    <Dialog.Content>
                        <Paragraph>Item salvo com sucesso!</Paragraph>
                        <Button onPress={() => a()}>Voltar</Button>
                    </Dialog.Content>

                </Dialog>
            </Portal>
        </View>
    );

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    containerDetalhes: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },

    containerScroll: {
        paddingVertical: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },

    containerScrollDetalhes: {
        justifyContent: 'center',
        padding: 10,
        marginBottom: 10
    },

    logoMenu: {
        width: 200,
        height: Math.floor(175 / 1.234636),
        marginTop: 25,
    },

    cardProduto: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 0.9 * Dimensions.get('window').width,
    },

    fab: {
        position: 'absolute',
        backgroundColor: '#d4161d',
        margin: 25,
        right: 0,
        bottom: 0,
    },

    txtInput: {
        width: 200,
        height: 40,
        color: '#545454',
        borderColor: '#545454',
        borderBottomWidth: 2,
    },

    title: {
        textAlign: 'center',
        marginBottom: 50,
        paddingHorizontal: 10
    },
});