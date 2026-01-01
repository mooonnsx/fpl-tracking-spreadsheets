function getPoints(gw, teamId) {
  let url = `https://fantasy.premierleague.com/api/entry/${teamId}/event/${gw}/picks`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  return parse.entry_history.points;
}  

function getCurrentGW() {
  let url = "https://fantasy.premierleague.com/api/bootstrap-static/";
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  var found = -1;
  let i=0;
  while (found == -1) {
    i++;
    if (i>38) {
      break;
    }
    if (parse.events[i].is_current == true) {
      found = i;
    }
  }
  return found;

}

function getManagersFirstGW(teamId) {
  let url = `https://fantasy.premierleague.com/api/entry/${teamId}`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  var found = -1;
  let i = 0;
  while (found == -1) {
    i++;
    if ((parse.leagues.classic[i].name).substring(0,9) === "Gameweek ") {
      found = i
    }
  }
  return Number((parse.leagues.classic[found].name).substring(9));
}

function getManagersName(teamId) {
  let url = `https://fantasy.premierleague.com/api/entry/${teamId}`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  return parse.player_first_name;
}

function main() {
  const ids = [7329410, 10353719, 7521996, 856227, 11321059]; // jonathan, shubh, amaani, jack, soren in that order (maybe not)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const currentGW = getCurrentGW();
  console.log(`current gw is ${currentGW}`);
  for (let j = 0; j < ids.length; j++) {
    var currentFirstGW = getManagersFirstGW(ids[j]);
    console.log("this managers first gw is " + getManagersFirstGW(ids[j]));
    sheet.getRange(1,j+2).setValue(getManagersName(ids[j]));
    for (let i = currentFirstGW; i <= currentGW; i++) {     
      console.log("point value is" + getPoints(i,ids[j]))
      sheet.getRange(i+1, j+2).setValue(getPoints(i,ids[j]));
    }
  }
  
}

