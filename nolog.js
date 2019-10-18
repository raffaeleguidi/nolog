const axios = require("axios");
const qs = require("querystring");
const moment = require("moment");
const argv = require('minimist')(process.argv.slice(2));

console.log("nolog (c) 2019 RpG (-h or --help for help)");

if (argv.help || argv.h) {
  console.log("   --user myuser");
  console.log("   --password mypass");
  console.log("   --query \"this AND that\"");
  console.log("   --filter stream:xxxxx>");
  console.log("   --refresh 5");
  console.log("   --fields timestamp,CONTAINER_NAME,message>");
  console.log("   --help/-h - shows this message");
  return;
}

const readlineSync = require('readline-sync');

const username = argv.user || readlineSync.question('User: ');
const password = argv.password || readlineSync.question('Password: ', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
const fields = argv.fields || "timestamp,CONTAINER_NAME,message";
const fieldsList = fields.split(",");

const GRAYLOG_API = argv.url || process.env.GRAYLOG_API || "http://graylog.intra.bnlpositivity.it/api";
const refreshEvery = argv.refresh || 5;

var latestRow =  null;

const search = (seconds, latestRow) => {
  const from =  (latestRow ? moment(latestRow.timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ").add(1, "milliseconds") : moment().add(-seconds, "seconds"))
  axios.get(GRAYLOG_API + '/search/universal/absolute?' + qs.stringify({ 
      query: argv.query || "_exists_:CONTAINER_NAME",
      from: from.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      to: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      filter: argv.filter,
      sort: argv.sort || "timestamp:desc"
    }), {  
      auth: {
      username: username,
      password: password
    }
  })
  .then(function (response) {
    response.data.messages.reverse().forEach(m => { 
      latestRow = m.message;
      const row = new Array();
      fieldsList.forEach(f => {
        if (m.message[f])
          row.push(m.message[f])
      });
      console.log(row.join(" "));
    });
  })
  .catch(function (error) {
    console.error("error:", error.response.status, error.response.statusText);
    process.exit(1);
  })
  .finally(function () {
    setTimeout(function(){
      search(refreshEvery, latestRow  );
    }, refreshEvery * 1000);
  });
};

search(500);
