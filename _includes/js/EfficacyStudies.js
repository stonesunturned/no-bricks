<script type="text/javascript">
	google.charts.load('current', {packages: ['corechart']});
	function MakeCalculatedChart() {
		google.charts.setOnLoadCallback(drawChart);
		// Callback that creates and populates a data table,
		// instantiates the chart, passes in the data and
		// draws it.
		function drawChart() {
			var regcols={"North America":"#3366CC", "Africa":"#DC3912", "Europe":"#109618", "Middle East":"#FF9900", "South America":"#990099", "Asia":"#DD4477", "W Pacific":"#0099C6"}
			// Declare columns
			var data = new google.visualization.DataTable();
			var notestr;
			data.addColumn({label: 'Year', id: 'year', type: 'number'});
			data.addColumn({label: 'Efficacy', id: 'efficacy', type: 'number'});
			data.addColumn({label: 'Region and Num Subj', id: 'ptstyle',type:'string','role': 'style'});
//			data.addColumn({label: 'Region', id: 'region', type: 'string'});
//			data.addColumn({label: 'Number Patient', id: 'numpat', type: 'number'});
      data.addColumn({label:'Notes', id: 'notes',type: 'string', role: 'tooltip'});
      data.addColumn({label:'Under 12 months', id: 'child_lt12',type: 'boolean', role: 'certainty'});
			data.addColumn({label:'Paper Link',id:'source',type:'string'});
//			data.addColumn({label: 'Title', id: 'title', type: 'string'});
//			data.addColumn({label: 'Journal', id: 'journal', type: 'string'});
//			data.addColumn({label: 'Type', id: 'study_type', type: 'string'});
//			data.addColumn({label: 'Peer Reviewed', id: 'peerrev', type: 'boolean'});
//			data.addColumn({label: 'Retrospective', id: 'retrospective', type: 'boolean'});
//			data.addColumn({label: 'Before 12 months', id: 'child_lt12', type: 'boolean'});
//			data.addColumn({label: 'Drug Company', id: 'drugcomp', type: 'boolean'});
//			data.addColumn({label: 'Government', id: 'gov', type: 'string'});
//			data.addColumn({label: 'Two doses', id: 'twodose', type: 'string'});
//			data.addColumn({label: 'Source', id: 'source', type: 'string'});

			{% for paperrow in site.data.EfficacyData %}
				notestr="{{paperrow.notes}}"
				data.addRow([{{ paperrow.year }},{{paperrow.efficacy}},"point {fill-color: "+regcols["{{paperrow.region}}"]+"; size: " + (Math.max(4,{{paperrow.numpat}}/600)).toString() + "}","{{paperrow.author}}\n"+notestr.replace(/(.{120})/g, "$1\n"),!{{paperrow.child_lt12}},"{{paperrow.source}}"]);
			{% endfor %}
			var view = new google.visualization.DataView(data);
			view.setColumns([0,1,2,3,4]);

			// Set chart options
			var bubboptions = {hAxis: {title: 'Year',
											viewWindow: {min: 1960, max: 2020}
											},
				             vAxis: {title: 'Efficacy',
											viewWindow: {min: 0, max: 100}
											},
										 legend:'none'
				             };

			// Instantiate and draw the proportions chart, passing in some options.
			var effchart = new google.visualization.ScatterChart(document.getElementById("bubble_efficacy"));
			effchart.draw(view, bubboptions);

			function selectHandlerProp() {
					var selectedItem = effchart.getSelection()[0];
					if (selectedItem) {
						paplink = data.getValue(selectedItem.row, 5);
						window.open(paplink, "_blank");
					}
				};
			google.visualization.events.addListener(effchart, 'select', selectHandlerProp);

			// Custom Legend
			var dataleg = new google.visualization.DataTable();
			var colvals=[];
      dataleg.addColumn('number', 'xval');
			for (var key in regcols) {
				dataleg.addColumn('number',key);
				dataleg.addColumn({type:'string',role:'annotation'});
			}
			dataleg.addRows(Object.keys(regcols).length);
			var keyct=0
			for (var key in regcols) {
				dataleg.setCell(keyct,0,0);
				dataleg.setCell(keyct,2*keyct+1,keyct);
				dataleg.setCell(keyct,2*keyct+2,key);
				colvals.push(regcols[key]);
				keyct=keyct+1;
			}
      var legoptions = {
          legend: 'none',
          vAxis: { textPosition: 'none', gridlines: { count: 0 },
                   baselineColor: 'white' },
          hAxis: { textPosition: 'none', gridlines: { count: 0 },
                   baselineColor: 'white' },
          colors: colvals,
          pointSize: 12,
					enableInteractivity: false,
          annotations: {stemColor: 'white', textStyle: { fontSize: 12 } }
      };

      var legchart = new google.visualization.ScatterChart(document.getElementById('bubble_legend'));
      legchart.draw(dataleg, legoptions);
		};
	};
</script>

