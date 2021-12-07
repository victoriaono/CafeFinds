import React, { useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Linking, Alert } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import NumberMarker from './NumberMarker';

// Constants for defining the aspect ratio of the map screen
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
var initialLat = 0;
var initialLng = 0;

// Function to calculate distance between two coordinate pairs
function haversine_distance(lat1, lat2, lng1, lng2) {
  var R = 3958.8; // Radius of Earth in miles
  var rlat1 = lat1 * (Math.PI / 180); // Latitude in radians
  var rlat2 = lat2 * (Math.PI / 180); // Latitude in radians
  var lat_diff = rlat2 - rlat1;
  var lng_diff = (lng2 - lng1) * (Math.PI / 180);
  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(lat_diff / 2) * Math.sin(lat_diff / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(lng_diff / 2) * Math.sin(lng_diff / 2)));
  return d;
}

// Render data from JSON
const list = [];
const coordinates = [];
const distances = [];
const data = require('../dataset.json');
var n = 0;
for (let i = 0; i < data.length; i++) {
  var info = data[i].additionalInfo["Popular for"];
  if (info != undefined) {
    for (let j = 0; j < info.length; j++) {
      // Only get cafes that have this property
      if ("Good for working on laptop" in info[j]) {
        n++;
        list.push({
          id: n, name: data[i].title,
          latitude: data[i].location.lat,
          longitude: data[i].location.lng,
          hours: (data[i].openingHours != null ? data[i].openingHours : ''),
          wifi: false,
          website: (data[i].website != null ? data[i].website : ''),
          photos: data[i].imageUrls
        });
      }
      // Change wifi to true if they have the property
      var amenities = data[i].additionalInfo["Amenities"];
      if (amenities != undefined) {
        for (let k = 0; j < amenities.length; j++) {
          if ("Free Wi-Fi" in amenities[k]) {
            list[n - 1]["wifi"] = true;
          }
        }
      }
    }
  }
}

// Button to take user to the shop's website
const OpenURLButton = ({ url }) => {
  const handlePress = useCallback(async () => {
    // Check if the link is supported
    try {
      const response = await Linking.canOpenURL(url);
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Invalid URL");
    }
  }, [url]);

  return <TouchableOpacity style={styles.button} onPress={handlePress}><Text style={styles.list}>Website</Text></TouchableOpacity>;
}

const myKeyExtractor = (item) => {
  return item.id;
}

// Constant to render each element data
const renderItem = ({ item }) => {
  const photos = item.photos;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={[styles.list, { fontSize: 18 }]}>
          {item.id}. {item.name}
        </Text>
        <Text style={[styles.list, { color: '#767676' }]}>
          {distances[item.id - 1]["distance"]} mi
        </Text>
      </View>
      <View style={styles.images}>
        {photos.map((photo, index) => (
          <Image style={{ width: 100, height: 100 }}
            source={{ uri: photo }}
            key={index} />
        ))}
      </View>
      <View style={styles.row}>
        <Text style={styles.list}>Free WiFi: {item.wifi ? "Yes" : "Unconfirmed"}</Text>
        <Text style={styles.list}>Today: {item.today}</Text>
      </View>

      <View style={{ direction: 'rtl' }}>
        <OpenURLButton url={item.website}></OpenURLButton>
      </View>
    </View>
  );
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null
    }
  }
  async componentDidMount() {
    // Check for user's permission to use their location
    handleLocationPermission = async () => {
      let permissionCheck = "";
      if (Platform.OS === "ios") {
        permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (permissionCheck === RESULTS.DENIED) {
          const permissionRequest = await request(
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          );
          permissionRequest === RESULTS.GRANTED
            ? console.warn("Location permission granted.")
            : console.warn("Location perrmission denied.")
        }
      }
      if (Platform.OS === 'android') {
        permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  
        if (
          permissionCheck === RESULTS.BLOCKED ||
          permissionCheck === RESULTS.DENIED
        ) {
          const permissionRequest = await request(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          );
          permissionRequest === RESULTS.GRANTED
            ? console.warn('Location permission granted.')
            : console.warn('location permission denied.');
        }
      }
    }

    // Get user's current location
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    initialLat = this.state.latitude;
    initialLng = this.state.longitude;
  }
  render() {
    // React renders this first and then componentDidMount, so want to make sure the latitude (and longitude) has been defined
    if (this.state.latitude) {
      for (let i = 0, n = list.length; i < n; i++) {
        coordinates.push({ id: list[i]["id"], latitude: list[i]["latitude"], longitude: list[i]["longitude"] });
        distance = haversine_distance(this.state.latitude, coordinates[i]["latitude"], this.state.longitude, coordinates[i]["longitude"]);
        distances.push({ id: list[i]["id"], distance: distance.toFixed(1) });
      }
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var now = new Date(); // Current time object
    var day = days[now.getDay()]; // Current day of the week
    // Get today's opening hours
    for (let i = 0, n = list.length; i < n; i++) {
      for (let j = 0, m = list[0].hours.length; j < m; j++) {
        if (list[i]["hours"] === '') {
          list[i]["today"] = "hours unknown";
        }
        else if (list[i]["hours"][j]["day"].includes(day)) {
          list[i]["today"] = list[i]["hours"][j]["hours"];
          break;
        }
      }
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.4 }}>
          {this.state.latitude && (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0350,
                longitudeDelta: 0.0350 * ASPECT_RATIO,
              }}
              showsUserLocation={true}>
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
        <View style={{ flex: 0.6 }}>
          {this.state.latitude && (
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtracotr={myKeyExtractor}
              ItemSeparatorComponent={
                Platform.OS !== 'android' &&
                (({ highlighted }) => (
                  <View style={styles.separator} />))}
            />
          )}
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2.9,
  },
  callout: {
    width: 100,
    alignItems: 'center',
  },
  card: {
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    fontFamily: 'AvenirNext-Medium',
    fontSize: 15,
  },
  images: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0B1CB',
    borderRadius: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#555',
  }
});

export { initialLat, initialLng };