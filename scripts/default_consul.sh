#!/bin/sh

# Populates the consul config key for the service
# using the default configuration provided in the services etc/config folder

INPUT=$1
SERVICE=${INPUT%$NL}

CONFIG_FILE=${SERVICE}/etc/config/config.json
CONFIG_KEY=lunamals/config/${SERVICE}.json
echo $CONFIG_KEY
echo $CONFIG_FILE

consul kv put $CONFIG_KEY @$CONFIG_FILE
