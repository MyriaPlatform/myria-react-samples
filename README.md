# Myria React Samples

React-based application for client interactions with Myria Core SDK.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Setting up
Set up the project.

```
cd existing_repo
yarn install
```
Recomended node version 14.15.0 || ^16.10.0 || >=18.0.0

Create your new env file following the .env.example and make sure to fullfiled following configurable variable.
Change the env variable in STAGING or PRODUCTION in myria-client.ts based on the intended environment

## Setup

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