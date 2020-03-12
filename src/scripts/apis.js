const config = require("./config.json");
const axios = require("axios");
const fs = require("fs");

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
    1: "QB", //Technically TQB?
    2: "RB",
    3: "RB/WR",
    4: "WR",
    5: "K", //Kicker for some reason????
    6: "TE",
    16: "D/ST",
    17: "K",
    20: "BE",
    23: "FLEX"
  };
  return map[slotId];
};

/**
 * Function to do APIs call to set info on all games played.
 * @param {*} year Upperbound
 */
const get_alltime_schedule = async year => {
  const uri = `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${config.league_id}`;
  const views = ["mScoreboard"];
  let calls = [];
  //For every year, create the api call of that years data and push to array of Promises
  for (let i = 2012; i < 2020; i++) {
    const data = {
      view: views.join(","),
      seasonId: i
    };
    const output = await get_data(uri, null, data);
    calls.push(
      //Add year because not otherwise provided in data
      output.map(data => {
        return Object.assign(data, { year: i });
      })
    );
  }
  //Use Promise.all to make sure all calls finish, then map results to desired format
  return Promise.all(calls).then(outputs => {
    //An error will return a null value - in this case use local data
    if (outputs.includes(null)) {
      return get_alltime_schedule_local();
    }
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
        schedule = schedule.concat(gamesToAdd);
      }
    });
    return schedule;
  });
};

const get_all_draft_info = async year => {
  const uri = `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${config.league_id}`;
  let calls = [];
  //For every year, create the api call of that years data and push to array of Promises
  let playerDataCalls = [];
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
  for (let i = 2012; i < 2020; i++) {
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
    //An error will return a null value - in this case use local data
    if (output.includes(null)) {
      return get_alltime_schedule_local();
    }
    let players = output.flat();
    players = players.filter((player, index, allPlayers) => {
      return (
        allPlayers.findIndex(elem => {
          return player.id === elem.id;
        }) === index
      );
    });
    return players;
  });
  if (playerData == null) {
    console.log("Cannot get player data for draft request");
    playerData = [];
  }
  return Promise.all(calls).then(outputs => {
    //An error will return a null value - in this case use local data
    if (outputs.includes(null)) {
      return get_all_draft_info_local();
    }
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
/*
    As a note, ESPN took down APIs temporarily for maintanence right before project demo. To remedy this, I had some local data
    files and transformed them to match the same output from the api calls above. The following code is a now a backup in case API
    calls fail to ensure that some data is produced
  */

//TEMP FOR LOCAL DATA ACCESS
const teamId = {
  LB: 1,
  DG: 2,
  OB: 3,
  CD: 4,
  ML: 5,
  DK: 6,
  CN: 7,
  NN: 8,
  WF: 9,
  PD: 10,
  RW: 10
};

//TEMP FOR LOCAL DATA ACCESS
const get_all_draft_info_local = () => {
  return fetch("/data/drafts.csv", { mode: "no-cors" })
    .then(response => response.text())
    .then(data => {
      let lines = data.split("\n");
      const headers = lines[0].split(",");
      let result = lines.slice(1).map(line => {
        let output = {};
        line.split(",").forEach((value, index) => {
          output[headers[index]] = value.trim();
        });
        let labels = output.labels.replace(/\s+/g, " ").split(" ");
        return {
          year: Number(output.year),
          overallNo: Number(output.selection),
          roundNo: Number(output.round),
          pickNo: Number(output.pick),
          teamId: teamId[output.owner],
          ownerId: output.owner,
          player: {
            id: output.player,
            defaultPositionId: labels[1],
            eligiblePositions: [labels[1]],
            fullName: output.player,
            proTeamId: labels[0]
          }
        };
      });
      return result;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

//TEMP FOR LOCAL DATA ACCESS
const get_alltime_schedule_local = async () => {
  return fetch("/data/games.csv", { mode: "no-cors" })
    .then(response => response.text())
    .then(data => {
      let lines = data.split("\n");
      const headers = lines[0].split(",");
      let result = lines.slice(1).map(line => {
        let output = {};
        line.split(",").forEach((value, index) => {
          output[headers[index]] = value.trim();
        });
        return {
          year: Number(output.year),
          week: Number(output.week),
          home: {
            teamId: teamId[output.owner_1],
            totalPoints: Number(output.score_1)
          },
          away: {
            teamId: teamId[output.owner_2],
            totalPoints: Number(output.score_2)
          }
        };
      });
      return result;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

//Test method not for use
const test = async year => {
  return fetch("../static/test.txt", { mode: "no-cors" })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));
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
  get_all_draft_info,
  get_all_draft_info_local,
  get_alltime_schedule_local,
  test
};

module.exports = apis;

//export default apis;
