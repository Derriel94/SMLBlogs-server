const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path'); 
const bcrypt = require('bcrypt');
const saltRounds = 10;
var mysql = require('mysql');



//Do not need body parser because express takes care of that now
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//setting up sessions insde of the cors function call
//cors helps with protocol when sending data from machine to machine
app.use(cors({ 
	origin: "*",
	methods: ['GET','POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));

app.use(fileUpload({
	useTempFiles: true,
	tempFileDir : path.join(__dirname, 'tmp'),
}));


//initialize session
// app.use(cookieParser());
// app.use(
// 	session({
// 		key: "userName",
// 		secret: "secretsecret",
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// 	);



var con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  port: 3306,
});

//87170e0d

// con.connect(function(err) {
//    if (err) throw err;
//   console.log("Connected!");
// });

app.get('/', (req, res) => {
	console.log("here we are");
});

app.post('/register', (req, res) => {
	let { email , name, password } = req.body;
	console.log(req.body);
	if (!email || !name || !password) {
      return res.status(400).send('incorrect form submission');
  } 
  const hash = bcrypt.hashSync(password, saltRounds);
  let tempData = { email, name, hash};
  
  const sqlinsert = "INSERT INTO user_table (name, email, hash) VALUES (?,?,?)";
	con.query(sqlinsert,[name,email,hash], (err, result)=> {	 		
	 	if (err) {
	 		res.send({err: err});
	 	}
	  if (result) {
	 		console.log('This is working')
	 		console.log(result);
	 		res.send(result);
	 	}
	});
  
})


app.get('/blogs', (req, res) =>{
	const sqlSELECT = "SELECT * FROM blog_table";
	con.query(sqlSELECT, (err, result)=>{
		 if (err) {
		 	return res.send({error: "there is an error in blogs retrievel"})
		 } else {
		 	return res.send(result);
		 }			
		
	})
});

app.post('/signin', (req, res) => {
	let { email, password } = req.body;
	console.log(req.body);
	if (!email || !password) {
		return res.send({err: "You need to enter in both credintials!"})
		} 
		console.log("break1")
		  const sqlSELECT = "SELECT * FROM user_table WHERE email = ?";
			 con.query(sqlSELECT,[email], (err, result)=> {
			 	if (err) {
			 			return res.send({err: "databse issue"})
			 		} else if (result.length !== 0) {
			 			 	const isValid = bcrypt.compareSync(req.body.password, result[0].hash);
			 			 	if (isValid) {
			 			 		return res.send(result);
			 			 	} else {
			 			 		return res.send({ err: "Wrong email/password Combination!"})
			 			 	}
			 		} else {	
			 			return res.send({ err: "Wrong email/password Combination!"})
			 		}
			 		
			 });

})


app.delete('/delete/:textId', (req, res) => {
const id = req.params.textId;
const sqlDelete = "DELETE FROM blog_table WHERE textId = ?"

con.query(sqlDelete,[id], (err, result)=>{
	if (err) {
		console.log(err)
	} else {
		console.log('delete complete')
	}
});
	
});



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