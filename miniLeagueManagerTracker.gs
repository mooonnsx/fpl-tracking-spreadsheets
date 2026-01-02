function getPoints(gw, teamId) { //gets point total for a given manager and gameweek
  let url = `https://fantasy.premierleague.com/api/entry/${teamId}/event/${gw}/picks`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  return parse.entry_history.points;
}  

function getCurrentGW() { // finds current gmeweek and adds to spreadsheet at H2 and returns current gameweek
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet2");
  sheet.getRange(2, 8).setValue(found + 1);
  return found;
}

function getManagersFirstGW(teamId) { // finds the first gameweek that a manager participated in
  let url = `https://fantasy.premierleague.com/api/entry/${teamId}`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  var found = -1;
  let i = 0;
  while (found == -1) {
    i++;
    if ((parse.leagues.classic[i].name).substring(0,9) === "Gameweek ") {  // finds the league that they are in that starts with "Gameweek " and returns number following that string
      found = i;
    }
  }
  return Number((parse.leagues.classic[found].name).substring(9));
  
}

function getManagersName(teamId) { // returns the first name of a manager with their team id
  let url = `https://fantasy.premierleague.com/api/entry/${teamId}`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  return parse.player_first_name;
}

function mainPoints() {  // main function
  const ids = [7329410, 10353719, 7521996, 856227, 11321059]; // jonathan, shubh, amaani, jack, soren in that order (maybe not)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const currentGW = getCurrentGW();

  const sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet2");

  console.log(`current gw is ${currentGW}`);
  for (let j = 0; j < ids.length; j++) {
    var currentFirstGW = getManagersFirstGW(ids[j]);
    console.log("this managers first gw is " + getManagersFirstGW(ids[j])); // logs first gameweek
    sheet.getRange(1,j+2).setValue(getManagersName(ids[j]));
    sheet2.getRange(9, j+2).setValue(currentFirstGW-1);
    for (let i = currentFirstGW; i <= currentGW + 1; i++) {      // loops from first gameweek to current gw
      console.log("point value is" + getPoints(i,ids[j]));
      sheet.getRange(i+1, j+2).setValue(getPoints(i,ids[j]));
    }
  }
  for (let k = 1; k <= currentGW +1; k++) {
    let avg = getAverage(k);
    sheet.getRange(1+k,2 + ids.length).setValue(avg);
    console.log(`average for gw ${k} is ${avg}`);
  }
  
}


function mainTransferCost() {  // adds the transfer cost for each player to spreadsheet
  const ids = [7329410, 10353719, 7521996, 856227, 11321059];
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const currentGW = getCurrentGW();
  console.log(`current gw is ${currentGW}`);
  for (let j = 0; j < ids.length; j++) {
    var currentFirstGW = getManagersFirstGW(ids[j]);
    console.log("this managers first gw is " + getManagersFirstGW(ids[j]));
    sheet.getRange(1,j+10).setValue(getManagersName(ids[j]));
    for (let i = currentFirstGW; i <= currentGW + 1; i++) {     
      console.log("tc value is" + getTransferCost(i,ids[j]));
      sheet.getRange(i+1, j+10).setValue(getTransferCost(i,ids[j]));  // adds transfer cost to spreadsheet 
    }
  }
}

function getTransferCost(gw, teamId) {  // gets the transfer cost for a given week and given manager
  let url = `https://fantasy.premierleague.com/api/entry/${teamId}/event/${gw}/picks`;
  const getJson = UrlFetchApp.fetch(url);
  const parse = JSON.parse(getJson.getContentText());
  return parse.entry_history.event_transfers_cost;
}

function getAverage(gw) {  // gets the average score for each gameweek in global fpl
    let url = `https://fantasy.premierleague.com/api/bootstrap-static`;
    const getJson = UrlFetchApp.fetch(url);
    const parse = JSON.parse(getJson.getContentText());
    return parse.events[gw-1].average_entry_score;
}




