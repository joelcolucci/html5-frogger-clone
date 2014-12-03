$(document).ready(function(){

  function loadScores(data) {
    var tableContent = "";
    // Build HTML string
    for (var i = 0, n = data.length; i < n; i++) {
      var record = data[i];
      var rowHtml = '<tr>';
      rowHtml += '<td>' + i + '</td>';
      rowHtml += '<td>' + record.initials + '</td>';
      rowHtml += '<td>' + record.location + '</td>';
      rowHtml += '<td>' + record.score + '</td>';

      // Append to big string
      tableContent += rowHtml;
    }

    // Add to table
    $("#high-scores-table").append(tableContent);
  }

  function testSuccess() {
    console.log("POSTED");
  }
  // Load High Scores Asynchronously
  // Checkout jQuery getJson
  $.ajax({
    dataType: "json",
    type: "GET",
    url: "/json",
    success: loadScores,
  }).error(function() {
    // TODO: Add error handling
  });

  // Event handler for form submissions
  $("#SuperForm").submit(function(data) {
    event.preventDefault();

    var postData = $(this).serializeArray();
    $.ajax({
      type: "POST",
      url: "/",
      data: postData,
      success: testSuccess
    }).error(function(){
      // TODO: Add error handling
    });

    // Close Form Reload or something
  });

}); // End document.ready

