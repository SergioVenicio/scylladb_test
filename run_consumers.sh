#!/bin/sh

pm2 start --no-daemon ./build/app/consumers/index.js -- consume $CONSUMER_NAME