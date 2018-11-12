#!/bin/bash

set -eu

project=$1

./scripts/mocha.sh "${project}/**/*.spec.ts"
