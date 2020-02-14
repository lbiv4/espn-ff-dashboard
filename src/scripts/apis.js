const config = require("./config.json");
const axios = require("axios");

/**
 * Method to provide the API url for historical data beyond two years old.
 * @param {number} year Year
 */
const get_historical_url = year => {
  return `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${config.league_id}`;
};

/**
 * Method to create cookies based on passed in key-value pairs and league privacy
 * @param {Object<JSON>} keyValuePairs Json representing additional key-value pairs to add
 */
const get_cookies = keyValuePairs => {
  let output = "";
  //Add private auth
  if (config.league_private) {
    output += `espn_s2=${config.espn_s2}; SWID=${config.swid}; espn_auth=${config.espn_auth};`;
  }
  //Add other desired cookies
  for (let key in keyValuePairs) {
    output += `${key}=${keyValuePairs[key]};`;
  }
  return output;
};

/**
 * Helper method to run any API call and produce the response data
 * @param {*} url URL for the request
 * @param {*} headers Headers for the request
 * @param {*} params Query parameters for the request
 */
async function get_data(url, headers, params) {
  const options = {
    method: "get",
    url: url,
    params: params,
    headers: headers || { cookie: get_cookies() },
    responseType: "json"
  };
  return await axios(options)
    .then(resp => {
      return resp.data;
    })
    .catch(err => {
      console.log(`Error processing request: ${err}`);
      return null;
    });
}

/**
 * Helper function to map ESPN's int values for position slots to their string representation
 * @param {int} slotId
 * @returns {string} String representation of the input slot id
 */
const slotIdToPos = slotId => {
  const map = {
    0: "QB",
    2: "RB",
    3: "RB/WR",
    4: "WR",
    6: "TE",
    16: "D/ST",
    17: "K",
    20: "BE",
    23: "FLEX"
  };
  return map[slotId];
};

const get_alltime_schedule = async year => {
  const uri = `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${config.league_id}`;
  //const views = ["modular", "mNav", "mMatchupScore", "mRoster", "mScoreboard", "mSettings", "mTopPerformers", "mTeam", "mPositionalRatings", "kona_player_info", "proTeamSchedules_wl"];
  const views = ["mScoreboard"];
  let calls = [];
  for (let i = 2012; i < 2019; i++) {
    const data = {
      view: views.join(","),
      seasonId: i
    };
    const output = await get_data(uri, null, data);
    calls.push(
      output.map(data => {
        return Object.assign(data, { year: i });
      })
    );
  }
  return Promise.all(calls).then(outputs => {
    let schedule = [];
    outputs.forEach(resp => {
      if (resp) {
        let byes = 0;
        let gamesToAdd = resp[0].schedule.map(game => {
          let output = game;
          output["year"] = resp[0].year;
          output["week"] =
            Math.floor((game.id - byes) / (resp[0].teams.length / 2)) + 1;
          if (!game["away"]) {
            byes += 0.5;
            output["home"]["team"] = resp[0].teams[game.home.teamId - 1];
          } else {
            output["home"]["team"] = resp[0].teams[game.home.teamId - 1];
            output["away"]["team"] = resp[0].teams[game.away.teamId - 1];
          }
          return output;
        });
        schedule = schedule.concat(resp[0].schedule);
      }
    });
    return schedule;
  });
};

const get_alltime_players = async () => {
  const uri = `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${config.league_id}`;
  //const views = ["modular", "mNav", "mMatchupScore", "mRoster", "mScoreboard", "mSettings", "mTopPerformers", "mTeam", "mPositionalRatings", "kona_player_info", "proTeamSchedules_wl"];
  let calls = [];
  //Players missing (retired?). Consider looping by year
  //Another URL by year: https://fantasy.espn.com/apis/v3/games/ffl/seasons/2018/players?scoringPeriodId=0&view=players_wl
  let playerData = await get_data(uri, null, {
    view: "kona_player_info"
  });
  if (playerData == null) {
    console.log("Cannot get player data for draft request");
    playerData = [];
  } else {
    playerData = playerData[0].players;
  }
  for (let i = 2012; i < 2019; i++) {
    const data = {
      view: "mDraftDetail",
      seasonId: i
    };
    const output = await get_data(uri, null, data);
    calls.push(
      output.map(data => {
        return Object.assign(data.draftDetail, { year: i });
      })
    );
  }
  return Promise.all(calls).then(outputs => {
    let picks = [];
    outputs.forEach(resp => {
      if (resp) {
        let picksToAdd = resp[0].picks.map(pick => {
          let playerInfo = null;
          let playerIndex = playerData.findIndex(player => {
            return player.id === pick.playerId;
          });
          if (playerIndex >= 0) {
            let player = playerData[playerIndex].player;
            playerInfo = {
              id: player.id,
              defaultPositionId: player.defaultPositionId,
              eligiblePositions: player.eligibleSlots,
              firstName: player.firstName,
              fullName: player.fullName,
              lastName: player.lastName,
              proTeamId: player.proTeamId
            };
          }
          return {
            year: resp[0].year,
            overallNo: pick.overallPickNumber,
            roundNo: pick.roundId,
            pickNo: pick.roundPickNumber,
            teamId: pick.teamId,
            ownerId: pick.memberId,
            player: playerInfo
          };
        });
        picks = picks.concat(picksToAdd);
      }
    });
    return picks;
  });
};

