import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking,TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';


import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";

import placeholder from "./assets/placeholder.png"

export default function telaAddQuarto({ navigation }){
const [image, setImage] = useState(null);
	const [nome, setNome] = useState('');
	const [desc, setDesc] = useState('');
	const [preço, setPreço] = useState('');
	const [visibleDialog, setVisibleDialog] = useState(false);
	const [visibleMenu, setVisibleMenu] = useState(false);
	const [categoria, setCategoria] = useState('praia');

	useEffect(() => {

		async function getPermissions(){
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				navigation.goBack();
			}
		}
		
		getPermissions();
	});

	const pickImage = async () => {

		let result = await ImagePicker.launchImageLibraryAsync({
		  	mediaTypes: ImagePicker.MediaTypeOptions.All,
		 	quality: 1,
		});
	
		if (!result.cancelled) {
		  	setImage(result.uri);
		}
	};

	function verificarEntradas(){
		return(image !== null && nome !== '' && desc !== '' && preço !== '');
	}

	async function salvar(){
		setVisibleDialog(true);

		let i = await fetch(image);
		let file = await i.blob();
		let n = new Date();
        let dateTime = n.getFullYear() + '_' + (n.getMonth() + 1) + '_' + n.getDate() + '_' +
            n.getHours() + '_' + n.getMinutes() + '_' + n.getSeconds();
		let path = 'images/' + dateTime;
		
		firebase.storage().ref()
			.child(path)
			.put(file)
			.then((snapshot) => {
				snapshot.ref.getDownloadURL().then((u) => {
					
					firebase.firestore()
						.collection('quartos')
						.doc(dateTime)
						.set({
							id:dateTime,
							nome: nome,
							descrição: desc,
							preço: preço,
							categoria: categoria,
							urlImg: u,
							path: path
						})
				})
			})
		
		setVisibleDialog(false);
		navigation.goBack();
	}

	return(
		<View style={styles.container}>
			<TouchableOpacity onPress={() => pickImage()}>
				<Image source={image ? { uri: image } : placeholder} resizeMode="contain" style={{ width: 100, height: 100 }} />
			</TouchableOpacity>
			<TextInput 
				style={styles.txtInput} 
				placeholder='Nome do Quarto' 
				onChangeText={setNome} 
				value={nome}
				underlineColor='#d4161d'
			/>
			<TextInput
				style={styles.inputBox}
				underlineColor='#d4161d'
				multiline={true}
				numberOfLines={6}
				onChangeText={(text) => setDesc(text)}
				value={desc}
				placeholder="Descrição do quarto"
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
				<Menu.Item onPress={() => {setCategoria('campo'); setVisibleMenu(false)}} title="Campo" />
				<Menu.Item onPress={() => {setCategoria('praia'); setVisibleMenu(false)}} title="Praia" />
			</Menu>
			<Button 
				mode='contained' 
				onPress={() => salvar()}
				disabled={!verificarEntradas()}
				style={{
					backgroundColor: verificarEntradas() ? 'blue' : 'gray',
				}}
			>
				Salvar
			</Button>
			<Portal>
				<Dialog visible={visibleDialog} dismissable={false}>
					<Dialog.Content>
						<ActivityIndicator size='large' color="#545454"/>
						<Paragraph>Salvando Quarto...</Paragraph>
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