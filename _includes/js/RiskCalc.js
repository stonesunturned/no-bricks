<script type="text/javascript">
	google.charts.load('current', {packages: ['corechart']});
	// I cannot figure out how to do this without global variable. Sorry.
	var efficacy;
	var psick;
	var cvg;

	function MakeCalculatedChart() {
		google.charts.setOnLoadCallback(drawChart);
		// Callback that creates and populates a data table,
		// instantiates the chart, passes in the data and
		// draws it.
		function drawChart() {
			var npop = 100;

			// Declare columns
			var data = new google.visualization.DataTable();
			data.addColumn({label: 'Year', id: 'year', type: 'number'});
			data.addColumn({label: 'Coverage', id: 'coverage', type: 'number'});
			data.addColumn({label: 'Vaccinated', id: 'pvacc', type: 'number'});
			data.addColumn({label: 'Unvaccinated', id: 'punvacc', type: 'number'});
			data.addColumn({label: 'Vacc Sick', id: 'nvacc', type: 'number'});
			data.addColumn({label: 'Unvacc Sick', id: 'nunvacc', type: 'number'});
			data.addColumn({label: 'Vacc Healthy', id: 'nvacchealth', type: 'number'});
			data.addColumn({label: 'Unvacc Healthy', id: 'nunvacchealth', type: 'number'});
			{% for riskval in site.data.proportions %}
				data.addRow([{{ riskval.year }}, {{ riskval.coverage }},
					({{ riskval.coverage }} - {{ riskval.coverage }}*efficacy)*100/(100 - {{ riskval.coverage }}*efficacy),
					(100 - {{ riskval.coverage}} )*100/(100 - {{ riskval.coverage }}*efficacy),
					{{ riskval.coverage }}/100 * npop * (1 - efficacy) * psick,
					(100 - {{ riskval.coverage }})/100 * npop * psick,
					{{ riskval.coverage }}/100 * npop * (1 - (1 - efficacy) * psick),
					(100 - {{ riskval.coverage }})/100 * npop * (1 - psick)]);
			{% endfor %}
			var view = new google.visualization.DataView(data);
			view.setColumns([{ calc: "stringify",
                         sourceColumn: 1,
                         type: "string"}, 3, 2]);

			// Set chart options
			var propoptions = {isStacked: true,
				             hAxis: {title: 'Coverage'},
				             vAxis: {title: 'Percentage'},
				             colors: ['#b8ff88','#368800','#183c00'],
				             chartArea: {left: 50, width: "60%", height: "75%" }
				             };
			var numoptions = {isStacked: true,
				             hAxis: {title: 'Coverage'},
				             vAxis: {'minValue': 0, 'maxValue': 100, title: 'Percentage'},
				             colors: ['#b8ff88','#e8deef','#368800','#305'],
				             chartArea: {left: 50, width: "60%", height: "75%" }
				             };

			// Instantiate and draw the proportions chart, passing in some options.
			var propchart = new google.visualization.ColumnChart(document.getElementById("column_proportion"));
			propchart.draw(view, propoptions);

			view.setColumns([{ calc: "stringify",
                         sourceColumn: 1,
                         type: "string"}, 5, 7, 4, 6]);
			var numchart = new google.visualization.ColumnChart(document.getElementById("column_numsick"));
			numchart.draw(view, numoptions);

			function selectHandlerProp() {
					var selectedItem = propchart.getSelection()[0];
					if (selectedItem) {
						cvg = data.getValue(selectedItem.row, 1)/100;
						drawChart();
					}
				};
			google.visualization.events.addListener(propchart, 'select', selectHandlerProp);

			function selectHandlerNum() {
					var selectedItem = numchart.getSelection()[0];
					if (selectedItem) {
						cvg = data.getValue(selectedItem.row, 1)/100;
						drawChart();
					}
				};
			google.visualization.events.addListener(numchart, 'select', selectHandlerNum);

			var data2 = google.visualization.arrayToDataTable([
					['Who', 'Vaccinated', 'Unvaccinated'],
					['Sick', cvg * npop * (1 - efficacy) * psick, (1 - cvg) * npop * psick],
					['Healthy', cvg * npop * (1-(1-efficacy) * psick), (1 - cvg) * npop * (1-psick)]
				]);
			var view2 = new google.visualization.DataView(data2);
			view2.setColumns([0,1]);
			var vaccchart = new google.visualization.PieChart(document.getElementById('pie_vacc'));
			vaccchart.draw(view2, {colors: ['#368800','#305'],
				             chartArea: {left: 20, width: "95%", height: "100%" }});
			view2.setColumns([0,2]);
			var unvaccchart = new google.visualization.PieChart(document.getElementById('pie_unvacc'));
			unvaccchart.draw(view2, {colors: ['#b8ff88','#e8deef'],
										chartArea: {left: 20, width: "95%", height: "100%" }});
			var data3 = google.visualization.arrayToDataTable([
				['Who', 'Number'],
				['Sick Vacc', cvg * npop * (1 - efficacy) * psick],
				['Healthy Vacc', cvg * npop * (1-(1-efficacy) * psick)],
				['Sick Unvacc', (1 - cvg) * npop * psick],
				['Healthy Unvacc', (1 - cvg) * npop * (1-psick)]
			]);
			var allchart = new google.visualization.PieChart(document.getElementById('pie_all'));
			allchart.draw(data3, {colors: ['#368800','#305','#b8ff88','#e8deef'],
				             chartArea: {left: 20, width: "95%", height: "100%" }});
			document.getElementById('vacc_title').innerHTML="The Vaccinated ("+(cvg*100)+"% coverage)";
			document.getElementById('unvacc_title').innerHTML="The Unvaccinated ("+(cvg*100)+"% coverage)";
			document.getElementById('all_title').innerHTML="All together now ("+(cvg*100)+"% coverage)";
		};
	};
</script>

