# My Frontend for UNS Bot 

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

## Prerequisites
The Frontend rely on local environment variables, you can either create a .env file or if you run the API in a docker image you add the environment variables to it. Here is the list :
- REACT_APP_BROKER_WS_ADDRESS=<BROKER WEBSOCKET ADDRESS>
- REACT_APP_WS_PORT=<BROKER WEBSOCKET PORT>
- REACT_APP_WS_USERNAME=<BROKER WEBSOCKET USERNAME>
- REACT_APP_WS_PASSWORD=<BROKER WEBSOCKET PASSWORD>
- REACT_APP_TOPIC_ROOT=<TOPIC ROOT TO SUBSCRIBRE TO>
- REACT_APP_API_URL=http://localhost:3001
- REACT_APP_API_KEY=<API TOKEN>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br /> Open
[http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br /> You will also see any lint errors
in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br /> See the section
about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br /> It correctly bundles
React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br /> Your app is
ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

## Learn More

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
