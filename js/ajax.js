$(document).ready(function(){

  /**
   * Fetch high scores via AJAX
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


  /**
   * Handle AJAX form submit response
   */
  function onAjaxSuccess(data) {
    // check to see if data returned is validation error
    if (data.hasOwnProperty("has_error")) {
      handleServerValidation(data);
      return;
    }
    // Handle data from AJAX Post response
    loadScores(data);

    // Notify users
    showPlayAgain();

    // Prepare form for next use
    enableFormInputs();
    resetFormInputs();
  }

  /**
   * Handle server response due to invalid form data
   */
  function handleServerValidation(data) {
    // data.error_initials
    // add appropriate error messages
    $("#error-location").text(data.error_location || "");
    $("#error-initials").text(data.error_initials || "");

    // add values back to input if necessary
    $("#initials").val(data.initials);
    $("#location").val(data.location);
    $("#score").val(data.score);

    // Renable all form controls
    enableFormInputs();
  }

  function showPlayAgain() {
    // Notifiy user of success
    $(".form-title").text("Score Submitted!")

    // Hide form
    $("#score-form").slideUp()

    // Show game reset button on form
    $("#form-reset-btn").removeClass("hidden");
  }

  // Reset form to default state
  function enableFormInputs() {
    // Reset submit button text and enable
    $("#form-submit-btn").text("Submit").attr("disabled", false);
    
    // Enable all form inputs
    $("#score-form input").attr("disabled", false);
  }

  function disableFormInputs() {
    // Reset submit button text and enable
    $("#form-submit-btn").text("Working...").attr("disabled", true);
    
    // Enable all form inputs
    $("#score-form input").attr("disabled", true);
  }

  function resetFormInputs() {
    // Remove any server validation responses
    $(".error").empty();

    // Clear form inputs
    $("#score-form")[0].reset();
  }

  function resetFormDisplay() {
    // Set Form Title 
    $(".form-title").text("Submit your score!");

    // Hide form "play again" button
    $("#form-reset-btn").addClass("hidden");

    // Show form in hidden container
    $("#score-form").show();
  }

  /* Call Back Functiona */

  /**
   * Load highscores into DOM
   */
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
  } // End loadScores


  // Event handler for form submissions
  $("#score-form").submit(function(data) {
    event.preventDefault();

    var postData = $(this).serializeArray();

    $.ajax({
      type: "POST",
      url: "/json",
      data: postData,
      success: onAjaxSuccess
    }).error(function(){

      console.log("eRRoR on submit post");
    });

    // Notify user that AJAX is working
    disableFormInputs();
    
  }); // End Form Submit


  /**
   * Bind Game reset method to all restart buttons
   */
  $(".btn-restart").on("click", function() {
    resetFormDisplay();
    game.reset();
  }); // End btn click


  // Load highscores on page load
  fetchHighScores();

}); // End document.ready

