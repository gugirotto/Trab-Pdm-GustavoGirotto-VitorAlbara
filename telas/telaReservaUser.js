import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking, TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider,IconButton} from 'react-native-paper';

import { collection, query, where } from "firebase/firestore";
import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";


export default function telaReservaUser({ route,navigation }) {
	const [refreshDummy, setRefreshDummy] = React.useState(0);
	const [ReservaUser, setReservaUser] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [visibleDialog, setVisibleDialog] = React.useState(false);
	const userId = firebase.auth().currentUser.uid;
	const [ids, setIds] = React.useState([]);
	const [hoteis, setHoteis] = React.useState([]);
	const [loading1, setLoading1] = React.useState(true);
	const [info, setInfo] = React.useState([]);


	useEffect(() => {
		
		async function getReservaUser(){
			
			let doc = await firebase
			.firestore()
			.collection('users')
			.doc(userId)
			.collection('reservas')
			.onSnapshot((query) => {
				
				const list = [] , ids = [], listee=[];
				
				
				query.forEach((doc) => {
					
					let wa= {idee: doc.data().idee}
					listee.push(wa)
					setInfo(listee);
					let text = info.toString();
					firebase.firestore()
			.collection('quartos')
			.where(firebase.firestore.FieldPath.documentId(), '==', text).get()
			liste.push(doc.data());
					
					// aqui tu faz uma segunda query do firebase que pega o nome e preço do quarto
					  // aí pra não mudar os card tu pode fazer isso:
					   let obj = {
							inicioReserva: doc.data().inicioReserva,
							fimReserva: doc.data().fimReserva,
							preço: liste.preço,
							nome: liste.nome
					   }

					  // aí colocar esse obj na lista, em vez do doc.data() */
list.push(obj);
ids.push(doc.id);

				})
				
				
				setReservaUser(list);
				setIds(ids);
				setLoading(false);
				
			});
			
		}

		getReservaUser();
		async function getImagemHoteis() {

			const imageRefs = await firebase.storage().ref().listAll();
			const urls = await Promise.all(imageRefs.items.map((ref) => ref.getDownloadURL()));
			setArrImagens(urls);
			setLoading2(false);

		}

		getImagemHoteis();
	}, [refreshDummy])
	function deletarItem(id,path) {

		setVisibleDialog(true);
		
		firebase
			.firestore()
			.collection('users')
			.doc(userId)
			.collection('reservas')
			.doc(id)
			.delete()
			.then(() => {
				setVisibleDialog(false);
				setRefreshDummy(refreshDummy + 1);
			}).catch((e) => {
				alert(e);
			});
	
	}



	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" hidden={false} backgroundColor="#7e07ad" />
			<ScrollView style={{ width: Dimensions.get('window').width }} contentContainerStyle={styles.containerScroll}>
				{loading && <>
					<ActivityIndicator size='large' color="#545454" />
					<Text>Carregando...</Text>
				</>}
				{!loading && ReservaUser.length == 0 && <>
					<Paragraph>Parece que você ainda não reservou nenhum quarto!</Paragraph>
				</>}
				{!loading && ReservaUser.map((p, index) => {
					var preçoDouble = parseFloat(p.preço)
					var inicio = String(p.inicioReserva);
					var fim = String(p.fimReserva);
					return (
						<Card style={{ width: 0.9 * Dimensions.get('window').width, marginBottom: 15 }} key={index}>
							<Card.Content>
								<Title>{p.nome}</Title>
								<Card.Cover source={{ uri: p.urlImg }} style={{width: 0.9 * Dimensions.get('window').width}}/>
								<Paragraph>preço: {preçoDouble.toFixed(2)}</Paragraph>
								<Paragraph>Inicio da reserva: {inicio}</Paragraph>
								<Paragraph>Fim da reserva: {fim}</Paragraph>

							</Card.Content>
							<Card.Actions>
							<IconButton icon="pencil" color="#4592a0" size={25} onPress={() => navigation.navigate("EditarReservaUser", { update: true, id: ids[index], obj: p })}></IconButton>
								<Button color='#d4161d' onPress={() => deletarItem(ids[index])}>Remover</Button>
							</Card.Actions>
						</Card>

					);
				})}{!loading && <>
					<Portal>
						<Dialog visible={visibleDialog} dismissable={false}>
							<Dialog.Content>
								<ActivityIndicator size='large' color="#545454" />
								<Paragraph>Removendo item...</Paragraph>
							</Dialog.Content>
						</Dialog>
					</Portal>
				</>}
			</ScrollView>

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