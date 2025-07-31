/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.807581435572211, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5048923679060665, 500, 1500, "01_01_Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "04_08_Enter Payment Deatils"], "isController": true}, {"data": [1.0, 500, 1500, "Enter Username, Password, click Login"], "isController": false}, {"data": [0.5, 500, 1500, "03_01_Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "03_07_Click SignOut"], "isController": true}, {"data": [0.5055147058823529, 500, 1500, "02_01_Open URL"], "isController": true}, {"data": [0.9791666666666666, 500, 1500, "03_02_Click SignIn"], "isController": true}, {"data": [1.0, 500, 1500, "04_04_Click Category"], "isController": true}, {"data": [1.0, 500, 1500, "Confirm Order"], "isController": false}, {"data": [1.0, 500, 1500, "04_05_Click ProductId"], "isController": true}, {"data": [0.9939516129032258, 500, 1500, "01_02_Search"], "isController": true}, {"data": [1.0, 500, 1500, "Click Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "04_09_Confirm Order"], "isController": true}, {"data": [1.0, 500, 1500, "03_05_Click ProductId"], "isController": true}, {"data": [1.0, 500, 1500, "Click Signout-0"], "isController": false}, {"data": [1.0, 500, 1500, "Click Signout-1"], "isController": false}, {"data": [1.0, 500, 1500, "02_04_Click ItemId"], "isController": true}, {"data": [1.0, 500, 1500, "Search"], "isController": false}, {"data": [1.0, 500, 1500, "Click Proceed to Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "04_02_Click SignIn"], "isController": true}, {"data": [1.0, 500, 1500, "04_07_Click Proceed to Checkout"], "isController": true}, {"data": [1.0, 500, 1500, "Click ProductId"], "isController": false}, {"data": [1.0, 500, 1500, "04_03_Enter Username, Password, click Login"], "isController": true}, {"data": [1.0, 500, 1500, "03_04_Click Category"], "isController": true}, {"data": [1.0, 500, 1500, "04_10_Click SignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Enter Username, Password, click Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Click Category"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Username, Password, click Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_06_Click Add to Cart"], "isController": true}, {"data": [1.0, 500, 1500, "0Enter Payment Deatils"], "isController": false}, {"data": [1.0, 500, 1500, "04_06_Click Add to Cart"], "isController": true}, {"data": [1.0, 500, 1500, "Click Sgnin"], "isController": false}, {"data": [0.9962121212121212, 500, 1500, "02_02_Click Category"], "isController": true}, {"data": [1.0, 500, 1500, "Click Signin"], "isController": false}, {"data": [0.49810174639331817, 500, 1500, "Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "03_03_Enter Username, Password, click Login"], "isController": true}, {"data": [1.0, 500, 1500, "Click Signout"], "isController": false}, {"data": [1.0, 500, 1500, "02_03_Click ProductId"], "isController": true}, {"data": [1.0, 500, 1500, "Click ItemId"], "isController": false}, {"data": [0.625, 500, 1500, "04_01_Open URL"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3639, 0, 0.0, 342.16295685627927, 0, 2717, 163.0, 630.0, 658.0, 672.0, 37.39479822839703, 151.358537094864, 26.294542160348566], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["01_01_Open URL", 1022, 0, 0.0, 637.6457925635999, 0, 2716, 621.0, 659.0, 664.0, 1997.2199999999912, 10.25877818152617, 49.29073303336612, 6.075377034565658], "isController": true}, {"data": ["04_08_Enter Payment Deatils", 3, 0, 0.0, 160.66666666666666, 157, 167, 158.0, 167.0, 167.0, 167.0, 0.0652897777971229, 0.3013276268253934, 0.08180350089229363], "isController": true}, {"data": ["Enter Username, Password, click Login", 48, 0, 0.0, 314.60416666666663, 306, 334, 310.0, 327.1, 330.1, 334.0, 0.5564959306235073, 2.922690541887912, 0.9064796994921974], "isController": false}, {"data": ["03_01_Open URL", 48, 0, 0.0, 646.7708333333333, 615, 1274, 624.5, 662.0, 662.0, 1274.0, 0.5070351121815186, 2.5194132388980437, 0.2818237155110491], "isController": true}, {"data": ["03_07_Click SignOut", 42, 0, 0.0, 448.2142857142857, 0, 498, 462.0, 492.4, 495.85, 498.0, 0.5040322580645161, 4.80546379968318, 0.8930259036578341], "isController": true}, {"data": ["02_01_Open URL", 272, 0, 0.0, 635.5772058823529, 0, 2717, 621.0, 658.0, 663.0, 2159.9099999999867, 2.8282954320949143, 13.642975468176477, 1.6045028191970552], "isController": true}, {"data": ["03_02_Click SignIn", 48, 0, 0.0, 193.60416666666663, 0, 2185, 156.0, 165.0, 165.55, 2185.0, 0.5139956738697449, 1.969710228246204, 0.29439303000449746], "isController": true}, {"data": ["04_04_Click Category", 3, 0, 0.0, 156.66666666666666, 154, 162, 154.0, 162.0, 162.0, 162.0, 0.06534808747930644, 0.24260902919970376, 0.04024693408556243], "isController": true}, {"data": ["Confirm Order", 3, 0, 0.0, 163.66666666666666, 160, 171, 160.0, 171.0, 171.0, 171.0, 0.06525569355926306, 0.3460548514889174, 0.03957400947295152], "isController": false}, {"data": ["04_05_Click ProductId", 3, 0, 0.0, 158.0, 154, 164, 156.0, 164.0, 164.0, 164.0, 0.06530114712348448, 0.2591426707624997, 0.04223742816873816], "isController": true}, {"data": ["01_02_Search", 992, 0, 0.0, 165.48286290322582, 0, 2207, 155.0, 165.0, 166.0, 171.2099999999998, 10.55656060444823, 35.88020736338725, 9.285678358119613], "isController": true}, {"data": ["Click Add to Cart", 45, 0, 0.0, 160.2888888888889, 153, 175, 158.0, 167.4, 168.0, 175.0, 0.5389996167113836, 2.533824565356698, 0.34994035445213684], "isController": false}, {"data": ["04_09_Confirm Order", 3, 0, 0.0, 163.66666666666666, 160, 171, 160.0, 171.0, 171.0, 171.0, 0.06528835690968444, 0.34622806719260063, 0.03959381800870511], "isController": true}, {"data": ["03_05_Click ProductId", 44, 0, 0.0, 155.70454545454547, 0, 177, 156.0, 167.5, 170.0, 177.0, 0.5277044854881267, 2.0972552245742384, 0.3335046436495563], "isController": true}, {"data": ["Click Signout-0", 43, 0, 0.0, 157.30232558139537, 151, 188, 154.0, 163.6, 172.2, 188.0, 0.5353119125574216, 0.12023607410957711, 0.33476446275847477], "isController": false}, {"data": ["Click Signout-1", 43, 0, 0.0, 156.90697674418607, 152, 166, 154.0, 164.0, 164.8, 166.0, 0.5352386168438348, 2.638559118972342, 0.3300143806480122], "isController": false}, {"data": ["02_04_Click ItemId", 248, 0, 0.0, 153.2862903225807, 0, 176, 155.0, 164.0, 165.0, 171.54999999999995, 2.8013735767214896, 10.166606010245346, 1.750615800933038], "isController": true}, {"data": ["Search", 967, 0, 0.0, 157.20372285418821, 152, 185, 155.0, 165.0, 165.0, 169.0, 10.591224726731067, 36.92868815510613, 9.5570217006473], "isController": false}, {"data": ["Click Proceed to Checkout", 3, 0, 0.0, 161.33333333333334, 156, 168, 160.0, 168.0, 168.0, 168.0, 0.06530541164177806, 0.3560547980430145, 0.041070981540336976], "isController": false}, {"data": ["04_02_Click SignIn", 3, 0, 0.0, 157.66666666666666, 154, 164, 155.0, 164.0, 164.0, 164.0, 0.06532958777030116, 0.2612970849393524, 0.039044636440844056], "isController": true}, {"data": ["04_07_Click Proceed to Checkout", 3, 0, 0.0, 161.33333333333334, 156, 168, 160.0, 168.0, 168.0, 168.0, 0.06532816514960149, 0.3561788535451418, 0.04108529136361657], "isController": true}, {"data": ["Click ProductId", 294, 0, 0.0, 157.81972789115648, 153, 177, 156.0, 165.0, 166.0, 170.05, 3.3150292602072455, 13.144773279201011, 2.14389642436321], "isController": false}, {"data": ["04_03_Enter Username, Password, click Login", 3, 0, 0.0, 314.3333333333333, 308, 326, 309.0, 326.0, 326.0, 326.0, 0.06516214513781794, 0.34222853178826645, 0.10614302547839874], "isController": true}, {"data": ["03_04_Click Category", 45, 0, 0.0, 155.44444444444446, 0, 174, 155.0, 167.4, 168.0, 174.0, 0.5236028530537682, 1.9781915775572183, 0.31565025292926707], "isController": true}, {"data": ["04_10_Click SignOut", 3, 0, 0.0, 317.0, 308, 328, 315.0, 328.0, 328.0, 328.0, 0.0650180967035825, 0.3351225726577231, 0.07968526500292582], "isController": true}, {"data": ["Enter Username, Password, click Login-0", 48, 0, 0.0, 157.12499999999994, 153, 167, 155.0, 164.0, 164.55, 167.0, 0.5575495696414259, 0.12523086036867967, 0.5270585775516605], "isController": false}, {"data": ["Click Category", 303, 0, 0.0, 157.09900990099015, 153, 174, 155.0, 165.0, 166.0, 171.91999999999996, 3.261396049728217, 12.297981220736236, 2.009297972391152], "isController": false}, {"data": ["Enter Username, Password, click Login-1", 48, 0, 0.0, 157.20833333333331, 153, 170, 154.5, 164.0, 164.55, 170.0, 0.5575042393551535, 2.8027654533206348, 0.3811064136216869], "isController": false}, {"data": ["03_06_Click Add to Cart", 43, 0, 0.0, 156.58139534883725, 0, 175, 158.0, 167.6, 168.0, 175.0, 0.5154700967405508, 2.366746671921265, 0.326874910092425], "isController": true}, {"data": ["0Enter Payment Deatils", 3, 0, 0.0, 160.66666666666666, 157, 167, 158.0, 167.0, 167.0, 167.0, 0.06530967671710025, 0.3014194650048982, 0.08182843283988243], "isController": false}, {"data": ["04_06_Click Add to Cart", 3, 0, 0.0, 160.0, 156, 167, 157.0, 167.0, 167.0, 167.0, 0.06531252041016262, 0.30723672931225915, 0.04241486921167788], "isController": true}, {"data": ["Click Sgnin", 46, 0, 0.0, 157.91304347826087, 153, 166, 156.0, 164.3, 165.0, 166.0, 0.5083434633661178, 2.032747921040999, 0.3038146480274064], "isController": false}, {"data": ["02_02_Click Category", 264, 0, 0.0, 159.75000000000003, 0, 2192, 155.0, 164.0, 165.0, 172.35000000000002, 2.780059392177924, 10.123992031022935, 1.6606457550125313], "isController": true}, {"data": ["Click Signin", 3, 0, 0.0, 157.66666666666666, 154, 164, 155.0, 164.0, 164.0, 164.0, 0.06540650140623977, 0.26160471444611594, 0.039090604356073], "isController": false}, {"data": ["Open URL", 1317, 0, 0.0, 635.5246772968875, 611, 2308, 621.0, 659.0, 662.0999999999999, 680.6399999999999, 13.533649152733961, 66.5507378574805, 8.09689963057351], "isController": false}, {"data": ["03_03_Enter Username, Password, click Login", 45, 0, 0.0, 314.62222222222215, 306, 334, 310.0, 327.4, 330.4, 334.0, 0.5215274960885438, 2.7390379628556527, 0.8495193979254796], "isController": true}, {"data": ["Click Signout", 83, 0, 0.0, 238.2650602409639, 152, 343, 306.0, 326.0, 328.8, 343.0, 1.0311583759876757, 5.1668809089723196, 0.9701687163009988], "isController": false}, {"data": ["02_03_Click ProductId", 255, 0, 0.0, 153.23137254901965, 0, 171, 156.0, 165.0, 165.0, 166.0, 2.774875946722382, 10.653304754831549, 1.7453174818544877], "isController": true}, {"data": ["Click ItemId", 242, 0, 0.0, 157.08677685950414, 152, 176, 155.0, 164.0, 165.0, 171.84999999999997, 2.8286889844772767, 10.52026015610389, 1.8115124792523845], "isController": false}, {"data": ["04_01_Open URL", 4, 0, 0.0, 478.75, 0, 661, 627.0, 661.0, 661.0, 661.0, 0.058286097308639456, 0.22213036596383348, 0.02485981738237137], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3639, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
