const ONE_DAY = 1000*60*60*24;
var rateArray = [];
//get 2 string dates
//return 1 value difference between dates
var dateDifference =(startDate,endDate)=>{
  var startDate = new Date(startDate).getTime();
  var endDate = new Date(endDate).getTime(); 
  var difference_ms = endDate - startDate;
  return Math.round(difference_ms/ONE_DAY)
}

//get 2 string dates
//return array with 3 elements [startDate,endDate,dateDifference] 
var returnValidDate=(startDate,endDate)=>{
  main.innerHTML='';
  var arr = [];
  var today = new Date().toISOString().substring(0,10)
  startDate = (startDate == '')?  today  : startDate;
  endDate = (endDate == '')? today : endDate;
  arr.push(startDate,endDate,dateDifference(startDate,endDate));
  return arr
}

//get 2 values
//return 1 value numeric date
var convertDate = (date,counter) =>{
  var dayCount = ONE_DAY*counter;
  var startDate = new Date(date).getTime();
  var newDay = new Date(startDate+dayCount).toISOString().substring(0,10).split('-').join('');
  return newDay;

}

var xhrRequest = (url) =>{
    fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    rateArray.push(myJson[0].rate); 
    var p = document.createElement('p');
    p.innerText=`${myJson[0].exchangedate} rate was ${myJson[0].rate.toFixed(2)}`;
    main.appendChild(p);
    return myJson[0].rate
  });

}

send.addEventListener('click',()=>{
  main.innerHTML='';
  var startDate = document.getElementById('startDate').value;
  var endDate = document.getElementById('endDate').value;
  var ourDate = returnValidDate(startDate,endDate);
  if(ourDate[2]<0){
    main.innerHTML='<p>Wrong Date</p>';
    myDiv.innerHTML='';
    rateArray=[];
    return 'wrong number';
  }

  for(let i = 0; i <= ourDate[2];i++){
    var date = convertDate(ourDate[0],i);
    var url =`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${valcode.value}&date=${date}&json`;
    xhrRequest(url);
  }
  

},false);


build.addEventListener('click',()=>{

  var filled=[];
  for (let i = 0; i < rateArray.length; i++) {
    filled.push(i);
    
  }
  var trace1 = {
    x: filled,
    y: rateArray,
    type: 'scatter',
  };
  
  
  var data = [trace1];
  
  Plotly.newPlot('myDiv', data, {}, {showSendToCloud: true});
});

