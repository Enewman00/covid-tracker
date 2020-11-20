//outputs: Dictionary - date to new cases
function getGlobalGraph()
{
    var dateCount = {};
    const response = fetch("https://api.covidtracking.com/v1/states/daily.json")
        .then(response => response.json())
        .then(json =>
        {
            // var data = json.data;
            var total = 0;
            for (var i = 0; i < json.length; i++)
            {
                var date = json[i].date;
                if (dateCount.hasOwnProperty(date))
                {
                    dateCount[date] = dateCount[date] + parseInt(json[i].positiveIncrease);
                }
                else
                {
                    dateCount[date] = parseInt(json[i].positiveIncrease);
                }
                
            }
            var ordered = {};
            Object.keys(dateCount).sort().forEach(function (key)
            {
                //20201119
                var newKey = key.substring(0, 4) + "/" + key.substring(4,6) + "/" + key.substring(6);
                ordered[new Date(newKey).toDateString()] = dateCount[key];
            });

            buildGraph(Object.keys(ordered), Object.values(ordered));
        });
}

function getCaseData(stateCode)
{
    if (stateCode == "All States")
    {
        fetch("https://api.covidtracking.com/v1/us/current.json")
            .then(response => response.json())
            .then(json =>
            {

                const totalCases = json[0].positive;
                const totalDeaths = json[0].death;
                const totalRecovered = json[0].recovered;

                // const deathPercent = (totalDeaths / totalCases) * 100;
                const deathPercent = (totalDeaths / (totalDeaths + totalRecovered)) * 100;
                // const recoveredPercent = (totalRecovered / totalCases) * 100;
                const recoveredPercent = (totalRecovered / (totalDeaths + totalRecovered)) * 100;

                document.getElementById("totalCases").innerHTML = totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById("totalDeaths").innerHTML = totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + deathPercent.toFixed(2) + "%)";
                document.getElementById("totalRecovered").innerHTML = totalRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + recoveredPercent.toFixed(2) + "%)";
            });
    }
    else
    {
        fetch("https://api.covidtracking.com/v1/states/" + stateCode.toLowerCase() + "/current.json")
            .then(response => response.json())
            .then(json =>
            {

                const totalCases = json.positive;
                const totalDeaths = json.death;
                var totalRecovered;
                if (json.recovered != null)
                {
                    totalRecovered = json.recovered;
                }
                else
                {
                    totalRecovered = -1;
                }

                // const deathPercent = (totalDeaths / totalCases) * 100;
                if (totalRecovered != -1)
                {

                    const deathPercent = (totalDeaths / (totalDeaths + totalRecovered)) * 100;
                    const recoveredPercent = (totalRecovered / (totalDeaths + totalRecovered)) * 100;
                    document.getElementById("totalDeaths").innerHTML = totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + deathPercent.toFixed(2) + "%)";
                    document.getElementById("totalRecovered").innerHTML = totalRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + recoveredPercent.toFixed(2) + "%)";
                }
                else
                {
                    document.getElementById("totalDeaths").innerHTML = totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.getElementById("totalRecovered").innerHTML = "Not Available";
                
                }
                // const recoveredPercent = (totalRecovered / totalCases) * 100;

                document.getElementById("totalCases").innerHTML = totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            });
    }    
}



function getGraphData(countryCode)
{
    var labels = [];
    var data = [];
    if (countryCode == "All States")
    {
        getGlobalGraph();
    }
    else
    {
        fetch(`"https://api.covidtracking.com/v1/states/" + countryCode.toLowerCase() + "/daily.json"`)
        .then(response => response.json())
        .then(json =>
        {
            // const dates = json[0];


            for (var i = 0; i < json.length; i++)
            {
                var newKey = json[i].date.toString().substring(0, 4) + "/" + json[i].date.toString().substring(4,6) + "/" + json[i].date.toString().substring(6);
                labels.unshift(new Date(newKey).toDateString());
                data.unshift(json[i].positiveIncrease);
                
            }


            buildGraph(labels, data);
            
            // dates.forEach(console.log());
        });
    }
    // .then(generateGraph(labels, data));
    // .then(response => response.json())
}

//initial building of graph
function buildGraph(labels, data)
{
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.height = 400;
    ctx.width = 400;
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, //dates
            // labels: ["test", "test2", "test3"], //dates
            datasets: [{
                label: '# of New Cases',
                data: data,
                // data: [2, 5, 20],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data)
                    {
                        var value = data.datasets[0].data[tooltipItem.index];
                        value = value.toString();
                        value = value.split(/(?=(?:...)*$)/);
                        value = value.join(',');
                        return value;
                    }
                } // end callbacks:
            }, //end tooltips
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function (value, index, values)
                        {
                            // Convert the number to a string and splite the string every 3 charaters from the end
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }]
            }
        }
    });
}

