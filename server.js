const express = require('express');
const cors = require('cors')

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const database = { };

app.get('/', (req, res)=> {
	console.log('/home')


});



//process.env chooses a port that is given, if it is given even.
app.listen(process.env.PORT || 3001, ()=> {
	console.log("appp is here")
})