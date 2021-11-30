import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { distances } from './Map';

const list = [];
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

const myKeyExtractor = (item) => {
    return item.id;
}

const renderItem = ({ item }) => {
    const photos = item.photos;
    return (
        <View>
            <View style={styles.topRow}>
            <Text style={styles.list}>
                {/* {item.name} {"\n"}Today: {item.today} */}
                {item.name}
            </Text>
            <Text style={styles.list} key={distances[item.id - 1]["id"]}>
                {distances[item.id - 1]["distance"]} mi
            </Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
            {photos.map((photo) => (
                <Image style={{ width: 100, height: 100, marginEnd: 20}} 
                source={{uri: photo }}/>
            ))}
            </View>
        </View>
    );
}

class Data extends React.Component {
    render() {
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
        };
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtracotr={myKeyExtractor}
                    ItemSeparatorComponent={
                        Platform.OS !== 'android' &&
                        (({ highlighted }) => (
                            <View style={styles.separator} />))}
                />
            </View>

        );
    };
}

const styles = StyleSheet.create({
    topRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    list: {
        padding: 5,
        fontFamily: 'AvenirNext-Medium',
        fontSize: 15,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#555',
    }
});

export { list };
export default Data;