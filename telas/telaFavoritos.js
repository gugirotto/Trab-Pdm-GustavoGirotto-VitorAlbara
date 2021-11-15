import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking,TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';


import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";
var count=0;

export default function telaFavoritos({ navigation }){
	
	const [Favorito, setFavorito] = React.useState([]);
	const [FavoritoPraias, setFavoritoPraias] = React.useState([]);
	const [FavoritoCampo, setFavoritoCampo] = React.useState([]);
	const [filtroPraia, setfiltroPraia] = React.useState(false);
	const [filtroCampo, setfiltroCampo] = React.useState(false);
	const [ids, setIds] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [visibleDialog, setVisibleDialog] = React.useState(false);
	const [visibleMenu, setVisibleMenu] = React.useState(false);
	const [refreshDummy, setRefreshDummy] = React.useState(0);
	const userId = firebase.auth().currentUser.uid;
	
	const openMenu = () => setVisibleMenu(true);
	const closeMenu = () => setVisibleMenu(false);
	
	useEffect(() => {
		
		async function getFavorito(){
			
			let doc = await firebase
			.firestore()
			.collection('users')
			.doc(userId)
			.collection('favoritos')
			.onSnapshot((query) => {
				
				const list = [], ids = [];
				
				query.forEach((doc) => {
					list.push(doc.data());
					ids.push(doc.id);
				})
				
				setFavorito(list);
				setIds(ids);
				setLoading(false);
				
				let apenasPraias = list.filter(checkPraia);
				setFavoritoPraias(apenasPraias);
				
				let apenasCampo = list.filter(checkCampo);
				setFavoritoCampo(apenasCampo);
			})
		}
		
		getFavorito();
		
	}, [refreshDummy])
	
	function checkPraia(item){
		return item.categoria === 'praia';
	}
	
	function checkCampo(item){
		return item.categoria === 'campo';
	}
	
	function deleteItem(id){
		
		setVisibleDialog(true);
		
		firebase
		.firestore()
		.collection('users')
		.doc(userId)
		.collection('favoritos')
		.doc(id)
		.delete()
		.then(() => {
			setVisibleDialog(false);
			setRefreshDummy(refreshDummy + 1);
		}).catch((e) => {
			alert(e);
		});
		
		
	}
	
	return(
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" hidden={false} backgroundColor="#7e07ad"/>
			<ScrollView style={{width: Dimensions.get('window').width}} contentContainerStyle={styles.containerScroll}>
				{loading && <>
					<ActivityIndicator size='large' color="#545454"/>
					<Text>Carregando...</Text>
				</>}
				{!loading && (Favorito.length == 0) && <>
					<Text>Adicione um quarto aos seus favoritos!</Text>
				</>}
				{!loading && !filtroPraia && !filtroCampo && Favorito.map((p, index) => {
					var preçoDouble = parseFloat(p.preço)
					return(
						<Card style={styles.cardProduto} key={index}>
								<Card.Content>
								<Title>{p.nome} - {'R$' +preçoDouble.toFixed(2)}</Title>
							</Card.Content>
							<Card.Cover source={{ uri: p.urlImg }} style={{ width: 0.9 * Dimensions.get('window').width }} />
							<Card.Actions>
								<Button color='#d4161d' onPress={() => deleteItem(ids[index])}>Remover</Button>
							</Card.Actions>
						</Card>
					);
				})}
				{!loading && filtroPraia && !filtroCampo && FavoritoPraias.map((p, index) => {
					var preçoDouble = parseFloat(p.preço)
					return(
						<Card style={styles.cardProduto} key={index}>
							<Card.Content>
								<Title>{p.nome} - {'R$' +preçoDouble.toFixed(2)}</Title>
							</Card.Content>
							<Card.Cover source={{ uri: p.urlImg }} style={{ width: 0.9 * Dimensions.get('window').width }} />
							<Card.Actions>
								<Button color='#d4161d' onPress={() => deleteItem(ids[index])}>Remover</Button>
							</Card.Actions>
						</Card>
					);
				})}
				{!loading && !filtroPraia && filtroCampo && FavoritoCampo.map((p, index) => {
					var preçoDouble = parseFloat(p.preço)

					return(
						<Card style={styles.cardProduto} key={index}>
							<Card.Content>
								<Title>{p.nome} - {'R$' +preçoDouble.toFixed(2)}</Title>
							</Card.Content>
							<Card.Cover source={{ uri: p.urlImg }} style={{ width: 0.9 * Dimensions.get('window').width }} />
							<Card.Actions>
							
								<Button color='#d4161d' onPress={() => Item(ids[index])}>Remover</Button>
							</Card.Actions>
						</Card>
					);
				})}
				{!loading && <Menu
					visible={visibleMenu}
					onDismiss={closeMenu}
					anchor={<Button onPress={openMenu} style={{marginTop: 15}}>Filtrar itens</Button>}>
					<Menu.Item onPress={() => {
						setfiltroPraia(false);
						setfiltroCampo(false);
						closeMenu();
					}} title="Sem filtro" />
					<Menu.Item onPress={() => {
						setfiltroPraia(true);
						setfiltroCampo(false);
						closeMenu();
					}} title="Praias" />
					<Menu.Item onPress={() => {
						setfiltroPraia(false);
						setfiltroCampo(true);
						closeMenu();
					}} title="Campo" />
				</Menu>}
				{!loading && <>
					<Portal>
						<Dialog visible={visibleDialog} dismissable={false}>
							<Dialog.Content>
								<ActivityIndicator size='large' color="#545454"/>
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