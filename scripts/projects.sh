#!/bin/bash

set -eu

cmd=$1
name=tsconfig.json

list () {
  find ./projects -name "${name}"\
   | sed -e "s/\/${name}//"
}

for path in $(list)
do
    line="${cmd} ${path}"
    echo "> ${line}"
    ${line}
    echo "(exited with $?)"
done
