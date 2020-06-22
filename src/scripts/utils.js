import apis from "./apis.js";

/**
 * Helper function that will get a data value from localStorage or run the necessary API call to
 * generate that data
 * @param {String} name - Name of data value to get from localStorage
 */
const getDataFromStorage = async (name) => {
  let data = window.localStorage.getItem(name);
  if (!data) {
    switch (name) {
      case "owners":
        data = await get_owner_data(2020);
        break;
      case "games":
        data = await apis.get_alltime_schedule(2020);
        break;
      case "draft":
        data = await apis.get_all_draft_info();
        break;
      default:
        console.log(
          `Unable to identify api associated with '${name}' - please check code implementation`
        );
        return null;
    }
    //data = await apis.get_alltime_schedule_local();
    window.localStorage.setItem(name, JSON.stringify(data));
  } else {
    data = JSON.parse(data);
  }
  return data;
};

/**
 * Function that transforms API call into structured data values for all owners and teams in league history
 * @param {Number} year - Most recent active year
 */
const get_owner_data = (year) => {
  return apis.get_general_team_info(year).then((output) => {
    //Get owner info
    let owners = [];
    output.forEach((data) => {
      data.members.forEach((member) => {
        let memberInfo = {
          id: owners.length + 1,
          espnId: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          fullName: `${member.firstName} ${member.lastName}`,
        };
        if (
          owners.findIndex((owner) => {
            return owner.espnId === member.id;
          }) < 0
        ) {
          owners.push(memberInfo);
        }
      });
    });
    //Get team-owner mappings
    let teamsWithOwners = {};
    output.forEach((data) => {
      data.teams.forEach((team) => {
        if (!teamsWithOwners.hasOwnProperty(team.id)) {
          teamsWithOwners[team.id] = {};
        }
        //TODO: Account for teams with multiple owners?
        if (team.hasOwnProperty("primaryOwner")) {
          let ownerIndex = owners.findIndex((owner) => {
            return owner.espnId === team.primaryOwner;
          });
          if (ownerIndex >= 0) {
            teamsWithOwners[team.id][data.seasonId] = {
              ownerId: owners[ownerIndex].id,
              teamName: `${team.location} ${team.nickname}`,
              teamAbbrev: team.abbrev,
            };
          }
        }
      });
    });
    return {
      owners: owners,
      teams: teamsWithOwners,
    };
  });
};

const utils = {
  getDataFromStorage,
};

//When testing locally, use module.exports. Otherwise, export default apis
//module.exports = utils;

export default utils;
