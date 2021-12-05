// File to grab data of cafes based on user's location

import { initialLat, initialLng } from './Map';

const { ApifyClient } = require('apify-client');
const fs = require('fs');

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_9bAlWd478ZNiZSEhlLDd2eC7WTeI1Q4yt7vI',
});

// Starting URL to crawl in input
const url = `https://www.google.com/maps/search/coffee+shop/@${initialLat},${initialLng},15z/`;

// Prepare actor input
const input = {
    "searchStringsArray": [
        ""
    ],
    "maxCrawledPlaces": 80,
    "language": "en",
    "exportPlaceUrls": false,
    "includeHistogram": false,
    "includeOpeningHours": true,
    "maxImages": 3,
    "maxReviews": 0,
    "proxyConfig": {
        "useApifyProxy": true
    },
    "startUrls": [
        {
            "url": url
        }
    ],
    "zoom": 15,
    "maxAutomaticZoomOut": 0,
    "additionalInfo": true
};

(async () => {
    // Run the actor and wait for it to finish
    const run = await client.actor("drobnikj/crawler-google-places").call(input);

    // Fetch and print actor results from the run's dataset
    console.log('Downloading data...');
    const myDataSet = await client.dataset(run.defaultDatasetId);
    const jsonData = JSON.stringify(myDataSet);
    fs.writeFile("./src/dataset.json", jsonData, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while downloading JSON");
            return console.log(err);
        }
        console.log("JSON file has been saved");
    });
})();