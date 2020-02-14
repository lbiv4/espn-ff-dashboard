const apis = require("./apis");
//const bot = require('./integrations/discord_bot.js');
console.time("test");
apis.test(2020).then(output => {
  console.log(output[0]);
});

/*
apis.get_teams(2019).then(output => {
    console.log(output[0])
})*/
