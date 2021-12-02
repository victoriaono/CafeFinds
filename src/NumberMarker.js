import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Text } from 'react-native';

const propTypes = {
    number: PropTypes.number.isRequired
}

class NumberMarker extends React.Component {
    render() {
        const number = this.props.number;
        return (
            <View style={styles.container}>
                <View style={styles.bubble}>
                    <Text style={styles.number}>{number}</Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
            </View>
        );
    }
}

NumberMarker.propTypes = propTypes;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
    },
    bubble: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#E0B1CB',
        padding: 5,
        borderRadius: 8,
        width: 30,
    },
    number: {
        fontFamily: 'AvenirNext-Medium',
        color: '#FFFFFF',
        fontSize: 15,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#E0B1CB',
        alignSelf: 'center',
        marginTop: -9,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: '#E0B1CB',
        alignSelf: 'center',
        marginTop: -0.5,
    },
});

export default NumberMarker;