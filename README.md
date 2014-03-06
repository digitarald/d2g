Distribute to Gecko aka D2G
=================

A service that makes it easy for developers to get Beta testers
to install certified apps.

## Dependencies

* NodeJS 0.10.x
* MongoDB 2.4.9
* zip, unzip (UnZip, by Info-ZIP will work)

## Installing on Ubuntu

    # install nodejs and mongodb manually for latest
    $ sudo apt-get install mongodb unzip zip
    $ cd d2g
    $ cp config/config.js-dist config/config.js
    # edit config.js audience if it isn't http://localhost:3000
    $ cp config/secrets.js-dist config/secrets.js
    $ npm install
    $ 


## Running Service

    npm start

## Resetting everything

    npm run-script clean