const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

const port = 3002;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || port, ()=>{
    console.log('Server running on port ' + port);
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res)=>{
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    const data = {
        members: [ {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            },
        }
    ]
    };
    const jsonData = JSON.stringify(data);

    const url = 'https://us13.api.mailchimp.com/3.0/lists/73c9f84a6c'

    const options = {
            method: 'POST',
            auth: 'mikecasey:643da36858a3501c4103b399935fbbb0-us13',
        }
    const request = https.request(url, options, (response)=>{
            if(response.statusCode == 200){
                res.sendFile(__dirname + '/success.html');
            } else{
                res.sendFile(__dirname + '/failure.html');
            }
    });

    request.write(jsonData);
    request.end();

});

app.post('/failure', (req, res)=>{
    res.redirect('/');
});