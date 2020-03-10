const apis = require("./apis");
const fs = require("fs");
const axios = require("axios");
console.log(apis.get_alltime_schedule_local());

/*apis.test(2012).then(output => {
  let fg = output.filter(player => {
    return player.fullName === "Frank Gore";
  });
  console.log(fg[0]);
});*/

/*apis.get_all_draft_info().then(output => {
  let roundData = output.reduce((accum, player) => {
    //Skip if null player info (i.e. no one drafted)
    if (player.player == null) {
      return accum;
    }
    //Find team and round
    let teamAndRoundIndex = accum.findIndex(data => {
      return data.teamId === player.teamId && data.roundNo === player.roundNo;
    });
    if (teamAndRoundIndex < 0) {
      accum.push({
        teamId: player.teamId,
        roundNo: player.roundNo,
        playerCounts: []
      });
      teamAndRoundIndex = accum.length - 1;
    }
    //Add count of player for team and round
    const pos = {
      1: "QB",
      2: "RB",
      3: "WR",
      4: "TE",
      5: "K",
      16: "D/ST"
    };
    const playerPos = pos[player.player.defaultPositionId];
    let posIndex = accum[teamAndRoundIndex].playerCounts.findIndex(data => {
      return data.position === playerPos;
    });
    if (posIndex < 0) {
      accum[teamAndRoundIndex].playerCounts.push({
        position: playerPos,
        count: 1
      });
    } else {
      accum[teamAndRoundIndex].playerCounts[posIndex].count += 1;
    }
    return accum;
  }, []);

  //Cumulative - assumes filtering by teamId
  let teamId = 2;
  let teamData = roundData.filter(data => {
    return data.teamId === teamId;
  });
  teamData.sort((a, b) => {
    return a.roundNo - b.roundNo;
  });
  for (let i = 0; i < teamData.length - 1; i++) {
    for (let j = 0; j < teamData[i].playerCounts.length; j++) {
      let posIndex = teamData[i + 1].playerCounts.findIndex(nextData => {
        return nextData.position === teamData[i].playerCounts[j].position;
      });
      if (posIndex >= 0) {
        teamData[i + 1].playerCounts[posIndex].count +=
          teamData[i].playerCounts[j].count;
      } else {
        teamData[i + 1].playerCounts.push(teamData[i].playerCounts[j]);
      }
    }
  }
  for (let i = 0; i < teamData.length; i++) {
    console.log(teamData[i]);
  }
});

/*apis.get_all_draft_info().then(output => {
  console.log("Past API call");
  let draftsByTeam = output.reduce((accum, player) => {
    //Skip if null player info (i.e. no one drafted)
    if (player.player == null) {
      return accum;
    }
    //Find drafting team and add data point if necessary
    let teamIndex = accum.findIndex(data => {
      return data.teamId === player.teamId;
    });
    if (teamIndex < 0) {
      accum.push({ teamId: player.teamId, draftedPlayers: [] });
      teamIndex = accum.length - 1;
    }
    //Find player for drafting team, adding data as necessary
    let playerIndex = accum[teamIndex].draftedPlayers.findIndex(data => {
      return data.playerId === player.player.id;
    });
    if (playerIndex < 0) {
      accum[teamIndex].draftedPlayers.push({
        playerId: player.player.id,
        name: player.player.fullName,
        drafted: []
      });
      playerIndex = accum[teamIndex].draftedPlayers.length - 1;
    }
    //Add this instance
    accum[teamIndex].draftedPlayers[playerIndex].drafted.push({
      year: player.year,
      overallNo: player.overallNo
    });
    return accum;
  }, []);
  console.log("Past reduction");
  console.log(draftsByTeam.length);
  let mostDrafted = draftsByTeam.map(team => {
    let max = team.draftedPlayers[0];
    for (let i = 0; i < team.draftedPlayers.length; i++) {
      if (team.draftedPlayers[i].drafted.length > max.drafted.length) {
        max = team.draftedPlayers[i];
      }
    }
    return { teamId: team.teamId, mostDrafted: max };
  });
  let multiDrafted = draftsByTeam.map(team => {
    let multipleDrafts = [];
    for (let i = 0; i < team.draftedPlayers.length; i++) {
      if (team.draftedPlayers[i].drafted.length > 1) {
        multipleDrafts.push(team.draftedPlayers[i]);
      }
    }
    multipleDrafts.sort((a, b) => {
      return b.drafted.length - a.drafted.length;
    });
    return { teamId: team.teamId, players: multipleDrafts };
  });
  console.log(mostDrafted);
  for (let i = 0; i < multiDrafted.length; i++) {
    console.log(multiDrafted[i].players);
  }
  console.log(
    mostDrafted.map(data => {
      return {
        teamId: data.teamId,
        name: data.mostDrafted.name,
        count: data.mostDrafted.drafted.length
      };
    })
  );
});*/

/*
apis.get_teams(2019).then(output => {
    console.log(output[0])
})*/
