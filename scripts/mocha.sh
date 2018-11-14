#!/bin/bash

set -eu

target=$1

find_project () {
  found=""
  for x in $(find ./projects -name "tsconfig.json" -exec dirname {} \;)
  do
    if [[ ${target} =~ ^${x} ]]; then
      found=${x}
      break
    fi
  done
  echo ${found}
}

project=$(find_project)

if [[ "" == ${project} ]]; then
  echo "project not found: ${target}"
  exit 1
fi

line=$(cat << EOS
TS_NODE_PROJECT="${project}/tsconfig.json"\
 $(npm bin)/mocha\
 --require ts-node/register\
 --require tsconfig-paths/register\
 "${target}"
EOS
)
echo "> ${line}"
eval ${line}
