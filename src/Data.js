import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { distances } from './Map';

const list = [];
const data = require('../dataset.json');
var n = 0;
for (let i = 0; i < data.length; i++) {
    var key = data[i].additionalInfo["Popular for"];
    if (key != undefined) {
        for (let j = 0, n = key.length; j < n; j++) {
            // Only get cafes that have this property
            if ("Good for working on laptop" in key[j]) {
                n++;
                list.push({
                    id: n, name: data[i].title,
                    latitude: data[i].location.lat,
                    longitude: data[i].location.lng,
                    hours: data[i].openingHours,
                    wifi: false,
                    menu: (data[i].website != null ? data[i].website : '')
                });
                // Change wifi to true if they have the property
                key = data[i].additionalInfo["Amenities"];
                if (key != undefined) {
                    for (let k = 0; j < key.length; j++) {
                        if ("Free Wi-Fi" in key[k]) {
                            list[n - 1]["wifi"] = true;
                        }
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
    return (
        <View>
            <Text style={styles.list}>
                {item.name}, {item.today}
            </Text>
            <Text style={styles.list} key={distances[item.id - 1]["id"]}>{distances[item.id - 1]["distance"]} mi</Text>
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
                if (list[i]["hours"][j]["day"].includes(day)) {
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