const { ApifyClient } = require('apify-client');

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_9bAlWd478ZNiZSEhlLDd2eC7WTeI1Q4yt7vI',
});

// Prepare actor input
const input = {
    "searchStringsArray": [
        ""
    ],
    "maxCrawledPlaces": 10,
    "language": "en",
    "exportPlaceUrls": false,
    "includeHistogram": false,
    "includeOpeningHours": true,
    "maxImages": 0,
    "maxReviews": 0,
    "proxyConfig": {
        "useApifyProxy": true
    },
    "startUrls": [
        {
            "url": "https://www.google.com/maps/search/coffee+shop/@40.7094287,-74.0065137,15z/data=!3m1!4b1"
        }
    ],
    "zoom": 15,
    "maxAutomaticZoomOut": 0,
    "additionalInfo": true
};

(async () => {
    // Run the actor and wait for it to finish
    const run = await client.actor("drobnikj/crawler-google-places").call(input);

    // Fetch and print actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const myDataSet = await client.dataset(run.defaultDatasetId);
    myDataSet.downloadItems("json");
    // const { items } = await client.dataset(run.defaultDatasetId).listItems();
    // items.forEach((item) => {
    //     console.dir(item);
    // });
})();