$(document).ready(function(){

  fetchHighScores();

  // Event handler for form submissions
  $("#SuperForm").submit(function(data) {
    event.preventDefault();

    var postData = $(this).serializeArray();
    $.ajax({
      type: "POST",
      url: "/json",
      data: postData,
      success: onSubmitSuccess
    }).error(function(){
      // TODO: Add error handling
    });
  }); // End Form Submit

  /**
   * Load high scores on on page load
   */
  function fetchHighScores() {
    $.ajax({
      dataType: "json",
      type: "GET",
      url: "/json",
      success: loadScores,
    }).error(function() {
      // TODO: Add error handling
      var errorMsg = '<tr><td colspan="4">Whoops! Failed to load highscores.</td></tr>';
      $("#high-scores-table").append(errorMsg);
    });
  }

  /* Call Back Functiona */
  function loadScores(data) {
    // Clear table
    $("#high-scores-table tr").remove();
    var tableContent = "";
    // Build HTML string
    for (var i = 0, n = data.length; i < n; i++) {
      var record = data[i];
      var rowHtml = '<tr>';
      rowHtml += '<td>' + (i + 1) + '</td>';
      rowHtml += '<td>' + record.initials + '</td>';
      rowHtml += '<td>' + record.location + '</td>';
      rowHtml += '<td>' + record.score + '</td>';
      rowHtml += '</tr>';

      // Append to big string
      tableContent += rowHtml;
    }

    // Add to table
    $("#high-scores-table").append(tableContent);
  }

  function onSubmitSuccess(data) {
    console.log("POSTED");
    console.log(data);
    $("#myButton").text("Play again!");
    loadScores(data);
  }

}); // End document.ready

