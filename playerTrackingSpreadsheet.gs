function main() {
  let per90Statistics = ["expected_goals", "expected_assists", "expected_goal_involvements", "goals_scored", "assists", "tackles", "recoveries", "clearances_blocks_interceptions", "bps", "total_points"]; // all statistics that will be calculated per 90 minutes
  let otherStatistics = ["now_cost", "form"]; // all statistics that will be standalone
  setStatisticTitles(per90Statistics, otherStatistics);  // sets titles for each statistic in spreadsheet
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
  for (let i = 0; i < 780; i++) { // 780 players in premier league. needs updating to work for a dynamic playerbase that changes sizes
    if (parse.elements[i].element_type == 4) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Forward"); // prepares to add forward stats
      forwardamt +=1;
      currentrow = forwardamt + 1;
    }
    if (parse.elements[i].element_type == 3) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Midfield"); // prepares to add midfielder stats
      midfieldamt +=1;
      currentrow = midfieldamt + 1;
    }
    if (parse.elements[i].element_type == 2) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Defense"); // prepares to add defender stats
      defenseamt += 1;
      currentrow = defenseamt+1;
    }
    if (parse.elements[i].element_type == 1) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Goalkeeper"); // prepares to add goalkeeper stats
      goalkeeperamt +=1;
      currentrow = goalkeeperamt+1;
    }
    currentname = parse.elements[i].first_name + " " + parse.elements[i].second_name;
    sheet.getRange(currentrow, 1).setValue(currentname);
    console.log("printed this name: " + currentname);
    console.log("current row is: " + currentrow);
    console.log("forward amt: " + forwardamt);
    console.log("midfieldamt: " + midfieldamt); // logs amount of each type of player, 
    console.log("defenseamt: " + defenseamt);
    console.log("goalkeeperamt: " + goalkeeperamt);
    currentminutes = parse.elements[i].minutes;
    sheet.getRange(currentrow, 2).setValue(currentminutes);
    for (let j = 0; j < per90Statistics.length; j++) {
      currentstatvalue = parse.elements[i][per90Statistics[j]];
      sheet.getRange(currentrow, 2*j+3).setValue(currentstatvalue);  // 2 times length to have each be separated for per90 statistics
      if (currentminutes == 0) {
        sheet.getRange(currentrow, 2*j+4).setValue(0); // handles division by zero
      } else {
        sheet.getRange(currentrow, 2*j+4).setValue((currentstatvalue/currentminutes*90).toFixed(2)); // rounds for per 90 statistics 
      }
      if (per90Statistics[j] === "total_points") {
        points = currentstatvalue; // save points value for later calculations
      }
    }
    for (let k = 0; k < otherStatistics.length; k++) {
      currentstatvalue = parse.elements[i][otherStatistics[k]];
      if (otherStatistics[k] === "now_cost") {
        currentstatvalue /= 10; // cost is initially *10 in api
        cost = currentstatvalue; // saves cost value for later calculations
      } else if (otherStatistics[k] === "form") {
        form = currentstatvalue; //saves form value for later calculations
      }
      sheet.getRange(currentrow, 2*per90Statistics.length+3+k).setValue(currentstatvalue); 
    }
    sheet.getRange(currentrow, 2*per90Statistics.length+3+otherStatistics.length).setValue((form/cost).toFixed(2));   // later calculations (not dynamic)
    sheet.getRange(currentrow, 2*per90Statistics.length+4+otherStatistics.length).setValue((points/cost).toFixed(2));
  }
}

function setStatisticTitles(per90Statistics, otherStatistics) {  
  const sheets = ["Forward", "Midfield", "Defense", "Goalkeeper"];
  var sheet;
  for (let a = 0; a < 4; a++) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheets[a]); // set for forward sheet
    sheet.getRange(1,2).setValue("minutes");
    for (let i = 0; i < per90Statistics.length; i++) {
      sheet.getRange(1, 2*i+3).setValue(per90Statistics[i]); // multiplied by 2 to make room for per 90 stats
      sheet.getRange(1, 2*i+4).setValue(per90Statistics[i] + " per 90"); // adds per 90. also multiplied by 2 for room. 
    }
    for (let i = 0; i < otherStatistics.length; i++) {
      sheet.getRange(1, 2*per90Statistics.length+3+i).setValue(otherStatistics[i]);
    }
    sheet.getRange(1,2*per90Statistics.length+3+otherStatistics.length).setValue("form/cost"); // adds calculated headings that go at the end.
    sheet.getRange(1,2*per90Statistics.length+4+otherStatistics.length).setValue("points/cost");
  }
}



function applyConditionalFormattingAllSheets() {     // CHATGPT CODE - This code is to apply conditional formatting to each row as I deem fit. It is written by ChatGPT because I am not familiar with formatting.
  const sheetNames = ["Forward", "Midfield", "Defense", "Goalkeeper"];

  const MIN_COLOR = "#e67c73";
  const MID_COLOR = "#ffd666";
  const MAX_COLOR = "#57bb8a";
  const REVERSED_COL = 23; // Column W

  sheetNames.forEach(sheetName => {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) return;

    const lastCol = sheet.getLastColumn();
    const lastRow = sheet.getLastRow();

    sheet.clearConditionalFormatRules();
    let rules = [];

    for (let col = 2; col <= lastCol; col++) {
      const range = sheet.getRange(2, col, lastRow - 1);
      const isReversed = col === REVERSED_COL;

      let ruleBuilder = SpreadsheetApp.newConditionalFormatRule()
        .setRanges([range]);

      // Min
      ruleBuilder = ruleBuilder.setGradientMinpoint(
        isReversed ? MAX_COLOR : MIN_COLOR
      );

      // 50th percentile (median)
      ruleBuilder = ruleBuilder.setGradientMidpointWithValue(
        MID_COLOR,
        SpreadsheetApp.InterpolationType.PERCENTILE,
        "50"
      );

      // 98th percentile (instead of max)
      ruleBuilder = ruleBuilder.setGradientMaxpointWithValue(
        isReversed ? MIN_COLOR : MAX_COLOR,
        SpreadsheetApp.InterpolationType.PERCENTILE,
        "98"
      );

      rules.push(ruleBuilder.build());
    }

    sheet.setConditionalFormatRules(rules);
  });
}

