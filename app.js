const express = require('express');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');

// environmental variables
require('dotenv').config();

// express app
const app = express();

app.use(cors());
app.use(express.json());

// middleware & static files
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production'){
	app.use(express.static('admin/build'));
}

app.use((req, res, next) => {
	res.locals.path = req.path;
	next();
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/admin', adminRoutes);

// app.use('/login', (req, res) => {
// 	res.send({
// 	  token: 'test123'
// 	});
// });
  
// app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));
