const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path'); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir : path.join(__dirname, 'tmp'),
}));
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Users = [
		
		{id: 0,
		name: 'Daniel',
		emailaddress: 'derrielcollins96@gmail.com',
		password: 'ten',
		},
		{id: 1,
		name: 'Derriel',
		emailaddress: 'cratercollins96@gmail.com',
		password: '',
		}
]

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

app.get('/', (req, res)=> {
	res.send('Home Son!')


})
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

app.post('/signin', (req, res) => {
	let { email, password } = req.body;
	console.log(req.body);
	if (email.length < 1 || password.length < 1) {
		return res.status(400).json({
			'message':'Password or Email was not entered'
			});
		} else {

		  const sqlSELECT = "SELECT * FROM users WHERE email = ?";
			 con.query(sqlSELECT,[email], (err, result)=> {
			 		const isValid = bcrypt.compareSync(req.body.password, result[0].hash);
			 		if (err) {
			 			res.send({err: err})
			 		}

			 		if (result.length > 0 && isValid) {
			 			
			 			console.log(result[0].name);
			 			console.log('password hash match')
			 			res.json(result[0]);
			 		} else {
			 			console.log('wrong password')
			 			res.send({ message: "Wrong email/password Combination!"})
			 		}
			 		
			 });
			}

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