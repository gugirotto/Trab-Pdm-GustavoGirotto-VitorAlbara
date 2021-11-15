import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking, TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider, IconButton } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import telaAddQuarto from "../telas/telaAddQuarto.js";

import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";

import { logout } from "../firebase/firebaseMethods.js";

import logo from "./assets/logo.png";
var count = 0;


export default function telaReserva({ navigation }) {

	function geradorDeId(length) {

		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;

	}

	const [hoteis, setHoteis] = React.useState([]);
	const [ids, setIds] = React.useState([]);
	const [arrImagens, setArrImagens] = React.useState([]);
	const [loading1, setLoading1] = React.useState(true);
	const [loading2, setLoading2] = React.useState(true);
	const [visible, setVisible] = React.useState(false);
	const userId = firebase.auth().currentUser.uid;
	const onDismissSnackBar = () => setVisible(false);
	const [refreshDummy, setRefreshDummy] = React.useState(0);
	const [visibleDialog, setVisibleDialog] = useState(false);
	var storage = firebase.storage();

	useEffect(() => {

		async function getHoteis() {

			let doc = await firebase
				.firestore()
				.collection('quartos')
				.onSnapshot((query) => {

					const list = [], ids = [];

					query.forEach((doc) => {
						list.push(doc.data());
						ids.push(doc.id);
					})

					setHoteis(list);
					setIds(ids);
					setLoading1(false);
				})
		}

		getHoteis();

		async function getImagemHoteis() {

			const imageRefs = await firebase.storage().ref().listAll();
			const urls = await Promise.all(imageRefs.items.map((ref) => ref.getDownloadURL()));
			setArrImagens(urls);
			setLoading2(false);

		}

		getImagemHoteis();

		
		async function getQntdReserv() {

			let doc = await firebase
				.firestore()
				.collection('users')
				.doc(userId)
				.collection('favoritos')
				.get()
				.then((query) => {

					query.forEach((doc) => {
						count = count + 1;
					})

				})

		}

		getQntdReserv();

	}, []);
	function deleteQuarto(id, path) {

		setVisibleDialog(true);

		firebase.storage().ref()
			.child(path)
			.delete()
			.then(() => {
				firebase.firestore()
					.collection('quartos')
					.doc(id)
					.delete()
			})

		setVisibleDialog(false);
	}


	function favoritar(p,index) {

		let str = 'Q' + String(count + 1).padStart(3, '0');

		firebase
			.firestore()
			.collection('users')
			.doc(userId)
			.collection('favoritos')
			.doc(geradorDeId(8))
			.set({
				
				nome: p.nome,
				preço: p.preço,
				categoria: p.categoria,
				urlImg: p.urlImg,
			});

		setVisible(true);
		count = count + 1;

	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" hidden={false} backgroundColor="#7e07ad" />
			<ScrollView style={{ width: Dimensions.get('window').width }} contentContainerStyle={styles.containerScroll}>
				{loading1 || loading2 && <>
					<ActivityIndicator size='large' color="#545454" />
					<Text>Carregando...</Text>
				</>}
				{!loading1 && hoteis.map((p, index) => {
					var preçoDouble = parseFloat(p.preço)
					return (
						<Card style={styles.cardProduto} key={index}>
							<Card.Content>
								<Title>{p.nome} - {'R$' + preçoDouble.toFixed(2)}</Title>
							</Card.Content>
							<Card.Cover source={{ uri: p.urlImg }} style={{ width: 0.9 * Dimensions.get('window').width }} />
							<Card.Actions>
								<View style={{ flex: 0.7, alignItems: 'flex-start' }}>
									<Button color='#00bfff' onPress={() => navigation.navigate('Detalhes', { id: ids[index], urlImg: p.urlImg })}>Detalhes</Button>
									<Button color='#00bfff' onPress={() => navigation.navigate('Reservar', { id: ids[index], urlImg: p.urlImg })}>Reservar</Button>
									<Button color='#00bfff' onPress={() => favoritar(index)}>Favoritar</Button>
								</View>
								<View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
									<IconButton icon="pencil" color="#4592a0" size={25} onPress={() => navigation.navigate("AtualizarQuarto", { update: true, id: ids[index], obj: p })}></IconButton>
									<IconButton icon="delete" color="#d4161d" size={25} onPress={() => deleteQuarto(ids[index], p.path)}></IconButton>
									
								</View>
							</Card.Actions>
						</Card>
					);
				})}
			</ScrollView>
			<FAB
				style={styles.fab}
				onPress={() => navigation.navigate("AddQuarto")}
				icon="plus"
			/>
			<Snackbar
				visible={visible}
				onDismiss={onDismissSnackBar}>
				Quarto adicionado com sucesso!
			</Snackbar>
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