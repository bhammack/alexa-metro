
const API_URL = 'https://api.wmata.com'

const axios = require('axios');
axios.defaults.headers.common['api_key'] = API_KEY

module.exports = {
    
    // Real-time rail predictions
    getRailPredictions(stations = ['all']) {
        return axios.get(API_URL + '/StationPrediction.svc/json/GetPrediction/' + stations.join(','));
    },

    // Real-time bus predictions
    getBusPredicitions() {

    },

    // Live train positions
    getTrainPositions() {
        return axios.get(API_URL + '/TrainPositions/TrainPositions?contentType=json')

    },

    // Rail Station Information

    getStationTimes() {
        return axios.get(API_URL + '/Rail.svc/json/jStationTimes')
    },


    // Bus Route and Stop Methods

    getBusPosition() {

    },

    getPathDetails() {

    },

    getRoutes() {

    },

    getSchedule() {

    },

    getScheduleAtStop() {

    },

    getStops() {

    },

    // Incidents

    getBusIncidents() {

    },

    getOutages() {

    },

    getRailIncidents() {
        return axios.get(API_URL + '/Incidents.svc/json/Incidents')
    },

    // Stations
    getRailStations(lineCode = '') {
        return axios.get(API_URL + '/Rail.svc/json/jStations')
    }





}