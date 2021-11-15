import React, { useState, state, Component, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Linking, TouchableOpacity, Alert, ScrollView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Card, Title, Paragraph, Button, Snackbar, Portal, Dialog, Menu, FAB, List, Divider } from 'react-native-paper';
import axios from 'axios';

import { collection, query, where } from "firebase/firestore";
import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";


export default function telaPrevisão({ navigation }) {

	const [dias, setDias] = useState([]);
	const [ready, setReady] = useState(false);
	let list = [];
	let strCoord = '-26.874928726178037,-52.40490281906037';
	
	var options = {
		method: 'GET',
		url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
		params: {q: '-26.874928726178037,-52.40490281906037', days: '3', lang: 'pt'},
		headers: {
		  	'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
		  	'x-rapidapi-key': '7a12ca91a5msh177f72e473b3829p12216bjsnba1204c54368'
		}
	};

	function fixDateFormat(d){
		let arr = d.split('-');
		return arr[2] + '/' + arr[1] + '/' + arr[0];
	}

	useEffect(() => {

		axios.request(options).then((response) => {
			
			let arr = response.data.forecast.forecastday;

			arr.forEach((day) => {

				let obj = {
					data: fixDateFormat(day.date),
					max: day.day.maxtemp_c,
					min: day.day.mintemp_c,
					mmChuva: day.day.totalprecip_mm,
					condição: day.day.condition.text,
				}

				list.push(obj);
			})

			setDias(list);
			setReady(true);
			
		}).catch(function (error) {
			console.error(error);
		});
	})

	return(
		<View style={styles.container}>
			<ScrollView style={{width: Dimensions.get('window').width}} contentContainerStyle={styles.containerScroll}>
				{!ready && <Text>carregando</Text>}
				{ready && dias.map((d, index) => {
					
					return(
						<Card style={{width: 0.9 * Dimensions.get('window').width, marginBottom: 15}} key={index}>
							<Card.Content>
								<Title>{d.data}</Title>
								<Paragraph>📉 {d.min}°C - 📈 {d.max}°C</Paragraph>
								<Paragraph>Condição: {d.condição}</Paragraph>
								<Paragraph>Milímetros de chuva: {d.mmChuva}</Paragraph>
							</Card.Content>
						</Card>
					);
				})}
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