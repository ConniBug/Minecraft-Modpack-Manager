const express = require('express');
const app = express();
const port = 80;

const fs = require('fs');

app.get('/modPack-info', (req, res) => {
    var currentPack = req.query.packID;
    var packName = currentPack;
    var packVersion = "1.16.3";

    var build = packName + "," + packVersion + ",";

    fs.readdirSync("./" + currentPack + "/mods").forEach(file => {
        build += file + "," ;
    });

    res.send(build);
});

app.get('/downloadMods', (req, res) => {
    var currentPack = req.query.packID;
    var packName = currentPack;

    res.download("./" + packName + "/mods.zip", function (err) {
        if (err) {
            // Handle error, but keep in mind the response may be partially-sent
           // so check res.headersSent
         } else {
          // decrement a download credit, etc.
         }
    });
});

app.get('/clientInfo', (req, res) => {
    res.send("V1.0.0.0");
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
});
 