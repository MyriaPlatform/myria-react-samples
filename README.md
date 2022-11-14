# Myria React Samples

React-based application for client interactions with Myria Core SDK.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

Recomended node versions: 14.15.0 || ^16.10.0 || >=18.0.0

### 1. Clone the repository

```
git clone https://github.com/MyriaPlatform/myria-react-samples.git
```

### 2. Enter myria-react-samples directory

```
cd myria-react-samples
```

### 3. Install dependencies
```
yarn
```

## Running the app

### Development

```
yarn start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Production

If you want to use the app in production, replace targeted environment from `STAGING` to `PRODUCTION` in the [myria-client.ts](https://github.com/MyriaPlatform/myria-react-samples/blob/master/src/samples/common/myria-client.ts#L30) file.

### Testing

```
yarn test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Build

`yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!