
function getCaseData(stateCode)
{
    
    fetch("https://api.covidactnow.org/v2/state/" + stateCode.toUpperCase() + ".timeseries.json?apiKey=52c9b2ce6f2743aaa9d693ec589def07")
        .then(response => response.json())
        .then(getActuals => getActuals.actuals)
        .then(json =>
        {
            const totalCases = json.cases;
            const totalDeaths = json.deaths;
            const totalVaccinated= json.vaccinationsCompleted;
            
            
            document.getElementById("totalDeaths").innerHTML = totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById("totalVaccinated").innerHTML = totalVaccinated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById("totalCases").innerHTML = totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        });

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
    
    fetch("https://api.covidactnow.org/v2/state/" + stateCode.toUpperCase() + ".timeseries.json?apiKey=52c9b2ce6f2743aaa9d693ec589def07")
    .then(response => response.json())
    .then(getTimeSeries => getTimeSeries.actualsTimeseries)
    .then(json =>
    {

        for (i = 0; i < json.length; i++)
        {
            const options = { year: "numeric", month: "long", day: "numeric" }
            var newKey = json[i].date.toString().substring(0, 4) + "/" + json[i].date.toString().substring(5,7) + "/" + json[i].date.toString().substring(8);
            labels.push(new Date(newKey).toDateString());
            data.push(json[i].newCases || 0);
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