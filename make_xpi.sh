#!/bin/bash

. ./PACKAGE_NAME

xpi_contents="chrome components defaults license platform *.js *.rdf *.manifest *.inf *.cfg *.light";
TEMP_DIR="xpi_temp";

rm -rf ${TEMP_DIR}
rm -ff ${PACKAGE_NAME}.xpi
rm -ff ${PACKAGE_NAME}_en.xpi
rm -ff ${PACKAGE_NAME}_noupdate.xpi
rm -ff ${PACKAGE_NAME}_noupdate_en.xpi
rm -ff ${PACKAGE_NAME}.lzh

sed -e "s/YOUR_PACKAGE/${PACKAGE_NAME}/g" chrome.manifest.in > chrome.manifest

# create temp files
mkdir -p ${TEMP_DIR} 
for f in ${xpi_contents}; do
  if [ -d ${f} -o -f ${f} ]; then
    cp -rp ${f} ${TEMP_DIR}
  fi
done

cp -rp content ${TEMP_DIR}
cp -rp locale ${TEMP_DIR}
cp -rp skin ${TEMP_DIR}

# pack platform related resources
if [ -d ./platform ]; then
  cp -rp platform ${TEMP_DIR}
  pushd ${TEMP_DIR}/platform

  for dirname in *; do
    if [ -f $dirname/chrome.manifest ]; then
      pushd $dirname
      mkdir -p chrome
      zip -r -0 chrome/$PACKAGE_NAME.jar content locale skin -x \*/.svn/\* || exit 1
      rm -rf content
      rm -rf locale
      rm -rf skin
      popd
      fi
    done
  popd
fi

pushd ${TEMP_DIR}

# create jar
mkdir -p chrome
zip -r -0 ./chrome/$PACKAGE_NAME.jar content locale skin -x \*/.svn/\* || exit 1


if [ -f ./install.js ]; then
  cp -p ../ja.inf ./locale.inf
  cp -p  ../options.$PACKAGE_NAME.ja.inf ./options.inf
fi


#create xpi (Japanese)
zip -r -9 ../$PACKAGE_NAME.xpi $xpi_contents -x \*/.svn/\* || exit 1

#create xpi without update info (Japanese)
# rm -f install.rdf
# sed -e "s#^.*<em:*\(updateURL\|updateKey\)>.*</em:*\(updateURL\|updateKey\)>##g" -e "s#^.*em:*\(updateURL\|updateKey\)=\(\".*\"\|'.*'\)##g" ../install.rdf > install.rdf
# zip -r -9 ../${PACKAGE_NAME}_noupdate.xpi $xpi_contents -x \*/.svn/\* || exit 1



# create lzh
if [ -f ../readme.txt ]; then
  lha a ../$PACKAGE_NAME.lzh ../$PACKAGE_NAME.xpi ../readme.txt
fi


#create xpi (English)
if [ -f ./install.js ]; then
  rm -f install.rdf
  rm -f locale.inf
  rm -f options.inf
  cp -p ../install.rdf ./install.rdf
  cp -p ../en.inf ./locale.inf
  cp -p ../options.$PACKAGE_NAME.en.inf ./options.inf
  zip -r -9 ../${PACKAGE_NAME}_en.xpi $xpi_contents -x \*/.svn/\* || exit 1

  rm -f install.rdf
  sed -e "s#^.*<em:*\(updateURL\|updateKey\)>.*</em:*\(updateURL\|updateKey\)>##g" -e "s#^.*em:*\(updateURL\|updateKey\)=\(\".*\"\|'.*'\)##g" ../install.rdf > install.rdf
  zip -r -9 ../${PACKAGE_NAME}_noupdate_en.xpi $xpi_contents -x \*/.svn/\* || exit 1
fi



#create meta package
if [ -d ../meta ]; then
  rm -f ../meta/$PACKAGE_NAME.xpi
  cp ../$PACKAGE_NAME.xpi ../meta/$PACKAGE_NAME.xpi
fi

# end
popd
rm -rf ${TEMP_DIR}

# create hash
# sha1sum -b ${PACKAGE_NAME}*.xpi > sha1hash.txt

exit 0;
# vim:nowrap:ts=2:expandtab:sw=2:
