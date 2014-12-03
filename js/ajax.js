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

  // Load High Scores Asynchronously
  $.ajax({
    type: "GET",
    url: "/json",
    success: loadScores,
  });



}); // End document.ready

