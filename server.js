require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

require('./router/')(app);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));


app.use("/assets",express.static(__dirname + "/app/assets"));
app.use("/uploads",express.static(__dirname + "/uploads"));
app.use("/node_modules", express.static(__dirname + "/node_modules"))

// make '/app' default route 
app.get('/', function (req, res) {
    return res.redirect('/app');
});



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
  form.uploadDir = path.join(__dirname, '/uploads/'+ req.params.username);

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


// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});