function main() {
  let per90Statistics = ["expected_goals", "expected_assists", "expected_goal_involvements", "goals_scored", "assists", "tackles", "recoveries", "clearances_blocks_interceptions", "bps", "total_points"];
  let otherStatistics = ["now_cost", "form"];
  setStatisticTitles(per90Statistics, otherStatistics);
  let url = `https://fantasy.premierleague.com/api/bootstrap-static`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Forward");
  let forwardamt=0;
  let midfieldamt = 0;
  let defenseamt=0;
  let goalkeeperamt=0;
  let currentrow = 0;
  let currentname = "";
  let currentminutes = 0;
  let currentstatvalue = 0;
  for (let i = 0; i < 780; i++) {
    if (parse.elements[i].element_type == 4) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Forward");
      forwardamt +=1;
      currentrow = forwardamt + 1;
    }
    if (parse.elements[i].element_type == 3) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Midfield");
      midfieldamt +=1;
      currentrow = midfieldamt + 1;
    }
    if (parse.elements[i].element_type == 2) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Defense");
      defenseamt += 1;
      currentrow = defenseamt+1;
    }
    if (parse.elements[i].element_type == 1) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Goalkeeper");
      goalkeeperamt +=1;
      currentrow = goalkeeperamt+1;
    }
    currentname = parse.elements[i].first_name + " " + parse.elements[i].second_name;
    sheet.getRange(currentrow, 1).setValue(currentname);
    console.log("printed this name: " + currentname);
    console.log("current row is: " + currentrow);
    console.log("forward amt: " + forwardamt);
    console.log("midfieldamt: " + midfieldamt);
    console.log("defenseamt: " + defenseamt);
    console.log("goalkeeperamt: " + goalkeeperamt);
    // have an array/list with every data value needed and make a loop here that runs through each for the players
    currentminutes = parse.elements[i].minutes;
    sheet.getRange(currentrow, 2).setValue(currentminutes);
    for (let j = 0; j < per90Statistics.length; j++) {
      currentstatvalue = parse.elements[i][per90Statistics[j]];
      sheet.getRange(currentrow, 2*j+3).setValue(currentstatvalue);
      if (currentminutes == 0) {
        sheet.getRange(currentrow, 2*j+4).setValue(0);
      } else {
        sheet.getRange(currentrow, 2*j+4).setValue((currentstatvalue/currentminutes*90).toFixed(2));
      }
      if (per90Statistics[j] === "total_points") {
        points = currentstatvalue;
      }
    }
    for (let k = 0; k < otherStatistics.length; k++) {
      currentstatvalue = parse.elements[i][otherStatistics[k]];
      if (otherStatistics[k] === "now_cost") {
        currentstatvalue /= 10;
        cost = currentstatvalue;
      } else if (otherStatistics[k] === "form") {
        form = currentstatvalue;
      }
      sheet.getRange(currentrow, 2*per90Statistics.length+3+k).setValue(currentstatvalue);
    }
    sheet.getRange(currentrow, 2*per90Statistics.length+3+otherStatistics.length).setValue((form/cost).toFixed(2));
    sheet.getRange(currentrow, 2*per90Statistics.length+4+otherStatistics.length).setValue((points/cost).toFixed(2));
  }
}

function setStatisticTitles(per90Statistics, otherStatistics) {          
  sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Forward");
  sheet.getRange(1,2).setValue("minutes");
  for (let i = 0; i < per90Statistics.length; i++) {
    sheet.getRange(1, 2*i+3).setValue(per90Statistics[i]);
    sheet.getRange(1, 2*i+4).setValue(per90Statistics[i] + " per 90");
  }
  for (let i = 0; i < otherStatistics.length; i++) {
    sheet.getRange(1, 2*per90Statistics.length+3+i).setValue(otherStatistics[i]);
  }
  sheet.getRange(1,2*per90Statistics.length+3+otherStatistics.length).setValue("form/cost");
  sheet.getRange(1,2*per90Statistics.length+4+otherStatistics.length).setValue("points/cost");
  sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Midfield");
  sheet.getRange(1,2).setValue("minutes");
  for (let i = 0; i < per90Statistics.length; i++) {
    sheet.getRange(1, 2*i+3).setValue(per90Statistics[i]);
    sheet.getRange(1, 2*i+4).setValue(per90Statistics[i] + " per 90");
  }
  for (let i = 0; i < otherStatistics.length; i++) {
    sheet.getRange(1, 2*per90Statistics.length+3+i).setValue(otherStatistics[i]);
  }
  sheet.getRange(1,2*per90Statistics.length+3+otherStatistics.length).setValue("form/cost");
  sheet.getRange(1,2*per90Statistics.length+4+otherStatistics.length).setValue("points/cost");
  sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Defense");
  sheet.getRange(1,2).setValue("minutes");
  for (let i = 0; i < per90Statistics.length; i++) {
    sheet.getRange(1, 2*i+3).setValue(per90Statistics[i]);
    sheet.getRange(1, 2*i+4).setValue(per90Statistics[i] + " per 90");
  }
  for (let i = 0; i < otherStatistics.length; i++) {
    sheet.getRange(1, 2*per90Statistics.length+3+i).setValue(otherStatistics[i]);
  }
  sheet.getRange(1,2*per90Statistics.length+3+otherStatistics.length).setValue("form/cost");
  sheet.getRange(1,2*per90Statistics.length+4+otherStatistics.length).setValue("points/cost");
  sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Goalkeeper");
  sheet.getRange(1,2).setValue("minutes");
  for (let i = 0; i < per90Statistics.length; i++) {
    sheet.getRange(1, 2*i+3).setValue(per90Statistics[i]);
    sheet.getRange(1, 2*i+4).setValue(per90Statistics[i] + " per 90");
  }
  for (let i = 0; i < otherStatistics.length; i++) {
    sheet.getRange(1, 2*per90Statistics.length+3+i).setValue(otherStatistics[i]);
  }
  sheet.getRange(1,2*per90Statistics.length+3+otherStatistics.length).setValue("form/cost");
  sheet.getRange(1,2*per90Statistics.length+4+otherStatistics.length).setValue("points/cost");

}

