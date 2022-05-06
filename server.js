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
  password: "password",
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

app.post('/register', (req, res) => {
	let { email , name, password } = req.body;
	console.log(req.body);
	 if (!email || !name || !password) {
        return res.status(400).send('incorrect form submission');
      } 
      var hash = bcrypt.hashSync(password, saltRounds);
      let tempData = { email, name, hash};
      console.log(hash)
   //    db.query('INSERT INTO users(name, email, hash)VALUES(' + name + ',' + email + ',' + hash +')', (err, res) => {
  	// 			console.log(err, res)
  	// 			db.end()
  		const sqlinsert = "INSERT INTO user (username, email, password) VALUES (?,?,?)";
			 con.query(sqlinsert,[name,email,hash]);
    //   let id = '';
  		// for(let i = 0; i < 4; i++){
    //         id += name[Math.floor(Math.random() * name.length)];
    //     }

      // Users.push(tempData)
      // set(ref(db, 'users/'), {
      // 	username: name,
      // 	email: email,
      // 	hash: hash,
      // });
  

      
      console.log(hash);
})

app.post('/signin', (req, res) => {
	let { email, password } = req.body;
	console.log(req.body);
	if (!email || !password) {
		return res.status(400).json({
			'message':'Password or Email was not entered'
			});
	} 
			var logInfo = ref(db, 'users/');

			onValue(logInfo, (snapshot) => {
  			const user = snapshot.val();
  			console.log(user);
			const isValid = bcrypt.compareSync(req.body.password, user.hash);
			console.log(isValid)
  			// updateUsers(postElement, data);
			console.log(email === user.email && isValid)
			if(email === user.email && isValid) {
				console.log(user)
				return res.json(user);
     		} else {
     			console.log()
     			return res.status(400).send('wrong credits');
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