import React from 'react';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Dimensions,
  } from 'react-native';
import {list} from './Data'
import Icon from 'react-native-vector-icons/Fontisto';
import NumberMarker from './NumberMarker';

const { width, height } = Dimensions.get('window');
const initialLat = 42.3490316;
const initialLng = -71.079751;
const ASPECT_RATIO = width / height;

// Get coordinates and find distance from initial region defined above
const coordinates = [];
const distances = [];
for (let i = 0, n = list.length; i < n; i++) {
  coordinates.push({id: list[i]["id"], latitude: list[i]["latitude"], longitude: list[i]["longitude"]});
  distance = haversine_distance(initialLat, coordinates[i]["latitude"], initialLng, coordinates[i]["longitude"]);
  distances.push({id: list[i]["id"], distance: distance.toFixed(1)});
  }

// Sort by distance
// distances.sort(function(a,b) {
//   return a.distance - b.distance;
// })
// console.log(distances);
// coordinates.sort(function(a,b) {
//   for (let i=0; i<distances.length; i++) {
//     if (distances[i]["id"] == a) {
//       var index = 
//     }
//   }
//   return distances.indexOf(a["id"]) - distances.indexOf(b)
// });

function haversine_distance(lat1, lat2, lng1, lng2) {
  var R = 3958.8; // Radius of Earth in miles
  var rlat1 = lat1 * (Math.PI/180); // Latitude in radians
  var rlat2 = lat2 * (Math.PI/180); // Latitude in radians
  var lat_diff = rlat2 - rlat1;
  var lng_diff = (lng2 - lng1) * (Math.PI/180);
  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(lat_diff/2)*Math.sin(lat_diff/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(lng_diff/2)*Math.sin(lng_diff/2)));
  return d;
}

export default class Map extends React.Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <MapView 
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: initialLat,
                    longitude: initialLng,
                    latitudeDelta: 0.0350,
                    longitudeDelta: 0.0350 * ASPECT_RATIO,
                  }}>
                  {coordinates.map((item) => (
                    <Marker key={item.id} 
                      coordinate={{ latitude: item.latitude, longitude: item.longitude}} 
                      
                    >
                      <NumberMarker number={item.id}></NumberMarker>
                    <Callout style={styles.callout}><View><Text style={{fontFamily: 'AvenirNext-Medium'}}>{list[item.id-1].name}</Text></View></Callout>
                    </Marker>
                  ))}
              </MapView> 
            </View>
        );
    }
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

export {distances};