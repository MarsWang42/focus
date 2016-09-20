'use strict';

//DNS server related modules
let dns = require('native-dns');
let async = require('async');

// UI server related modules
let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');

// Import the configuration file.
let config = require('./config.json')

// Set default constants. Default authority is set to be
// the public DNS server 8.8.8.8 operated by Google.
let default_authority = {
    address: '8.8.8.8',
    port: 53,
    type: 'udp'
};

let default_blacklist = [{
    domain: "\\w+.facebook.+\\w"
}];

let records = [{
    "type": "A",
    "address": "127.0.0.99",
    "ttl": 1800
}]

// If the domain is not in the blacklist, the DNS request will
// be forwarded to the authority we set.
function proxy(question, response, cb) {
    // console.log(`${ question.name } is not in the blacklist, proxying.`);

    var request = dns.Request({
        question: question, // forwarding the question
        server: config.authority || default_authority, // by default 8.8.8.8
        timeout: 1000
    });

    // When we get answers, append them to the response.
    request.on('message', (err, msg) => {
        msg.answer.forEach(a => response.answer.push(a));
    });

    request.on('end', cb);
    // After all, send the modified request.
    request.send();
}

function handleRequest(request, response) {
    // console.log(`Handling request from ${ request.address.address } for ${ request.question[0].name }`);

    let f = [];

    request.question.forEach(question => {

        // Check whether the domain is in the blacklist or not.
        let blacklist = config.blacklist || default_blacklist;
        let entry = blacklist.filter(r => new RegExp(r.domain, 'i').exec(question.name));
        if (entry.length) {

            // If it is in the blacklist, directly response with our address.
            console.log(`${ question.name } is in the blacklist. Redirecting...`)
            records.forEach(record => {
                record.name = question.name;
                record.ttl = record.ttl || 1800;
                response.answer.push(dns[record.type](record));
            });
        } else {

            // Otherwise, using the proxy function.
            f.push(cb => proxy(question, response, cb));
        }
    });

    // Do the proxy in parallel.
    async.parallel(f, function() {
        response.send();
    });
}

// Start the DNS server.
let server = dns.createServer();

server.on('listening', () => console.log(`server listening on ${ server.address().address }`));
server.on('close', () => console.log(`server ${ server.address().address }`));
server.on('error', (err, buff, req, res) => console.error(err.stack));
server.on('socketError', (err, socket) => console.error(err));
server.on('request', handleRequest);

server.serve(53, '127.0.0.1');


// Start the UI server
let app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/save', (req, res) => {
    // Once user changed setting, renew the config variable
    // and write the new config into config.json.
    config = req.body;
    fs.writeFileSync('config.json', JSON.stringify(config));
    res.status(200).send('ok');
});

app.listen(5201);

