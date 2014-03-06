var fs = require('fs');
var path = require('path');

var _ = require('underscore');

var stripBOM = require('./utils').stripBOM;

/**
 * Updates manifest.webapp under extractDir based on
 * props provided
 */
module.exports = function(extractDir, props, cb) {

        readMetadata(extractDir, function(err, manifest, extractDir) {
                console.log('AOK before X', err, manifest, extractDir);
                _.extend(manifest, props);
               console.log('AOK after', manifest);
fs.writeFile(path.join(extractDir, 'manifest.webapp'),
                     {encoding: 'utf8'},
                     JSON.stringify(manifest, null, 4),
                     function(err) {
           // Package up the app
                             cb(null);
                     });
        });

        
};

// TODO Duplicate code
function readMetadata(extractDir, cb) {
  fs.readFile(path.join(extractDir, 'manifest.webapp'), {
      encoding: 'utf8'
    },
    function(err, data) {
      console.log('AOK OWA WRITER, READING ', extractDir + 'manifest.webapp');
      if (err) {
        return cb(err);
      }
      try {
        var appManifest = JSON.parse(stripBOM(data));
        if (!appManifest.name) {
          cb(new Error('App Manifest is missing a name'));
        }
        // No version is okay, we'll create one based on Mongo IDs
              cb(null, appManifest, extractDir);
      } catch (e) {
        return cb(e);
      }

    });
}