import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TextInput, View, Alert, Pressable} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import {REACT_APP_API_KEY} from '@env';

export default function App() {

  const key = REACT_APP_API_KEY

  const [region, setRegion] = useState({
    latitude: 60.451650744313014,
    longitude: 22.267172535195293,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  });

  const [location, setLocation] = useState('');
  const [markerTitle, setMarkerTitle] = useState('');
  const [markerDesc, setMarkerDesc] = useState('');


  const getAddress = () => {
    
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${key}&street=${location}&adminArea1=FI`)
    .then(response => response.json())
    .then(mapquestData => {
      setRegion({
        ...region,
        latitude:mapquestData.results[0].locations[0].latLng.lat,
        longitude:mapquestData.results[0].locations[0].latLng.lng
      })
      setMarkerTitle(mapquestData.results[0].locations[0].adminArea3 + ', ' + mapquestData.results[0].locations[0].adminArea5)
      setMarkerDesc(mapquestData.results[0].locations[0].street + ', ' + mapquestData.results[0].locations[0].postalCode)

    }).catch(error => {Alert.alert('error', error)})
  }


  useEffect(()=> {
    (async() => {
      let  { status} = await Location.requestForegroundPermissionsAsync();
      if  (status!==   'granted') {
        Alert.alert('No   permissionto get location')
        return;}
      let  location= await Location.getCurrentPositionAsync({});
      // console.log(location)
      // console.log(location.coords.latitude)
      // console.log(location.coords.longitude)
      setRegion({
        ...region,
        latitude:location.coords.latitude,
        longitude:location.coords.longitude
      })
      setMarkerTitle('Olet tässä!')
    })();
  }, []);


  return (
    <View style={styles.container}>
       <MapView
       style={styles.map}
       initialRegion={region}
       region={region}
      >
        <Marker
          coordinate={{
            latitude:region.latitude,
            longitude:region.longitude
          }}
          title={markerTitle}
          description={markerDesc}
        />
      
        </MapView>

    <TextInput
      onChangeText={text => setLocation(text)}
      style={styles.input}
      title="Search"
      placeholder="Type address and press search"
      >
    </TextInput>

    <Pressable
      style={styles.btnContainer}
      onPress={getAddress}>
      <Text
      style={styles.btn}>Search</Text>
    </Pressable>
    </View>

   

  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },

  input:{
    width: "100%",
    textAlign:'center',
    backgroundColor: '#f4f4f4',
    height: 40,
  },

  btnContainer:{
    alignItems:'center',
    justifyContent:'center',
    marginTop: 5,
    marginBottom: 5,
  },

  btn:{
    color: 'white',
    width: 300,
    backgroundColor: '#70B8FF',
    textAlign:'center',
    height: 50,
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
  },

});
