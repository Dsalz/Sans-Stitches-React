# Sans-Stitches-React

[![Test Coverage](https://api.codeclimate.com/v1/badges/7c888e0034be2a1648cd/test_coverage)](https://codeclimate.com/github/Dsalz/Sans-Stitches-React/test_coverage) [![Build Status](https://travis-ci.org/Dsalz/Sans-Stitches-React.svg?branch=develop)](https://travis-ci.org/Dsalz/Sans-Stitches-React)

## Table of Contents

- [About](#about)
- [Setup](#setup)
- [Operation](#operation)

## About

- This is the react implementation of the sans-stitches project which aims to provide a platform for people to report wrong doings and general inadequacies to the government
- Platform state managed with redux
- Testing frameworks used are Jest and Enzyme
- Project management for project can be found [here](https://www.pivotaltracker.com/n/projects/2312682)

## Setup

### Online

- Navigate to https://sans-stitches-react.herokuapp.com to begin using the platform

### Locally

- Clone this repository
- Navigate to project folder
- Run `npm install` to install all dependencies
- Run `npm run start-dev` to start the project in development mode at port 8080
- Run `npm run build` then `npm start` to start the project in production mode at port 3080
- Run `npm test` to run test suite

## Operation

- Sign Up or Login to access the user dashboard to start creating red flag and intervention records
- From the dashboard you can view, edit and delete your records;
- To access the admin dashboard, login with email `admin@yahoo.com` and password `goldilocks` and from here you can view all the records on the platform and update their status as well as leave feedback if need be

- NB: The Google map component caches data on the browser so if the map is showing old data just refresh the page
