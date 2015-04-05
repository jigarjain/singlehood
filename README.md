# SingleHood
All cloud service under one hood

##Requirements
- Mongodb >= 2.4.0
- Node >= 0.11

##Installation

    git clone git@bitbucket.org:jigarjain/singlehood.git singlehood
    cd singlehood
    npm install -g grunt-cli
    npm install
    npm install -g bower
    bower install
    grunt

##Configuration
Configuration files are inside the ***cfg*** directory. The base configuration
is in ***cfg/index.js***. The `NODE_ENV` environment variable determines which
file inside ***cfg*** will extend the default config. Default environment is
'development'


##Start services

    # website
    node --harmony io/web.js

You can now access the website on [localhost:8765](http://localhost:8765)


##Testing
Make sure dev-dependencies are installed and run:

    npm test

To test a single file, use [mocha](http://visionmedia.github.io/mocha/) directly. Ex -

    mocha --harmony tests/users.js
