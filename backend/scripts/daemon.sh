#!/bin/sh

# utility script to run the fastapi server as a daemon
# via supervisord on the production server

script_path="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $script_path

make production