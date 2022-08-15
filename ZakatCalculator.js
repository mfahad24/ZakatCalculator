const getCurrentGoldValue = () => {
  //TEMPORARY - window.name allows for persisting data for EACH USER
  //if they stay in that tab and go from one page to another WITHIN THIS SITE
  var nisabValueField = document.getElementsByClassName("input-value--nisab");
  if (window.name) {
    console.log(
      'gold api - value from "window.name" applied | window.name value:',
      window.name
    );
    nisabValueField[0].value = window.name;
  } else {
    console.log("gold api - api hit again | window.name value:", window.name);
    var Http = new XMLHttpRequest();
    var url = "https://www.goldapi.io/api/XAU/USD/";

    Http.open("GET", url);
    Http.setRequestHeader("x-access-token", "goldapi-1loq1xukqfcybcw-io");
    Http.send();

    Http.onreadystatechange = (e) => {
      var pricePerOunce = JSON.parse(Http.responseText);
      window.name = (pricePerOunce["price"] * 3).toFixed(2);
      return (nisabValueField[0].value = (pricePerOunce["price"] * 3).toFixed(
        2
      ));
    };
  }
};

const getTotalOfAllEntries = () => {
  var allInputValues = document.getElementsByClassName("input-value--user");
  var total = 0.0;

  //add up all input fields
  for (var i = 0; i < allInputValues.length; i++) {
    if (parseInt(allInputValues[i].value.replace(/\,/g, ""))) {
      var inputNum = parseFloat(allInputValues[i].value.replace(/,/g, ""));
      total += inputNum;
    }
  }
  return total;
};

//gets the nisab value, removes commas, turn it to a number
const getFinalNisabValue = () => {
  var nisabValue;
  if (document.getElementsByClassName("input-value--nisab")[0].value != "$0") {
    nisabValue = document.getElementsByClassName("input-value--nisab");
  } else {
    nisabValue = document.getElementsByClassName("input-value--userNisab");
  }
  var nisabValWithoutCommas = nisabValue[0].value.replace(/,/g, "");
  return parseFloat(nisabValWithoutCommas);
};

const displayTotalOfAllEntries = () => {
  //first bolded value showing user total
  var zakahEligibleAmount = document.getElementsByClassName(
    "eligible-for-zakah--number"
  )[0];
  zakahEligibleAmount.innerHTML =
    "$" +
    getTotalOfAllEntries()
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const calculateHowMuchIsOwed = () => {
  displayTotalOfAllEntries();
  //get the location where the amount you owe is going to show up
  var amountYouOweField = document.getElementsByClassName(
    "your-amount-due--number"
  )[0];

  // does the main calculation
  // if your totalal minus nisab is greater than or equal to 0, apply 2.5% to it
  if (
    parseFloat(
      getTotalOfAllEntries().toFixed(2).toString() -
        getFinalNisabValue().toFixed(2)
    )
      .toFixed(2)
      .replace(/,/g, "") >= 0.0
  ) {
    amountYouOweField.innerHTML =
      "$" +
      (getTotalOfAllEntries() * 0.025)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    amountYouOweField.innerHTML = "$0";
  }
};

//if the user wants to enter their own nisab value
function makeThisValueTheNisabValue() {
  var nisabValueField = document.getElementsByClassName("input-value--nisab");
  nisabValueField[0].innerHTML = "0";
  nisabValueField[0].value = "$0";
}

function resetAllInputFields() {
  var valueFields = document.getElementsByClassName("value-field");
  for (var i = 1; i < valueFields.length; i++) {
    valueFields[i].value = "";
    valueFields[i].innerHTML = "";
  }
}

window.onload = getCurrentGoldValue();
