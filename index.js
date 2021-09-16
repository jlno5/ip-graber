const express = require('express');
const fs = require("fs");
const requestIp = require("request-ip");
const moment = require("moment");
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const clientIP = requestIp.getClientIp(req);
    console.log(clientIP);
    const ipListData = fs.readFileSync("./iplist.json", 'utf-8');
    let ipList = JSON.parse(ipListData);

    ipList["ips"].push({ip: clientIP, time: moment().unix() });
    ipList = JSON.stringify(ipList);

    fs.writeFileSync('./iplist.json', ipList);
    return res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

app.get('/admin', (req, res) => {
    if (req.query.password == "test1234" && req.query.username == "admin") {
        const ipListData = fs.readFileSync("./iplist.json", 'utf-8');
        const ipList = JSON.parse(ipListData);
        const newIpList = {ips:[]};

        // ipList.ips = ipList.ips.sort((a, b) => { return a.time - b.time }) IDF why it doesn't work 
        ipList.ips.forEach(element => {
            element.time = moment(element.time * 1000).format("YYYY.MM.DD - HH:mm:ss");
            newIpList.ips.push({ ip: element.ip, time: element.time });
        });

        return res.render('index', newIpList);
    } else {
        return res.redirect('/');
    }

})

app.listen(8008, () => console.log('Listening on http://localhost:8008/'));