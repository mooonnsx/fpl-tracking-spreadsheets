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
      break
    }
    if (parse.events[i].is_current == true) {
      found = i;
    }
  }
  return found;

}

function main() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const currentGW = getCurrentGW();
  for (let i = 1; i <= currentGW; i++) {
    sheet.getRange(i+1, 2).setValue(getPoints(i,7329410));
  }
}