function updateGraph(stateCode)
{
    var labels = [];
    var data = [];
    if (stateCode == "All States")
    {
        var dateCount = {};
        const response = fetch("https://api.covidtracking.com/v1/states/daily.json")
            .then(response => response.json())
            .then(json =>
            {
                // var data = json.data;
                var total = 0;
                for (var i = 0; i < json.length; i++)
                {
                    var date = json[i].date;
                    if (dateCount.hasOwnProperty(date))
                    {
                        dateCount[date] = dateCount[date] + parseInt(json[i].positiveIncrease);
                    }
                    else
                    {
                        dateCount[date] = parseInt(json[i].positiveIncrease);
                    }
                    
                }
                var ordered = {};
                Object.keys(dateCount).sort().forEach(function (key)
                {
                    //20201119
                    var newKey = key.substring(0, 4) + "/" + key.substring(4,6) + "/" + key.substring(6);
                    ordered[new Date(newKey).toDateString()] = dateCount[key];
                });

                Chart.helpers.each(Chart.instances, function (instance)
                {
                    var chart = instance.chart;
                    // .canvas.id;
                    chart.data.labels = Object.keys(ordered);
                    chart.data.datasets[0].data = Object.values(ordered);
                    chart.update();
                })
            });
    }
    else
    {
        fetch("https://api.covidtracking.com/v1/states/" + stateCode.toLowerCase() + "/daily.json")
        .then(response => response.json())
        .then(json =>
        {
            for (i = 0; i < json.length; i++)
            {
                // console.log(i);
                const options = { year: "numeric", month: "long", day: "numeric" }
                // console.log(new Date("2020/11/19").toLocaleDateString(undefined, options));
                var newKey = json[i].date.toString().substring(0, 4) + "/" + json[i].date.toString().substring(4,6) + "/" + json[i].date.toString().substring(6);
                labels.unshift(new Date(newKey).toDateString());
                data.unshift(json[i].positiveIncrease);
                // console.log(labels);    
            }

            
            Chart.helpers.each(Chart.instances, function (instance)
            {
                var chart = instance.chart;
                // .canvas.id;
                chart.data.labels = labels;
                chart.data.datasets[0].data = data;
                chart.update();
            })
        });
    }
}



function populateStates()
{
    var select = document.getElementById("selectNumber");
    var options = Object.keys(stateCodes);
    for(var i = 0; i < options.length; i++)
    {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}



function getStateCode(stateName)
{
    if (stateCodes.hasOwnProperty(stateName))
    {
        return stateCodes[stateName];
    } else
    {
        return stateName;
    }
}


function changeForm()
{
    var e = document.getElementById("selectNumber");
    var strUser = e.options[e.selectedIndex].text;

    var code = getStateCode(strUser);
    updateGraph(code);
    getCaseData(code);
}

    
var stateCodes = {
    'Alabama' : 'AL',
    'Alaska' : 'AK',
    'Arizona' : 'AZ',
    'Arkansas' : 'AR',
    'California' : 'CA',
    'Colorado' : 'CO',
    'Connecticut' : 'CT',
    'Delaware' : 'DE',
    'Florida' : 'FL',
    'Georgia' : 'GA',
    'Hawaii' : 'HI',
    'Idaho' : 'ID',
    'Illinois' : 'IL',
    'Indiana' : 'IN',
    'Iowa' : 'IA',
    'Kansas' : 'KS',
    'Kentucky' : 'KY',
    'Louisiana' : 'LA',
    'Maine' : 'ME',
    'Maryland' : 'MD',
    'Massachusetts' : 'MA',
    'Michigan' : 'MI',
    'Minnesota' : 'MN',
    'Mississippi' : 'MS',
    'Missouri' : 'MO',
    'Montana' : 'MT',
    'Nebraska' : 'NE',
    'Nevada' : 'NV',
    'New Hampshire' : 'NH',
    'New Jersey' : 'NJ',
    'New Mexico' : 'NM',
    'New York' : 'NY',
    'North Carolina' : 'NC',
    'North Dakota' : 'ND',
    'Ohio' : 'OH',
    'Oklahoma' : 'OK',
    'Oregon' : 'OR',
    'Pennsylvania' : 'PA',
    'Rhode Island' : 'RI',
    'South Carolina' : 'SC',
    'South Dakota' : 'SD',
    'Tennessee' : 'TN',
    'Texas' : 'TX',
    'Utah' : 'UT',
    'Vermont' : 'VT',
    'Virginia' : 'VA',
    'Washington' : 'WA',
    'West Virginia' : 'WV',
    'Wisconsin' : 'WI',
    'Wyoming' : 'WY'
};