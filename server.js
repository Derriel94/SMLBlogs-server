const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue } = require("firebase/database");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir : path.join(__dirname, 'tmp'),
}));
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3Q7h56VcgyKXlDf2J_EoB38SoZvpjxx4",
  authDomain: "superiormindsblog.firebaseapp.com",
  databaseURL: "https://superiormindsblog-default-rtdb.firebaseio.com",
  projectId: "superiormindsblog",
  storageBucket: "superiormindsblog.appspot.com",
  messagingSenderId: "49247296783",
  appId: "1:49247296783:web:da7e4b8d146951ade9327a",
  measurementId: "G-Y536FDE0JP"
};

// Initialize Firebase

const firebaseapp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseapp);


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

app.get('/', (req, res)=> {
	res.send('Home Son!')


});

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
  			console.log(user.email);
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

app.post('/register', (req, res) => {
	let { email , name, password } = req.body;
	console.log(req.body);
	 if (!email || !name || !password) {
        return res.status(400).send('incorrect form submission');
      } 
      var hash = bcrypt.hashSync(password, saltRounds);
      let tempData = { email, name, hash};
      // Users.push(tempData)
      set(ref(db, 'users/'), {
      	username: name,
      	email: email,
      	hash: hash,
      });
      //this below was just a test, this needs to be in the signin also
      //or just signin period
     if(email === Users[0].emailaddress && password === Users[0].password) {
		return res.send(email);
     }
      
      
      console.log(hash);
})


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