import React, { useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity, Linking, Alert } from 'react-native';
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

const renderItem = ({ item }) => {
    const photos = item.photos;
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={[styles.list, {fontSize: 18}]}>
                    {item.id}. {item.name}
                </Text>
                <Text style={[styles.list, {color: '#767676'}]}>
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
            
            <View style={{direction: 'rtl'}}>
                <OpenURLButton url={item.website}></OpenURLButton>
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

export { list };
export default Data;