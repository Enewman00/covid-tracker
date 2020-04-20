//outputs: Dictionary - date to new cases
function getGlobalGraph()
{
    var dateCount = {};
    const response = fetch("https://cors-anywhere.herokuapp.com/https://thevirustracker.com/timeline/map-data.json")
        .then(response => response.json())
        .then(json =>
        {
            var data = json.data;
            var total = 0;
            for (var i = 0; i < data.length; i++)
            {
                var date = data[i].date;
                if (dateCount.hasOwnProperty(date))
                {
                    dateCount[date] = dateCount[date] + parseInt(data[i].cases);
                }
                else
                {
                    dateCount[date] = parseInt(data[i].cases);
                }
                
            }
            var ordered = {};
            Object.keys(dateCount).sort().forEach(function (key)
            {
                ordered[key] = dateCount[key];
            });
            console.log("ORDERED");
            console.log(ordered);

            buildGraph(Object.keys(ordered), Object.values(ordered));
            console.log(dateCount);
        });
}

function getCaseData(countryCode)
{
    if (countryCode == "Global")
    {
        fetch("https://api.thevirustracker.com/free-api?global=stats")
            .then(response => response.json())
            .then(json =>
            {
                console.log(json);

                const totalCases = json.results[0].total_cases;
                const totalDeaths = json.results[0].total_deaths;
                const totalRecovered = json.results[0].total_recovered;

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
        fetch("https://api.thevirustracker.com/free-api?countryTotal=" + countryCode)
            .then(response => response.json())
            .then(json =>
            {
                console.log(json);

                const totalCases = json.countrydata[0].total_cases;
                const totalDeaths = json.countrydata[0].total_deaths;
                const totalRecovered = json.countrydata[0].total_recovered;

                // const deathPercent = (totalDeaths / totalCases) * 100;
                const deathPercent = (totalDeaths / (totalDeaths + totalRecovered)) * 100;
                // const recoveredPercent = (totalRecovered / totalCases) * 100;
                const recoveredPercent = (totalRecovered / (totalDeaths + totalRecovered)) * 100;

                document.getElementById("totalCases").innerHTML = totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById("totalDeaths").innerHTML = totalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + deathPercent.toFixed(2) + "%)";
                document.getElementById("totalRecovered").innerHTML = totalRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + recoveredPercent.toFixed(2) + "%)";
            });
    }    
}



function getGraphData(countryCode)
{
    var labels = [];
    var data = [];
    if (countryCode == "Global")
    {
        getGlobalGraph();
    }
    else
    {
        fetch("https://api.thevirustracker.com/free-api?countryTimeline=" + countryCode)
        .then(response => response.json())
        .then(json =>
        {
            const dates = json.timelineitems[0];

            console.log(json);
            console.log(dates);


            //get labels (dates)
            for (var key in dates)
            {
                labels.push(key.toString());
            }
            labels.pop();
            console.log(labels);



            for (var key in dates)
            {
                // console.log(dates[key]);
                if (dates[key].hasOwnProperty("total_cases"))
                {
                    console.log("pushing");
                    data.push(parseInt(dates[key].total_cases));
                }
            }
            console.log(data);


            buildGraph(labels, data);
            
            // dates.forEach(console.log());
        });
    }
    // .then(generateGraph(labels, data));
    // .then(response => response.json())
}


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
                label: '# of Total Cases',
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

function updateGraph(countryCode)
{
    var labels = [];
    var data = [];
    if (countryCode == "Global")
    {
        var dateCount = {};
        const response = fetch("https://cors-anywhere.herokuapp.com/https://thevirustracker.com/timeline/map-data.json")
            .then(response => response.json())
            .then(json =>
            {
                var data = json.data;
                var total = 0;
                for (var i = 0; i < data.length; i++)
                {
                    var date = data[i].date;
                    if (dateCount.hasOwnProperty(date))
                    {
                        dateCount[date] = dateCount[date] + parseInt(data[i].cases);
                    }
                    else
                    {
                        dateCount[date] = parseInt(data[i].cases);
                    }

                }

                var ordered = {};
                Object.keys(dateCount).sort().forEach(function (key)
                {
                    ordered[key] = dateCount[key];
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
        fetch("https://api.thevirustracker.com/free-api?countryTimeline=" + countryCode)
        .then(response => response.json())
        .then(json =>
        {
            const dates = json.timelineitems[0];

            console.log(json);
            console.log(dates);


            //get labels (dates)
            for (var key in dates)
            {
                labels.push(key.toString());
            }
            labels.pop();
            console.log(labels);



            for (var key in dates)
            {
                // console.log(dates[key]);
                if (dates[key].hasOwnProperty("total_cases"))
                {
                    console.log("pushing");
                    data.push(parseInt(dates[key].total_cases));
                }
            }
            console.log(data);

            
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



function populateCountries()
{
    var select = document.getElementById("selectNumber");
    var options = Object.keys(isoCountries);
    console.log(options);
    for(var i = 0; i < options.length; i++)
    {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}



function getCountryCode(countryName)
{
    if (isoCountries.hasOwnProperty(countryName))
    {
        return isoCountries[countryName];
    } else
    {
        return countryName;
    }
}


function changeForm()
{
    console.log("CHANGING");
    var e = document.getElementById("selectNumber");
    var strUser = e.options[e.selectedIndex].text;
    console.log(strUser);

    var code = getCountryCode(strUser);
    console.log(code);
    updateGraph(code);
    getCaseData(code);
}



var isoCountries = {
    // 'Global': 'Global',
    'United States': 'US',
    'Afghanistan': 'AF',
    'Albania': 'AL',
    'Algeria': 'DZ',
    'Angola': 'AO',
    'Argentina': 'AR',
    'Armenia': 'AM',
    'Australia': 'AU',
    'Austria': 'AT',
    'Azerbaijan': 'AZ',
    'Bahamas': 'BS',
    'Bangladesh': 'BD',
    'Belarus': 'BY',
    'Belgium': 'BE',
    'Belize': 'BZ',
    'Benin': 'BJ',
    'Bhutan': 'BT',
    'Bolivia': 'BO',
    'Bosnia And Herzegovina': 'BA',
    'Botswana': 'BW',
    'Brazil': 'BR',
    'Brunei Darussalam': 'BN',
    'Bulgaria': 'BG',
    'Burkina Faso': 'BF',
    'Burundi': 'BI',
    'Cambodia': 'KH',
    'Cameroon': 'CM',
    'Canada': 'CA',
    'Central African Republic': 'CF',
    'Chad': 'TD',
    'Chile': 'CL',
    'China': 'CN',
    'Colombia': 'CO',
    'Congo': 'CG',
    'Congo, Democratic Republic': 'CD',
    'Cook Islands': 'CK',
    'Costa Rica': 'CR',
    'Cote D\'Ivoire': 'CI',
    'Croatia': 'HR',
    'Cuba': 'CU',
    'Cyprus': 'CY',
    'Czech Republic': 'CZ',
    'Denmark': 'DK',
    'Djibouti': 'DJ',
    'Dominican Republic': 'DO',
    'Ecuador': 'EC',
    'Egypt': 'EG',
    'El Salvador': 'SV',
    'Equatorial Guinea': 'GQ',
    'Eritrea': 'ER',
    'Estonia': 'EE',
    'Ethiopia': 'ET',
    'Falkland Islands': 'FK',
    'Fiji': 'FJ',
    'Finland': 'FI',
    'France': 'FR',
    'French Guiana': 'GF',
    'French Southern Territories': 'TF',
    'Gabon': 'GA',
    'Gambia': 'GM',
    'Georgia': 'GE',
    'Germany': 'DE',
    'Ghana': 'GH',
    'Greece': 'GR',
    'Greenland': 'GL',
    'Guatemala': 'GT',
    'Guernsey': 'GG',
    'Guinea': 'GN',
    'Guinea-Bissau': 'GW',
    'Guyana': 'GY',
    'Haiti': 'HT',
    'Honduras': 'HN',
    'Hong Kong': 'HK',
    'Hungary': 'HU',
    'Iceland': 'IS',
    'India': 'IN',
    'Indonesia': 'ID',
    'Iran, Islamic Republic Of': 'IR',
    'Iraq': 'IQ',
    'Ireland': 'IE',
    'Israel': 'IL',
    'Italy': 'IT',
    'Jamaica': 'JM',
    'Japan': 'JP',
    'Jordan': 'JO',
    'Kazakhstan': 'KZ',
    'Kenya': 'KE',
    'Kosovo' : 'XK',
    'Kuwait' : 'KW',
    'Kyrgyzstan': 'KG',
    'Lao People\'s Democratic Republic': 'LA',
    'Latvia': 'LV',
    'Lebanon': 'LB',
    'Lesotho': 'LS',
    'Liberia': 'LR',
    'Libyan Arab Jamahiriya': 'LY',
    'Lithuania': 'LT',
    'Luxembourg': 'LU',
    'Macedonia': 'MK',
    'Madagascar': 'MG',
    'Malawi': 'MW',
    'Malaysia': 'MY',
    'Mali': 'ML',
    'Mauritania': 'MR',
    'Mexico': 'MX',
    'Moldova': 'MD',
    'Mongolia': 'MN',
    'Montenegro': 'ME',
    'Morocco': 'MA',
    'Mozambique': 'MZ',
    'Myanmar': 'MM',
    'Namibia': 'NA',
    'Nepal': 'NP',
    'Netherlands': 'NL',
    'New Caledonia': 'NC',
    'New Zealand': 'NZ',
    'Nicaragua': 'NI',
    'Niger': 'NE',
    'Nigeria': 'NG',
    'North Korea' : 'KP',
    'Norway': 'NO',
    'Oman': 'OM',
    'Pakistan': 'PK',
    'Palestine': 'PS',
    'Panama': 'PA',
    'Papua New Guinea': 'PG',
    'Paraguay': 'PY',
    'Peru': 'PE',
    'Philippines': 'PH',
    'Poland': 'PL',
    'Portugal': 'PT',
    'Puerto Rico': 'PR',
    'Qatar': 'QA',
    'Romania': 'RO',
    'Russia': 'RU',
    'Rwanda': 'RW',
    'Saudi Arabia': 'SA',
    'Senegal': 'SN',
    'Serbia': 'RS',
    'Sierra Leone': 'SL',
    'Singapore': 'SG',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Solomon Islands': 'SB',
    'Somalia': 'SO',
    'South Africa': 'ZA',
    'South Korea' : 'KR',
    'South Sudan' : 'SS',
    'Spain': 'ES',
    'Sri Lanka': 'LK',
    'Sudan': 'SD',
    'Suriname': 'SR',
    'Svalbard And Jan Mayen': 'SJ',
    'Swaziland': 'SZ',
    'Sweden': 'SE',
    'Switzerland': 'CH',
    'Syrian Arab Republic': 'SY',
    'Taiwan': 'TW',
    'Tajikistan': 'TJ',
    'Tanzania': 'TZ',
    'Thailand': 'TH',
    'Timor-Leste': 'TL',
    'Togo': 'TG',
    'Trinidad And Tobago': 'TT',
    'Tunisia': 'TN',
    'Turkey': 'TR',
    'Turkmenistan': 'TM',
    'Uganda': 'UG',
    'Ukraine': 'UA',
    'United Arab Emirates': 'AE',
    'United Kingdom': 'GB',
    'Uruguay': 'UY',
    'Uzbekistan': 'UZ',
    'Vanuatu': 'VU',
    'Venezuela': 'VE',
    'Vietnam': 'VN',
    'Western Sahara': 'EH',
    'Yemen': 'YE',
    'Zambia': 'ZM',
    'Zimbabwe': 'ZW'
};