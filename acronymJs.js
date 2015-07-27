/*Author   			      Shivastuti Koul
  Creation Date  	     	      07/23/2015
  Last Modification Date         07/24/2015
  Description   		      	Javascript file for acronym.html
*/

jQuery(function ($) {

	/*Function calls for button click events.There are two types of events:
	1. Search - triggers the search process for fetching acronyms from Acromine webservice.
	2. Reset - Clears all input fields
	*/
	
    $(function () {
        $("#buttonFetch").click(performValidations);
	   	$("#reset").click(clearFields);
		
    });

    /*Function performValidations:
	creates global variables for input fields and calls the first validation 
	function validateAcronymName
	*/
    function performValidations() {
	clearOutputs();
     window.acronymName = $("#search_string").val();
     window.maxItems = $("#maxItems").val();
	validateAcronymName();
    }
	
	

    /*Function clearFields:
	clears the input fields and output divs once the RESET button is clicked
	*/
	function clearFields()
	{
	clearInputs();
	clearOutputs();

	}


    /*Function clearInputs:
	clears the input fields once the RESET button is clicked
	*/
	function clearInputs()
	{
	$("#search_string").val('');
	$("#maxItems").val('');
	}
	
	

    /*Function clearOutputs:
	clears the results once the RESET button is clicked
	*/
	function clearOutputs()
	{
	$("#lbllongForm").empty();
	$("#errormessage").empty();
	$("#count").empty();

	}

	
	/*Function validateAcronymName:
	Checks: 1. Acronym name input is provided
			2. The input is a valid string
	*/	
	function validateAcronymName()
	{
	
	if(acronymName)
		{
			var letters = /^[A-Za-z]+$/;
			if(acronymName.match(letters)) 
			validateAcronymCount();
			else
			alert("The acronym should be a String");
		}
			else
			alert("Please input the acronym");
		}
	
	/*Function validateAcronymCount:
	Checks: 1. Number of acronyms is provided
			2. The input is a number
	*/
	function validateAcronymCount()
	{
		if(maxItems)
			{
			if (!isNaN(maxItems)) 
			ajaxDataFetch();
			else
			alert("The count of acronyms should be a number");
			}
		else
		alert("Please input the number of acronyms");
	}

	/*Function ajaxDataFetch:
	Ajax call to the webservice - Acromine.
	Tests - 1. Result set empty
	 		2. Failure to connect to the service
	*/
	function ajaxDataFetch()
	{ // Query.
        var shortform = acronymName;
        var longform = '';
        // Show the current status.
        $('output').innerHTML =
              'Issuing a query...<br/>'
            + '(sf, lf) = ("' + shortform + '", "' + longform + '")';
        // Issue an AJAX request.
        var a = new Ajax.Request(
       'http://www.nactem.ac.uk/software/acromine/dictionary.py',
            {
                method: 'get',
                parameters: $H({ sf: shortform, lf: longform }).toQueryString(),
                crossDomain: true,
                dataType: 'jsonp',
                cache: false,
                jsonpCallback: "acronym",
                onSuccess: function (response)
		 {
                var responseJson = JSON.parse(response.responseText);
		if (!$.trim(responseJson))
			{
			$("#errormessage").html(" No results found");
			}
			else
			{
                    displayResponse(responseJson);
			}
            },

                onFailure: function () 
		 { alert('Failed to connect to the service.')
		 }
            });

    }
	
	/*Function displayResponse:
	Once the result set is obtained from the parent function,this function
	 validates if the number of requested responses is actually available
	 It then makes a call to the function populateLongForms
	*/
        function displayResponse(response) 
    {
      var acronymResult = response[0];
      var totalLongForms = acronymResult.lfs.length;
	  if (maxItems <=totalLongForms)
			{
			totalLongForms = maxItems;
			$("#count").html (" Displaying " + totalLongForms + " results as requested");
			} 
	  else
	  $("#count").html (" Only " + totalLongForms + " 				results are available");
      //Call this function with the response data
      $("#lbllongForm").empty();
      $("#lbllongForm").html(populateLongForms(acronymResult.lfs,totalLongForms));
    }

        /*Function populateLongForms:
    	Creates an ordered list of the result set
    	*/
        function populateLongForms(longFormResult,totalLongForms) {
            var orderedlist = document.createElement('ol');

            for (var i = 0; i < totalLongForms; i++) {
                var listItem = document.createElement('li');
                $(listItem).text(longFormResult[i]['lf']);
                console.log(listItem);
                orderedlist.appendChild(listItem);
            }
            return orderedlist;
        }


});