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
	}
	

});

app.post('/register', (req, res)=> {
	let { email , name, password } = req.body;
	console.log(req.body);
	 if (!email || !name || !password) {
        return res.status(400).send('incorrect form submission');
      } 
      var hash = bcrypt.hashSync(password, saltRounds);
      let tempData = { email, name, hash};
      Users.push(tempData)
      //this below was just a test, this needs to be in the signin also
      //or just signin period
     if(email === Users[0].emailaddress && password === Users[0].password) {
		return res.send(email);
     }
      
      
      console.log(hash);
})

console.log(Users)

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