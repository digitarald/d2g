#!/bin/bash
# Usage:
# export NSS_PREFIX=<path to NSS tools> \
# PATH=$NSS_PREFIX/bin:$NSS_PREFIX/lib:$PATH ./generate.sh

# bwalker says:
# I got this to run to completion on my Mac using
# TMP=/tmp DYLD_LIBRARY_PATH=/usr/local/Cellar/nss/3.14.1/lib/ ./generate.sh

set -x

# let the source directory be the current working directory
srcdir=$PWD

# sign an app for the input file and output file.
# assumes the global password file and cert database still exist
sign_app_with_cert()
{
  # initalize config/certs dir
  configCertsDir=$1

  # password file persists in the configCerts dir
  passwordfile=$configCertsDir/passwordfile

  unsigned_zip=$2
  out_signed_zip=$3

  db=$configCertsDir/trusted

  python sign_b2g_app.py -d $db -f $passwordfile -k ee1 -i $unsigned_zip -o $out_signed_zip -S test_app_identifier -V 1
}

theConfigCertsDir=/Users/walker/mozilla/d2g/bin

# sign unsigned.zip from source dir using the trusted cert. Put the result in valid.zip
# NOTA BENE: unsigned.zip must exist already
sign_app_with_cert $theConfigCertsDir $srcdir/unsigned.zip $srcdir/valid.zip

