module.exports = function (app, dirPath) {

const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

app.get('/profilePic/:username', function(req, res) {
  const userProfileDir = './uploads/'+ req.params.username;

  fs.readdir(userProfileDir, (err, files) => {
     if (fs.existsSync(userProfileDir)){
        files.forEach(file => {
          console.log(file);
          res.send(file)
        });
     }
     else {
      console.log('folder not exist...');
     }
  });
});
  /* upload files */
app.post('/upload/:username', function(req, res) {

    var dir = './uploads/' + req.params.username;
    var randomNum = Math.floor((Math.random() * 1000) + 1);

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  else {
    removeFiles(dir);
  }

   function removeFiles(dirPath) {
        try { var files = fs.readdirSync(dirPath); }
        catch(e) { return; }
        if (files.length > 0)
          for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
              fs.unlinkSync(filePath);
          }
      };

  // create an incoming form object
  var form = new formidable.IncomingForm();
  var maxSize = 31460000; // 30MB

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(dirPath, '/uploads/'+ req.params.username);

  form.on('fileBegin', function(name, file){
        if(form.bytesExpected > maxSize)
        {
            this.emit('error', 'Size must not be over 0.3 MB');
        }
  });

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    var type = file.type;
    type = type.split('/');
    type = type[1];


    if(type != 'jpeg' && type != 'png') {
      this.emit('error', 'file format not supported');
      fs.unlink(file.path);
    }
    else {
      fs.rename(file.path, path.join(form.uploadDir, randomNum +'.png') );
    }
  });

  form.on('error', function(message) {
        if(message)
        {
            res.json({err: message});
        }
        else
        {
            res.json({err: 'Upload error, please try again'});
        }
    });


  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.json({profileName: randomNum});
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

}