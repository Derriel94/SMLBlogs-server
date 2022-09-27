const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path'); 
const bcrypt = require('bcrypt');
const saltRounds = 10;
var mysql = require('mysql');
const cookieParser = require("cookie-parser");
const session = require("express-session");



//Do not need body parser because express takes care of that now
app.use(express.urlencoded({extended: true}));
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


//initialize session
app.use(cookieParser());
app.use(
	session({
		key: "userName",
		secret: "secretsecret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 60 * 60 * 24 * 1000
		}
	})
	);


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "(StoreWhat?94)",
  database: "blogdb",
  insecureAuth : true
});


con.connect(function(err) {
  // if (err) throw err;
  console.log("Connected!");
});



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



app.get('/blogs', (req, res) =>{
	const sqlSELECT = "SELECT * FROM blog_table";
	con.query(sqlSELECT, (err, result)=>{
		 if (err) {
		 	res.send({error: err})
		 }
			res.send(result);
		// console.log(result)
	})
});

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
			 			console.log(result[0].email) 
			 			req.session.user = result;
			 			console.log(req.session.user)
      			res.send(result);
      						
			 		} else {
			 			console.log('wrong password')
			 			res.send({ message: "Wrong email/password Combination!"})
			 		}
			 		
			 });

})


app.get('/signin', (req, res) => {
	console.log(req.session.user) 
	if (req.session.user) {
		res.send({loggedIn: true, user: req.session.user});
	} else {
		res.send({loggedIn: false});
	}
})



app.post('/editor', (req, res)=> {
	const { textArea, blogTitle } = req.body;

	if (!textArea || !blogTitle){
		return res.status(400).send({
   					message: 'This is an error!'
				}); 
	} else {
		const sqlinsert = "INSERT INTO blog_table (textArea, blogTitle) VALUES (?,?)";
	con.query(sqlinsert,[ textArea, blogTitle], (err, result)=> {	 		
	 	if (err) {
	 		res.send({err: err});
	 	}
	  if (result) {
	 		console.log('This is working')
	 		res.send(result);
	 	}
	});
	}
	

});


//process.env chooses a port that is given, if it is given even.
app.listen(process.env.PORT || 3001, ()=> {
	console.log("appp is here")
})