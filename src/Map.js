import React, { useEffect, useState } from 'react';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { list } from './Data';
import Icon from 'react-native-vector-icons/Fontisto';
import NumberMarker from './NumberMarker';

const { width, height } = Dimensions.get('window');
const initialLat = 42.3490316;
const initialLng = -71.079751;
const ASPECT_RATIO = width / height;

// Get coordinates and find distance from initial region defined above
const coordinates = [];
const distances = [];


function haversine_distance(lat1, lat2, lng1, lng2) {
  var R = 3958.8; // Radius of Earth in miles
  var rlat1 = lat1 * (Math.PI / 180); // Latitude in radians
  var rlat2 = lat2 * (Math.PI / 180); // Latitude in radians
  var lat_diff = rlat2 - rlat1;
  var lng_diff = (lng2 - lng1) * (Math.PI / 180);
  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(lat_diff / 2) * Math.sin(lat_diff / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(lng_diff / 2) * Math.sin(lng_diff / 2)));
  return d;
}

const Map = () => {
  const [location, setLocation] = useState(null);
    // Check for user's permission to use location
    const handleLocationPermission = async () => {
      let permissionCheck = ""
      if (Platform.OS === "ios") {
        permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)

        if (permissionCheck === RESULTS.DENIED) {
          const permissionRequest = await request(
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          );
          permissionRequest === RESULTS.GRANTED
            ? console.warn("Location permission granted.")
            : console.warn("Location perrmission denied.")
        }
      }
    }
    useEffect(() => {
      handleLocationPermission()
    }, []);

    // Get user's current location
    useEffect(() => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude })
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    }, []);

for (let i = 0, n = list.length; i < n; i++) {
  coordinates.push({ id: list[i]["id"], latitude: list[i]["latitude"], longitude: list[i]["longitude"] });
  distance = haversine_distance(location.latitude, coordinates[i]["latitude"], location.longitude, coordinates[i]["longitude"]);
  distances.push({ id: list[i]["id"], distance: distance.toFixed(1) });
}
    return (
      <View style={{ flex: 1 }}>
        {location && (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0350,
              longitudeDelta: 0.0350 * ASPECT_RATIO,
            }}
            showsUserLocation={true}>
            {/* <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: initialLat,
              longitude: initialLng,
              latitudeDelta: 0.0350,
              longitudeDelta: 0.0350 * ASPECT_RATIO,
            }}
            showsUserLocation={true}> */}
            {coordinates.map((item) => (
              <Marker key={item.id}
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}>
                <NumberMarker number={item.id} />
                <Callout style={styles.callout}><View><Text style={{ fontFamily: 'AvenirNext-Medium' }}>{list[item.id - 1].name}</Text></View></Callout>
              </Marker>
            ))}
          </MapView>
        )}
      </View>
    );
            
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2.4,
  },
  callout: {
    width: 100,
    alignItems: 'center',
  }
});

export { distances };
export default Map;