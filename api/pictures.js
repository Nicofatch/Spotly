var path = require('path'),
    fs = require('fs'),
    uuid = require('node-uuid');

exports.add = function(req, res) {
    var tempPath = req.files.file.path,
        extension = path.extname(req.files.file.name).toLowerCase(),
        targetPath = path.resolve('./public/uploads/' + uuid.v1() + extension);

    console.log('Uploading picture with path = '+tempPath);
    
    if (extension === '.png' || extension === '.jpg') {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload completed in folder " + targetPath);
            res.send(targetPath.replace(/^.*[\\\/]/, ''));
        });
    } else {
        fs.unlink(tempPath, function () {
            console.error("Only image files are allowed! (.jpg or .png)");
            if (err) throw err;
        });
    }
}


