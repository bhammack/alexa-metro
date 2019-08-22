// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const MetroApi = require('./metro');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to the Washing DC Metro transit skill. How many I assist you?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const BusIncidentsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BusIncidentsIntent';
    },
    handle(handlerInput) {
        return MetroApi.getBusIncidents().then(res => {
            let busIncidentsCount = res.data.BusIncidents.length;
            let output;

            if (busIncidentsCount > 0) {
                output = `There are currently ${busIncidentsCount} bus incidents. Would you like me to read them out?`;
            } else {
                output = 'There are no reported bus incidents';
            }

            return handlerInput.responseBuilder.speak(output).getResponse();
        });
    }
};
const RailIncidentsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RailIncidentsIntent';
    },
    handle(handlerInput) {
        return MetroApi.getRailIncidents().then(res => {

            let incidentsCount = res.data.Incidents.length;
            let output;
            if (incidentsCount > 0) {
                output = `There are currently ${incidentsCount} rail incidents. Would you like me to read them out?`;
            } else {
                output = 'There are no reported rail incidents';
            }

            // would you like me to tell you what they are?
            return handlerInput.responseBuilder.speak(output).getResponse();
        });
    }
};
const StatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StatusIntent';
    },
    handle(handlerInput) {
        return MetroApi.getRailPredictions().then(res => {
            const speakOutput = `Found predictions for ${res.data.Trains.length} trains.`;
            return handlerInput.responseBuilder.speak(speakOutput).getResponse();
        });
    }
};
const NextTrainIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextTrainIntent';
    },
    handle(handlerInput) {

        // Get the station ids
        let fromStation = handlerInput.requestEnvelope.request.intent.slots.SourceStation.value;
        let fromStationId = handlerInput.requestEnvelope.request.intent.slots.SourceStation.resolutions.resolutionsPerAuthority[0].values[0].value.id;

        //let toStation = handlerInput.requestEnvelope.request.intent.slots.DestStation.value;
        //let toStationId = handlerInput.requestEnvelope.request.intent.slots.DestStation.resolutions.resolutionsPerAuthority[0].values[0].value.id;

        return MetroApi.getRailPredictions([fromStationId]).then(res => {
            //const speakOutput = `The next train from ${fromStation} or ${fromStationId} to ${toStation} or ${toStationId} is coming!`;

            let nextTrain = res.data.Trains[0];

            const speakOutput = `The next train into ${fromStation} departs for ${nextTrain.DestinationName} in ${nextTrain.Min} minutes.`
            
            
            return handlerInput.responseBuilder.speak(speakOutput).getResponse();



        });
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        StatusIntentHandler,
        NextTrainIntentHandler,
        BusIncidentsIntentHandler,
        RailIncidentsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler,
        )
    .lambda();