//Test method not for use
const test = async year => {
  const uri = `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${config.league_id}`;
  //const views = ["modular", "mNav", "mMatchupScore", "mRoster", "mScoreboard", "mSettings", "mTopPerformers", "mTeam", "mPositionalRatings", "kona_player_info", "proTeamSchedules_wl"];
  let calls = [];
  //Start calls for player data
  let playerDataCalls = [];
  console.log("start");
  for (let i = 2012; i < 2019; i++) {
    playerDataCalls.push(
      get_data(
        `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${i}/players?scoringPeriodId=0&view=players_wl`,
        null,
        {
          view: "kona_player_info"
        }
      )
    );
  }
  //Start calls for draft data
  for (let i = 2012; i < 2019; i++) {
    const data = {
      view: "mDraftDetail",
      seasonId: i
    };
    const output = await get_data(uri, null, data);
    calls.push(
      output.map(data => {
        return Object.assign(data.draftDetail, { year: i });
      })
    );
  }
  //Wait for player data to finish
  let playerData = await Promise.all(playerDataCalls).then(output => {
    console.log("player promises resolved");
    let players = output.flat();
    players = players.filter((player, index, allPlayers) => {
      return (
        allPlayers.findIndex(elem => {
          return player.id === elem.id;
        }) === index
      );
    });
    console.log("returning player results");
    return players;
  });
  console.log("Past playerData");
  if (playerData == null) {
    console.log("Cannot get player data for draft request");
    playerData = [];
  }
  console.log("Past draft calls");
  return Promise.all(calls).then(outputs => {
    let picks = [];
    outputs.forEach(resp => {
      if (resp) {
        let picksToAdd = resp[0].picks.map(pick => {
          let playerInfo = null;
          let playerIndex = playerData.findIndex(player => {
            return player.id === pick.playerId;
          });
          if (playerIndex >= 0) {
            let player = playerData[playerIndex];
            playerInfo = {
              id: player.id,
              defaultPositionId: player.defaultPositionId,
              eligiblePositions: player.eligibleSlots,
              firstName: player.firstName,
              fullName: player.fullName,
              lastName: player.lastName,
              proTeamId: player.proTeamId
            };
          }
          return {
            year: resp[0].year,
            overallNo: pick.overallPickNumber,
            roundNo: pick.roundId,
            pickNo: pick.roundPickNumber,
            teamId: pick.teamId,
            ownerId: pick.memberId,
            player: playerInfo
          };
        });
        picks = picks.concat(picksToAdd);
      }
    });
    return picks;
  });
};

//Test method not for use
const keyTypes = (val, name, count) => {
  const print = (name, type) => {
    let tabs = " ".repeat(count * 4);
    console.log(`${tabs}${name}: ${type}`);
  };
  if (val == null) {
    return;
  } else if (typeof val === "object") {
    if (Array.isArray(val)) {
      print(name, "array", count);
      return keyTypes(val[0], "ArrayObj", count + 1);
    } else {
      print(name, "object", count);
      Object.getOwnPropertyNames(val).forEach(prop => {
        keyTypes(val[prop], prop, count + 1);
      });
    }
  } else {
    print(name, typeof val);
  }
};

const apis = {
  get_data,
  get_cookies,
  get_alltime_schedule,
  test
};

module.exports = apis;

//export default apis;
