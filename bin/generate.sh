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

# create a new certificate using NSS's certutil
create_cert()
{
  # initalize config/certs dir
  configCertsDir=$1

  # initialize temp directory
  tmpdir=$TMP/test_signed_apps
  rm -Rf $tmpdir
  mkdir $tmpdir

  # password file persists in the configCerts dir
  passwordfile=$configCertsDir/passwordfile

  # initialize noise file
  noisefile=$tmpdir/noise
  head -c 32 /dev/urandom > $noisefile

  # create password file
  echo password1 > $passwordfile

  # XXX: certutil cannot generate basic constraints without interactive prompts,
  #      so we need to build response files to answer its questions
  # XXX: certutil cannot generate AKI/SKI without interactive prompts so we just
  #      skip them.
  ca_responses=$tmpdir/ca_responses
  ee_responses=$tmpdir/ee_responses  
  echo y >  $ca_responses # Is this a CA?
  echo >>   $ca_responses # Accept default path length constraint (no constraint)
  echo y >> $ca_responses # Is this a critical constraint?
  echo n >  $ee_responses # Is this a CA?
  echo >>   $ee_responses # Accept default path length constraint (no constraint)
  echo y >> $ee_responses # Is this a critical constraint?

  # XXX: We cannot give the trusted and untrusted versions of the certs the same
  # subject names because otherwise we'll run into
  # SEC_ERROR_REUSED_ISSUER_AND_SERIAL.
  org="O=Examplla Corporation,L=Mountain View,ST=CA,C=US"
  ca_subj="CN=Examplla Root CA,OU=Examplla CA,$org"
  ee_subj="CN=Examplla Marketplace App Signing,OU=Examplla Marketplace App Signing,$org"

  # create a database using the password file
  db=$configCertsDir/trusted
  mkdir -p $db
  certutil -d $db -N -f $passwordfile

  make_cert="certutil -d $db -f $passwordfile -S -v 480 -g 2048 -Z SHA256 \
                      -z $noisefile -y 3 -2 --extKeyUsage critical,codeSigning"
  $make_cert -n ca1        -m 1 -s "$ca_subj" \
             --keyUsage critical,certSigning      -t ",,CTu" -x < $ca_responses
  $make_cert -n ee1 -c ca1 -m 2 -s "$ee_subj" \
             --keyUsage critical,digitalSignature -t ",,,"      < $ee_responses

  # In case we want to inspect the generated certs
  certutil -d $db -L -n ca1 -r -o $db/ca1.der
  certutil -d $db -L -n ee1 -r -o $db/ee1.der

  # dump the trusted cert into a DER file
  certutil -d $db -f $passwordfile -L -n ca1 -r -o $configCertsDir/trusted_ca1.der  

  # now that we're done with it, remove tmpdir
  rm -Rf $tmpdir
}

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

# create a trusted cert
create_cert $theConfigCertsDir

# sign unsigned.zip from source dir using the trusted cert. Put the result in valid.zip
# NOTA BENE: unsigned.zip must exist already
sign_app_with_cert $theConfigCertsDir $srcdir/unsigned.zip $srcdir/valid.zip

