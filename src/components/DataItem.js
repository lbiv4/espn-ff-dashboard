import React from "react";
import utils from "../scripts/utils.js";

/**
 * Base class used by data item components. Used to hold general functions helpful to all data items, such as
 * checking for loading when API calls still in progress
 */
class DataItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  /**
   * Helper function to get draft data from local storage or initialize API call if data has not been created
   *
   * @param {string} name - Name of data value to access
   */
  async getDataFromStorage(name) {
    return await utils.getDataFromStorage(name);
  }

  isLoading() {
    return this.state.data === undefined || this.state.data.length === 0;
  }

  /**
   * Helper method that can get the owner id for a team in a given year
   *
   * @param {Object} teamOwnersData - Data object containing mappings from team ids to year/owner id combinations
   * @param {Number} year - Year for data to find
   * @param {Number} teamId - Id of team to find owner
   * @return {Number} Owner id for the input team id in the input year
   */
  getOwnerId(teamOwnersData, year, teamId) {
    return teamOwnersData[teamId][year].ownerId;
  }

  /**
   * Helper method that can get the team id associated with an owner in a given year
   *
   * @param {Object} teamOwnersData - Data object containing mappings from team ids to year/owner id combinations
   * @param {Number} year - Year for data to find
   * @param {Number} ownerId - Id of owner to find team
   * @return {Number} Team id for the input owner id in the input year, or -1 if not found
   */
  getTeamId(teamOwnersData, year, ownerId) {
    for (let prop in teamOwnersData) {
      if (teamOwnersData[prop][year].ownerId === ownerId) {
        return Number(prop);
      }
    }
    return -1;
  }

  getTeamOrOwnerLabel(dataSettings, ownersData, value) {
    if (dataSettings.showOwners) {
      if (dataSettings.showNames) {
        if (dataSettings.showFullNames) {
          return ownersData.owners[value - 1].fullName;
        } else {
          //TODO: Create abbreviation from initials?
          return ownersData.owners[value - 1].lastName;
        }
      } else {
        return `Owner ${value}`;
      }
    } else {
      const team = ownersData.teams[value];
      const latestYear = Object.keys(team).pop();
      const teamInfo = team[latestYear];
      if (dataSettings.showNames) {
        if (dataSettings.showFullNames) {
          return teamInfo.teamName;
        } else {
          return teamInfo.abbrev;
        }
      } else {
        return `Team ${value}`;
      }
    }
  }

  render() {
    return <div></div>;
  }
}

export default DataItem;
