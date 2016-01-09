#!/bin/bash

if [ ! -d "node_modules" ]; then
  npm install -d --unsafe-perm
fi

npm start
