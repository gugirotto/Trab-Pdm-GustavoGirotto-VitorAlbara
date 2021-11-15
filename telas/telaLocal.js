import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking,TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';



export default function telaLocal({ navigation }){
	
	return(
		<View style={styles.container}>
			<View style={{flex: 0.1}}>
				<StatusBar barStyle="dark-content" hidden={false} backgroundColor="#7e07ad"/>
				<Title style={{marginTop: 10}}>Localização dos hoteis</Title>
			</View>
			<View style={{flex: 0.1}}>
				<Text>Rua 157, Centro, 30, Itapema - SC</Text>
			</View>
			<View style={{flex: 0.8}}>
				<Card>
					<Card.Content>
						<MapView
							initialRegion={{ 
								latitude: -27.10393666300111, 
								longitude: -48.61350606703208,
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							}} style={{width: 0.95 * Dimensions.get('window').width, height: '90%'}}>
							<Marker coordinate={{latitude: -27.10393666300111,  longitude: -48.61350606703208}} pinColor={'#d4161d'}/>
							<Marker coordinate={{latitude: -27.178155505357438,  longitude:  -49.138008318591325}} pinColor={'#d4161d'}/>
						</MapView>
					</Card.Content>
				</Card>
			</View>
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