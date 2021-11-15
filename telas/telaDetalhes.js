import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking,TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider } from 'react-native-paper';

import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";



export default function telaDetalhes({ route, navigation }){
	

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
	
	return(
		<View style={styles.containerDetalhes}>
			{loading && <>
				<ActivityIndicator size='large' color='#545454'/>
				<Text>Carregando...</Text>
			</>}
			{!loading && <>
				<Title style={{marginBottom: 25}}>{info.nome}</Title>
				<Image source={{uri: url}} style={{width: '100%', height: '50%'}} />
				<ScrollView style={{width: Dimensions.get('window').width}} contentContainerStyle={styles.containerScrollDetalhes}>
					<Paragraph>{info.descrição}</Paragraph>
				</ScrollView>
				<Button mode='contained' onPress={() => navigation.goBack()}>Voltar</Button>
			</>}
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