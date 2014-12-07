$(document).ready(function(){
  // Load highscores on page load
  fetchHighScores();

  // Event handler for form submissions
  $("#score-form").submit(function(data) {
    event.preventDefault();

    var postData = $(this).serializeArray();

    $.ajax({
      type: "POST",
      url: "/json",
      data: postData,
      success: onSubmitSuccess
    }).error(function(){

      console.log("eRRoR on submit post");
    });

    // Notify user that AJAX is working
    // Disable multiple button to prevent multiple submissions
    $("#form-submit-btn").text("Working...").attr("disabled", true);
    
    // Disable form inputs
    $("#SuperForm input").attr("disabled", true);
  }); // End Form Submit


  $(".btn-restart").on("click", function() {
    game.reset();
  }); // End btn click


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
      console.log("ERROR");
      var errorMsg = '<tr><td colspan="4">Whoops! Failed to load highscores.</td></tr>';
      $("#high-scores-table").append(errorMsg);
    });
  }

  /* Call Back Functiona */
  function loadScores(data) {
    // Clear table rows
    $("#high-scores-table tbody tr").remove();

    // Build HTML string
    var tableContent = "";
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
    // Handle data from AJAX Post response
    loadScores(data);

    // Notifiy user of success
    $(".form-title").text("Score Submitted!")

    // Hide form
    $("#score-form").slideUp()

    // Show game reset button on form
    $("#form-reset-btn").removeClass("hidden");
  }

}); // End document.ready

