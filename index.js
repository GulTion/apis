const express = require('express');

const app = express();
var request = require("request");


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.get('/', (req,res)=>{
	res.send(`<h1>You are in  ${req.query.name} Change from vscode</h1>`)
})
app.get('/csalgo',(req,res)=>{
	var jar = request.jar();
jar.setCookie(request.cookie("__cfduid=d14e8dbb1ba079fa5920f0a00014fdb671596352599"), req.query.url);

var options = {
  method: 'POST',
  url: req.query.url,
  headers: {
    'content-type': 'application/json',
    authorization: 'Basic SGFySGFyTWFoYWRldjpIYXJIYXJNYWhhZGV2'
  },
  body: {q: '', password: null, page_token: null, page_index: 0},
  json: true,
  jar: 'JAR'
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  res.json(body)
});

})
app.listen(process.env.PORT||3001,()=>{                                                            
	console.log('Server is Starting');
})