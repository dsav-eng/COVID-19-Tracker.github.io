window.onload = function () {
    let summaryUrl = 'https://api.covid19api.com/summary';
    let contriesUrl = 'https://api.covid19api.com/countries';

    var flag; //to distinguish between requests for global data vs country data

    loadData(summaryUrl, getGlobalCovidStats); //to call server and display Global COVID stats
    loadData(contriesUrl, getListOfCountries); //to call server and display list of countries for users to pick a review by country Stats

}

/**To send XMLHttpRequest and call another functions based on the API that is being called**/
function loadData(url, callFunction) {
    let request = new XMLHttpRequest();
    request.addEventListener("error", displayConnectionError);
    request.open('GET', url, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callFunction(JSON.parse(request.responseText));
        }
        if (request.status != 200) displayConnectionError("Server is Not Availble at this moment, Please Again Try Later");
    };
}
/*******END********/

/**To build and display the dropdown menu of all availble coutries**/
function getListOfCountries(response) {
    let countries = []; //to store lisf of all countries
    for (let i in response) {
        countries.push(response[i]["Country"]);
    }
    countries.sort();

    //buld the dropdown menu
    let dropdown = document.getElementById('c-dropdown');
    let option;
    for (let i = 0; i < countries.length; i++) {
        option = document.createElement('option');
        option.text = countries[i];
        option.value = countries[i];
        dropdown.appendChild(option);
    }
}
/*******END********/


/**To Display Global COVID-19 Stats && Last Updated Date**/
function getGlobalCovidStats(response) {
    flag = 1; //need to set to filter out Global Data

    //getting Covid Stats Data
    filterOutData(response["Global"]);

    //display the date when API numbers were last updated
    displayLastUpdatedDate(response["Countries"][0]["Date"]);


}

/**Getting the results by Country when user makes a selection in dropdown menu**/
function getDataByCountry(response) {
    flag = 2; //need to set to filter out Contry Data

    let i; //to go through JSON object
    let countryName = document.getElementById("c-dropdown").value;

    for (i = 0; i < response["Countries"].length; i++) {
        if (response["Countries"][i]["Country"] === countryName)
            break;
    }

    let myObj = response["Countries"][i];
    filterOutData(myObj);
}
/*******END********/

/**Filtering out ONLY Confirmed, Deths, Recovered**/
function filterOutData(myObj) {
    let numConfirmed;
    let numDeath;
    let numRecovered;

    if (myObj === undefined) {
    } else {
        for (let x in myObj) {
            if (x.includes("TotalConfirmed")) numConfirmed = myObj[x].toLocaleString();
            else if (x.includes("TotalDeaths")) numDeath = myObj[x].toLocaleString();
            else if (x.includes("TotalRecovered")) numRecovered = myObj[x].toLocaleString();
        }
    }

    //display the data on the page
    if (flag === 1) displayGolobalStats(numConfirmed, numDeath, numRecovered);
    else displayCountryStats(numConfirmed, numDeath, numRecovered);
}
/*******END********/

function displayGolobalStats(conf, death, recover) {
    document.getElementById("global-confirmed-num").innerHTML = conf;
    document.getElementById("global-deaths-num").innerHTML = death;
    document.getElementById("global-recovered-num").innerHTML = recover;
}

function displayCountryStats(conf, death, recover) {
    let table = document.getElementById("country-stats-table");

    //delete results of previously chosen country
    if (table.rows.length >= 2) table.deleteRow(1);

    //case of No Data availbale on server for this country
    let errBox = document.getElementById("errBox");
    if (conf === undefined) errBox.innerHTML = "No Data Availble for this country";

    else {
        errBox.innerHTML = "";
        //upfate table with values
        let row = table.insertRow();
        let celConf1 = row.insertCell(0);
        let celDeths = row.insertCell(1);
        let celRecov = row.insertCell(2);
        celConf1.innerHTML = conf;
        celDeths.innerHTML = death;
        celRecov.innerHTML = recover;

        //change styling and make the table visible
        table.style.border = "5px solid #CD5C5C";
        celDeths.style.color = "red";
        celRecov.style.color = "green";

        table.style.visibility = "visible";

    }
}


function displayConnectionError(eMsg) {
    document.getElementById('errBoxGlobal').innerHTML = eMsg;
    document.getElementById('global-row').style.visibility = "hidden";
    document.getElementById('country-row').style.visibility = "hidden";

}


function displayLastUpdatedDate(data) {
    let date = document.getElementById("last-updated");
    date.innerHTML = "Last Updated on " + data.toString().substring(0, 10);
    date.style.visibility = "visible";

}
