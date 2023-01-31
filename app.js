const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { STATUS_CODES } = require("http");

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/" , function(req, res){
    res.sendFile(__dirname +"/signup.html");
})

app.post("/" , function(req ,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(email);

    const data = {
        members:[
            {
            email_address:email,
            status : "subscribed",
            // address : 
            merge_fields :{
                FNAME: firstName,
                LNAME: lastName
            }
        }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/2d65ecbc61";

    const options ={
        method : "POST",
        auth : "Yash:9ccb7e5a9f1ad5ef5fa12f2be42548e1-us21"
    };

    const request =  https.request(url , options , function(response){

        var statusCode =  response.statusCode;

        if(statusCode === 200){
            res.sendFile(__dirname +"/success.html");
        } else{
            res.sendFile(__dirname +"/failure.html");
        }

        response.on("data" , function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure" , function(req , res){
    res.redirect("/");
})

app.listen(3000 , function(){
    console.log("Server is running on 3000");
})
