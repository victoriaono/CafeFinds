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

const { width, height } = Dimensions.get('window');
const initialLat = 42.3490316;
const initialLng = -71.079751;
const ASPECT_RATIO = width / height;

const coordinates = [];
const distances = [];
for (let i = 0, n = list.length; i < n; i++) {
  coordinates.push({id: list[i]["id"], latitude: list[i]["latitude"], longitude: list[i]["longitude"]});
  distance = haversine_distance(initialLat, coordinates[i]["latitude"], initialLng, coordinates[i]["longitude"]);
  distances.push({id: list[i]["id"], distance: distance.toFixed(1)});
  }
distances.sort(function(a,b) {
  return a.distance - b.distance
});

// list.sort(function(a, b) {
//   return distances.indexOf(a["id"]) - distances.indexOf(b["id"])
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
      // const showInfo = () => {

      // }
      list.sort(function(a, b) {
        // Want to sort the list based on the id values of distances
        return distances.indexOf(a["id"]) - distances.indexOf(b["id"])
      });
      // console.log(distances);
      // console.log(list[0]);
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
                    <Callout><View><Text style={styles.marker}>{list[item.id-1].name}</Text></View></Callout>
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
      height: Dimensions.get('window').height / 2.3,
    },
    marker: {
      fontFamily: 'AvenirNext-Medium',
    }
  });

export {distances};