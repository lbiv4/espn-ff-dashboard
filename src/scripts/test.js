const apis = require("./apis");
//const bot = require('./integrations/discord_bot.js');
apis.test(2020).then(output => {
  console.log(
    output.filter(game => {
      return game.year == 2017 && game.week == 15;
    })
  );
});

/*
apis.get_teams(2019).then(output => {
    console.log(output[0])
})*/
