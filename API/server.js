// importing the dependencies
require("dotenv").config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const gemini = require('./helpers/gemini');

// defining the Express app
const app = express();

// Adding Helmet to enhance your Rest API's security
app.use(helmet());

app.use(helmet.hidePoweredBy());

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "script-src": ["'self'", "*"],
            "style-src": null,
        },
    })
);

// Sets "Cross-Origin-Opener-Policy: same-origin"
app.use(helmet({ crossOriginOpenerPolicy: true }));

// Sets "Cross-Origin-Opener-Policy: same-origin-allow-popups"
app.use(helmet({ crossOriginOpenerPolicy: { policy: "same-origin" } }));

// Sets "Cross-Origin-Resource-Policy: same-origin"
app.use(helmet({ crossOriginResourcePolicy: true }));

// Sets "Cross-Origin-Resource-Policy: same-site"
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-origin" } }));
// Using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Enabling CORS for all requests
app.use(cors({
    origin: '*'
}));

// Adding morgan to log HTTP requests
app.use(morgan('combined'));

// Defining the root endpoint
app.get('/api', (req, res) => {
    res.send("Welcome to AI API");
});


app.post("/api/ai/gemini-pro", async (req, res) => {
    console.log("Executing Gemini Pro query requested")
    try {
        console.log("Checking user inputs")
        // Get user input
        const apiKey = req.headers['api-key'];
        const { promptinit, query } = req.body;

        // Validate user authentication
        if (apiKey) {
            if (apiKey != process.env.API_KEY) {
                console.log("Wrong api key ! ")
                res.status(400).send("Bad unauthentication ! ");
            }
            else {
                //Check api key validity
                if ((promptinit && query)) {
                    console.log("Prompt Init : " + promptinit)
                    console.log("Query : " + query)
                    let geminiResponse = await gemini.streamGenerateContent(promptinit, query);
                    res.status(200).send(geminiResponse);
                }
                else {
                    res.status(400).send("Bad query inputs ! ");
                }
            }
        }
        else {
            res.status(400).send("Bad authentication ! ");
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Start HTTP server
app.listen(3001, () => {
    console.log('AI API listening on port HTTP 3001');
});