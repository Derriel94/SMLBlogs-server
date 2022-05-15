const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path'); 
const bcrypt = require('bcrypt');
const saltRounds = 10;
var mysql = require('mysql');
const session = require("express-session");



//Do not need body parser because express takes care of that now
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//setting up sessions insde of the cors function call
//cors helps with protocol when sending data from machine to machine
app.use(cors({ 
	origin: ["http://localhost:3000"],
	methods: ["GET", "POST"],
	credentials: true,
}));
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir : path.join(__dirname, 'tmp'),
}));

//We will use this object and if statement to initialize 
// sessions for production.
// var sess = {
//   secret: 'keyboard cat',
//   cookie: {}
// }

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }

// app.use(session(sess))


//initialize session
app.set("trust proxy", 1);
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
		cookie: {
			httpOnly: false,
			sameSite: "none",
			maxAge: 60 * 60 * 24 * 1000
		}
	})
	);


// const Users = [
		
// 		{id: 0,
// 		name: 'Daniel',
// 		emailaddress: 'derrielcollins96@gmail.com',
// 		password: 'ten',
// 		},
// 		{id: 1,
// 		name: 'Derriel',
// 		emailaddress: 'cratercollins96@gmail.com',
// 		password: '',
// 		}
// ]

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "(StoreWhat?94)",
  database: "blogdb",
  insecureAuth : true
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.get('/blogs', (req, res)=> {
	 const sqlSELECT = "SELECT * FROM user";
			 con.query(sqlSELECT, (err, result)=> {
			 		console.log('This is working')
			 });
			


})

app.post('/register', (req, res) => {
	let { email , name, password } = req.body;
	console.log(req.body);
	if (!email || !name || !password) {
      return res.status(400).send('incorrect form submission');
  } 
  const hash = bcrypt.hashSync(password, saltRounds);
  let tempData = { email, name, hash};
  console.log(hash)
  const sqlinsert = "INSERT INTO users (name, email, hash) VALUES (?,?,?)";
	con.query(sqlinsert,[name,email,hash], (err, result)=> {	 		
	 	if (err) {
	 		res.send({err: err});
	 	}
	  if (result) {
	 		console.log('This is working')
	 		res.send(result);
	 	}
	});
  console.log(hash);
})


app.get('/sess', (req, res) => {
	console.log(req.session.user) 
	if (req.session.user) {
		res.send({loggedIn: true, user: req.session.user});
	} else {
		res.send({loggedIn: false});
	}
})

app.post('/signin', (req, res) => {
	let { email, password } = req.body;
	console.log(req.body);
	if (!email || !password) {
		return res.status(400).json({
			'message':'Password or Email was not entered'
			});
		} 
		  const sqlSELECT = "SELECT * FROM users WHERE email = ?";
			 con.query(sqlSELECT,[email], (err, result)=> {
			 		const isValid = bcrypt.compareSync(req.body.password, result[0].hash);
			 		if (err) {
			 			res.send({err: err})
			 		}

			 		if (result.length > 0 && isValid) {
			 				console.log('password hash match')
			 			req.session.regenerate((err)=> {
			 				if (err) next(err)
			 			
			 			 req.session.user = result[0];
			 			console.log(req.session.user);
			 			// console.log(result[0].name);
			 			   	req.session.save(function (err) {
      					if (err) return next(err)
      						res.send(result);
      						
    						})

			 			})
			 		} else {
			 			console.log('wrong password')
			 			res.send({ message: "Wrong email/password Combination!"})
			 		}
			 		
			 });

})


app.post('/editor', (req, res)=> {
	const { textArea, blogTitle } = req.body;
	console.log(textArea, blogTitle);
	if (!textArea || !blogTitle){
		return res.status(400).send({
   					message: 'This is an error!'
				}); 
	} else {
		res.send("we got the goods");
		set(ref(db, 'blogs/'), {
      	blogTitle: blogTitle,
      	textArea: textArea,
      });
	}
	

});



//This happens wheen we attempt to upload the image file
app.post('/upload', (req, res)=> {
	if (!req.files) {
		return res.status(400).send('There is no image saved');
	}
	const { formData } = req.files.file;

	if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No Image has been uploaded.');
    }
    // Accessing the file by the <input> File name="t_file"

    let targetFile = req.files.file;
    console.log(targetFile);
    //mv(path, CB function(err))
    targetFile.mv(path.join(__dirname, 'uploads', targetFile.name), (err) => {
        if (err){
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });

});


//process.env chooses a port that is given, if it is given even.
app.listen(process.env.PORT || 3001, ()=> {
	console.log("appp is here")
})