var totalInterestPaid = 0;

function main(){
	try{
		//get users input values
		var loanAmount = document.getElementById("amount").value;
		var airate = document.getElementById("airate").value;
		var loanYear = document.getElementById("loanYears").value;
		var numPayments = document.getElementById("NumPayments").value;
		var startDate = document.getElementById("startDate").valueAsDate;
		var totalPayPeriod = numPayments*loanYear

	  //check if user input 'payment start date' is valid, returns true if valid, false if not
	  var checkTheUsersDate = checkUsersDate(startDate);

		//if 'payment start date' is valid
		if(checkTheUsersDate){
			//continue if other user inputs are greater than zero
			if(loanAmount > 0 && airate > 0 && loanYear>0 && numPayments>0){
	      //convert interest rate from percentage to decimal
				var airateDecimal = airate/100;
				//calculates monthly payment amount
				var pmt = calculatePMT(loanAmount,airateDecimal,numPayments,loanYear);
				var jArry = makeJSON(startDate,pmt,airateDecimal,numPayments,loanAmount,loanYear);

				//call function to update summary
				updateSummary(pmt,totalPayPeriod)

				//make table visible
				document.getElementById('tableDiv').style.visibility = 'visible'
				return jArry;
			}
			else{
				//users info is bad send error message to users
			}
		}
		else{
			//users date is bad send error message to users
		}
	}
	catch(e){
		console.log(e.message);
	}
}

//Takes a data object as input and check if it is a valid date
//if valid send true else false
function checkUsersDate(uDate){
	var usersYear = uDate.getFullYear();
 	var usersMonth = uDate.getMonth();
 	var usersDate = uDate.getDate();
	if (usersYear > 1 && usersMonth > 0 && usersMonth < 13 && usersDate > 0 && usersDate < 32){
		return true;
	}
	else{
		return false;
	}
}

function makeJSON(startDate,payment,rate,numOfpayments,balance,loanYear){
	var totalPayment = (numOfpayments * loanYear) + 1;
	var dateCounter = Math.floor(365/numOfpayments);
	var jsonArry = [];

  for(i = 1; i  < totalPayment; i++){
		var interestPaid = calculateInterestPaid(rate,numOfpayments,balance);
		var checkLastPayment = interestPaid + payment;
		var principalPaid = calculatePrincipalPaid(payment,interestPaid);
		balance = balance - principalPaid;

		var payDate = new Date(startDate.setDate(startDate.getDate()+dateCounter));
		//update startDate
		startDate = payDate;

		var info = {};
		info.paymentNumber = i;
		info.paymentDate = startDate.toLocaleDateString();
		info.paymentAmount = payment.toFixed(2);
		info.interestPaid = interestPaid.toFixed(2);
		info.principalPaid = principalPaid.toFixed(2);
		info.balance = balance.toFixed(2);
		jsonArry.push(info);

		//add interestPaid
		totalInterestPaid = totalInterestPaid + interestPaid;
	}
	return jsonArry;
}

//This function calculates the payment value by using the formula
//payment = principal * (annual interest rate/number of payments)/1-((1+annual interest rate/number of payments in a year)^(number of payments in a year * length of loan*(-1)))
function calculatePMT(principal,rate,numOfpayments,loanTerm){
	var top = principal*(rate/numOfpayments);
	var exponent = numOfpayments*loanTerm*(-1);
	var bottom1 = 1+(rate/numOfpayments);
	var bottom2 = Math.pow(bottom1,exponent);
	var payment = (top/(1-bottom2));
	return payment;
}

//updates the loan summary infomation
function updateSummary(pmt,totalPayPeriod){
	document.getElementById('lsummary').value = totalPayPeriod;
	document.getElementById('SnumPay').value = pmt.toFixed(2);
	document.getElementById('Tinterest').value = totalInterestPaid.toFixed(2);
}

//This function calculates that amount of the payment that will go towards paying the interest
function calculateInterestPaid(rate,numOfpaymets,principal){
	var iPaid = ((rate/numOfpaymets)*principal);
        return iPaid;
}

//This function calculates that amount of the payment that will go towards paying the principal
function calculatePrincipalPaid(payment,iPaid){
	var pPaid = payment-iPaid;
	return pPaid;
}
