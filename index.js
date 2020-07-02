const express = require('express')
const app = express();
app.get('/', (req,res)=>{
	res.send(`<h1>Working ${req.query.name}</h1>`)
})
app.listen(process.env.PORT||3000)