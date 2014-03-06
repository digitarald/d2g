#!/bin/bash
# Usage:
# export NSS_PREFIX=<path to NSS tools> \
# PATH=$NSS_PREFIX/bin:$NSS_PREFIX/lib:$PATH ./generate.sh

# bwalker says:
# I got this to run to completion on my Mac using
# TMP=/tmp DYLD_LIBRARY_PATH=/usr/local/Cellar/nss/3.14.1/lib/ ./generate.sh

set -x

./generate_cert.sh $PWD $PWD/phone-cert.der

./sign_app.sh $PWD $PWD/unsigned.zip $PWD/valid.zip
