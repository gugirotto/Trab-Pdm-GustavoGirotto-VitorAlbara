import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking,TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import telaReserva from"../telas/telaReserva.js";
import telaDetalhes from"../telas/telaDetalhes.js";
import telaReservaUser from"../telas/telaReservaUser.js";
import telaAddReserva from"../telas/telaAddReserva.js";
import telaLocal from"../telas/telaLocal.js";
import telaFavoritos from"../telas/telaFavoritos.js";
import telaContatar from"../telas/telaContatar.js";
import telaAddQuarto from"../telas/telaAddQuarto.js";
import telaAtualizarQuarto from"../telas/telaAtualizarQuarto.js";
import telaEditarReserva from"../telas/telaEditarReserva.js";
import telaPrevisão from"../telas/telaPrevisão.js";
import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";

import { logout } from "../firebase/firebaseMethods.js";

import logo from "./assets/logo.png";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

var count = 0;
function stackReserva({ navigation }){
	
	return(
		<Stack.Navigator>
			<Stack.Screen name="Quartos" component={telaReserva} options={{headerShown: false}}/>
			<Stack.Screen name="Detalhes" component={telaDetalhes} options={{headerShown: false}}/>
			<Stack.Screen name="Reservar" component={telaAddReserva} options={{headerShown: false}}/>
			
			<Stack.Screen name="AddQuarto" component={telaAddQuarto} options={{headerShown: false}}/>
			<Stack.Screen name="AtualizarQuarto" component={telaAtualizarQuarto} options={{headerShown: false}}/>
		</Stack.Navigator>
	);
}

function stackReservaUser({ navigation }){
	
	return(
		<Stack.Navigator>
			<Stack.Screen name="ReservaUser" component={telaReservaUser} options={{headerShown: false}}/>
			<Stack.Screen name="AddReservaUser" component={telaAddReserva} options={{headerShown: false}}/>
			<Stack.Screen name="EditarReservaUser" component={telaEditarReserva} options={{headerShown: false}}/>
			<Stack.Screen name="Quartos" component={telaReserva} options={{headerShown: false}}/>
		</Stack.Navigator>
	);
}



function MenuLateral( props ) {
	
	const navigation = useNavigation();
	
	function sair(){
		logout();
		navigation.replace('Loading');
	};
	
	return (
		<>
			<View style={{justifyContent: 'center', alignItems: 'center'}}>
				<Image source={logo} style={styles.logoMenu} />
			</View>
			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
				<DrawerItem
					label='Sair'
					onPress={sair}
				/>
			</DrawerContentScrollView>
		</>
  );
}

export default function home({ navigation }){
	
	return(
		<Drawer.Navigator drawerContent={(props) => <MenuLateral {...props} />}>
			<Drawer.Screen name="Fazer Reserva" component={stackReserva} />
			<Drawer.Screen name="Suas reservas" component={stackReservaUser} />
			<Drawer.Screen name="Seus favoritos" component={telaFavoritos} />
			<Drawer.Screen name="Encontre os hotéis" component={telaLocal} />
			<Drawer.Screen name="Previsão" component={telaPrevisão} />
			<Drawer.Screen name="Contate-nos" component={telaContatar} />
		</Drawer.Navigator>
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