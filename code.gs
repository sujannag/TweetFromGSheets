function sendTweets() {
  
  var sheet;

  // Get the sheet based on name
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i=0; i<sheets.length; i++) {
    
    // Tweets are saved in a sheet named "Tweets" 
    if(sheets[i].getName() == "Tweets") {
      sheet = sheets[i];
      break;
    }      
  }

  var startRowNumber = 2;
  var endRowNumber = sheet.getLastRow();

  // Update the keys here   
  var twitterKeys = {
    TWITTER_CONSUMER_KEY: "",
    TWITTER_CONSUMER_SECRET: "",
    TWITTER_ACCESS_TOKEN: "",
    TWITTER_ACCESS_SECRET: "",
 }
  
  var props = PropertiesService.getScriptProperties();
  props.setProperties(twitterKeys);
  var params = new Array(0);
  var service = new Twitterlib.OAuth(props);

  var quote;
  var handle;
  
  for (var currentRowNumber = startRowNumber; currentRowNumber <= endRowNumber; currentRowNumber++) {
    // console.log("Start Row", startRowNumber);
    // console.log("End Row", endRowNumber);

    // cells are identified as [row][column]
		var row = sheet.getRange(currentRowNumber + ":" + currentRowNumber).getValues();
    
    // check that the first column (Date) is equal to today
		if (isToday(row[0][0])) {
      quote = row[0][1];
      handle = row[0][2];
        
      // console.log("Date", row[0][0]);
      // console.log("Quote", quote);

      if (!service.hasAccess()) {
        console.log("Authentication Failed");
      } else {
        console.log("Authentication Successful");      
            
        var status = quote + "\n\n" + handle;
        
        // console.log(status);
        
		    try {
			    var response = service.sendTweet(status, params);
			    console.log(response);
		    } catch (e) 
        {	
          console.log(e)	
        }
      }
		}
	} 
}

function isToday(date) {
	var today = new Date();
	var dateFromRow = new Date(date);
	return dateFromRow.getDate() == today.getDate() &&
		dateFromRow.getMonth() == today.getMonth() &&
		dateFromRow.getFullYear() == today.getFullYear()
}