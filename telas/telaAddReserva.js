import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking,TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';


import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";



export default function telaAddReserva({ route, navigation }){
	const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

	const [nome, setNome] = React.useState('');
	const [preço, setpreço] = React.useState('');
	const [inicioReserva, setinicioReserva] = React.useState(new Date(2021, 0, 1, 15, 0, 0));
	const [fimReserva, setfimReserva] = React.useState(new Date(2021, 0, 1, 15, 0, 0));
	const [visible, setVisible] = React.useState(false);
	const [visible2, setVisible2] = React.useState(false);
	const [visibleDialog, setVisibleDialog] = React.useState(false);
	const [visibleDialog2, setVisibleDialog2] = React.useState(false);
	const userId = firebase.auth().currentUser.uid;
	 	
	let id = route.params.id, url = route.params.urlImg;
	
	const [loading, setLoading] = React.useState(true);
	const [info, setInfo] = React.useState([]);
	
	useEffect(() => {
		
		async function getInfo(){
			
			let doc = await firebase
			.firestore()
			.collection('quartos')
			.doc(id)
			.get();
			
			if(doc.exists){
				setLoading(false);
				setInfo(doc.data());
			}
		}
		
		getInfo();
		
	}, []);
	
	function onChange(event, selectedDate){
		
		const currentDate = selectedDate || inicioReserva;
		setVisible(false);
		setinicioReserva(currentDate);
		
	};
	function onChange2(event, selectedDate){
		
		const currentDate = selectedDate || fimReserva;
		setVisible2(false);
		setfimReserva(currentDate);
		
	};
	
	function geradorDeId(length) {
		
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() *  charactersLength));
	    }
		return result;
		
	}
	
	function salvar(){
		
		let strHora = inicioReserva.getDate() + '/' + String(inicioReserva.getMonth()+ 1) +'/' + inicioReserva.getFullYear(); 
		let strFim= fimReserva.getDate() + '/' + String(fimReserva.getMonth()+ 1) +'/' + fimReserva.getFullYear();
		let nome = info.nome;
		let preço = info.preço;
		let urlImg = info.urlImg;
let idQuarto =info.id;
		let n = new Date();
        let dateTime = n.getFullYear() + '_' + (n.getMonth() + 1) + '_' + n.getDate() + '_' +
            n.getHours() + '_' + n.getMinutes() + '_' + n.getSeconds();

		firebase
		.firestore()
		.collection('users')
		.doc(userId)
		.collection('reservas')
		.doc(dateTime)
		.set({
			idee:id,
			urlImg: url,
			nome:nome,
			preço:preço,
			inicioReserva: strHora,
			fimReserva: strFim,
		}).then(() => {
			setVisibleDialog(true);
			setVisibleDialog2(true);
		});
		
	}
	function a(){
		navigation.goBack();
		setVisibleDialog(false);
	}
	
	return(
		<View style={styles.container}>
			
			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15, marginTop: 15, marginLeft:15, marginRight:15}}>
				<Text>Data do inicio da reserva: </Text>
				<Button onPress={() => setVisible(true)}>Selecionar</Button>
				{visible && <DateTimePicker
					value={inicioReserva}
					mode={'date'}
					display="default"
					onChange={onChange}
				/>}
				</View>
			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15, marginTop: 15, marginLeft:15, marginRight:15}}>
				<Text>Data do fim da reserva: </Text>
				<Button onPress={() => setVisible2(true)}>Selecionar</Button>
				{visible2 && <DateTimePicker
					value={fimReserva}
					mode={'date'}
					display="default"
					onChange={onChange2}
				/>}
			</View>
			<Button mode='contained' style={{marginTop: 15, marginBottom: 15}} onPress={() =>salvar()}>salvar</Button>
			<Button mode='contained' style={{marginTop: 15, marginBottom: 15}} onPress={() => navigation.goBack()}>voltar</Button>
			<Portal>
				<Dialog visible={visibleDialog} dismissable={true}>
			
					<Dialog.Content>
						<Paragraph>Item salvo com sucesso!</Paragraph>
						<Button onPress={() => a() }>Voltar</Button>
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