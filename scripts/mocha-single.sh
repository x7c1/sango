#!/bin/bash

set -eu

file_path=$1

if ! [[ ${file_path} =~ .spec.ts$ ]]; then
    echo "unknown file type: $(basename ${file_path})"
    exit 1
fi

./scripts/mocha.sh ${file_path}
