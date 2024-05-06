# AI API
API endpoint providing access to Google Gemini on /api/ai/gemini-pro

## Prerequisites
The API requires nodeJS v18 minimum.

The API rely on local environment variables, you can either create a .env file or if you run the API in a docker image you add the environment variables to it. Here is the list :
- API_KEY=<YOU API KEY>
- PROJECT_ID=<YOUR GOOGLE PROJECT ID>
- LOCATION=<LOCATION OF THE SERVICE>
- GEMINI_PRO_MODEL_NAME=gemini-pro
- GOOGLE_APPLICATION_CREDENTIALS=service-principal-gemini-credential.json

==In order to get the acccess to Google APIs, you need to place a file called service-principal-gemini-credential.json in the API folder. This file must include the credentials for the service account to connect to Google APIs.==

## Running the API
Start by installing the modules
```
npm i
```

Run the server
```
node server.js
```

The API will be listening on port 3001 by default. 