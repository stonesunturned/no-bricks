<script type="text/javascript">
	google.charts.load('current', {packages: ['corechart']});
	// I cannot figure out how to do this without global variable. Sorry.
	var efficacy;
	var cvg;
	var serint;
	var repno;

	function MakeCalculatedChart() {
		google.charts.setOnLoadCallback(drawChart);
		// Callback that creates and populates a data table,
		// instantiates the chart, passes in the data and
		// draws it.
		function drawChart() {
			var npop = 100000;

			// Declare columns
			var data = new google.visualization.DataTable();
			data.addColumn({label: 'Iteration', id: 'iteration', type: 'number'});
			data.addColumn({label: 'Time Since P0', id: 'time', type: 'number'});
			data.addColumn({label: 'Newly Infected', id: 'newinf', type: 'number'});
			data.addColumn({label: 'With Herd Immunity', id: 'totinf', type: 'number'});
			data.addColumn({label: 'Fraction Protected', id: 'fprot', type: 'number'});
			data.addColumn({label: 'Without Herd Immunity', id: 'noherd', type: 'number'});
			var newinf = [1.0];
			var totinf = [1.0];
			var nprot=[npop*cvg*efficacy];
			var noherd = [1.0];
			var noherdtot = [1.0];
			var keepgoing=true;
			var datiter=0;

			while (keepgoing) {
				data.addRow([datiter, datiter*serint/7.0, newinf[newinf.length-1], Math.round(totinf[totinf.length-1]), nprot[nprot.length-1], Math.round(noherdtot[noherdtot.length-1])]);
				newinf.push(repno*(1-nprot[nprot.length-1]/npop)*newinf[newinf.length-1]);
				if (nprot[nprot.length-1]+newinf[newinf.length-1] >= npop) {
					newinf[newinf.length-1]=npop-nprot[nprot.length-1];
				}
				totinf.push(totinf[totinf.length-1]+newinf[newinf.length-1]);
				nprot.push(nprot[nprot.length-1]+newinf[newinf.length-1]);
				noherd.push(repno*noherd[noherd.length-1]);
				noherdtot.push(noherdtot[noherdtot.length-1]+noherd[noherd.length-1]);
				if (noherdtot[noherdtot.length-1]>=(npop-npop*cvg*efficacy)) {
					noherdtot[noherdtot.length-1]=npop-npop*cvg*efficacy;
				}
				if (totinf.length > 6) {
					if (totinf[totinf.length-1] - totinf[totinf.length-6] < 0.7) {
						keepgoing=false;
					}
				}
				datiter++;
			}
			var view = new google.visualization.DataView(data);
			view.setColumns([1, 3, 5]);

			// Set chart options
			var propoptions = {hAxis: {title: 'Time since patient 0 (weeks)',
																viewWindow: {min: 0, max: 100}
																},
				             vAxis: {title: 'Number Infected',
														viewWindow: {min: 0, max: npop}
														},
				             colors: ['#368800','#b8ff88','#183c00']
				             };
			
			var propoptionszoom = {
 									 hAxis: {title: 'Time since patient 0 (weeks)',
																viewWindow: {min: 0, max: datiter*serint/7.0}
																},
				             vAxis: {title: 'Number Infected',
														viewWindow: {min: 0, max: 1.5*totinf[totinf.length-1]}
														},
				             colors: ['#368800','#b8ff88','#183c00'],
				             chartArea: {left: 70, width: "60%", height: "75%" }
				             };

			// Instantiate and draw the proportions chart, passing in some options.
			var infectedchart = new google.visualization.LineChart(document.getElementById("line_infected"));
			infectedchart.draw(view, propoptions);
			var zoominfectedchart = new google.visualization.LineChart(document.getElementById("zoom_line_infected"));
			zoominfectedchart.draw(view, propoptionszoom);



			var data2 = new google.visualization.DataTable();
			data2.addColumn({label: 'Coverage', id: 'cvgvec', type: 'number'});
			data2.addColumn({label: 'With Herd Immunity', id: 'maxinfherd', type: 'number'});
			data2.addColumn({label: 'Without Herd Immunity', id: 'maxinfnoherd', type: 'number'});
			data2.addColumn({type: 'string', role: 'annotation'});
			data2.addColumn({type: 'string', role: 'annotationText'});
			var cvgval;
			for (cvgct=1.0; cvgct < 200; cvgct++) {
				cvgval=cvgct/200.0;
				newinf=[1.0];
				totinf=[1.0];
				nprot=[npop*cvgval*efficacy];
				keepgoing=true;
				while (keepgoing) {
					newinf.push(repno*(1-nprot[nprot.length-1]/npop)*newinf[newinf.length-1]);
					if (nprot[nprot.length-1]+newinf[newinf.length-1] >= npop) {
						newinf[newinf.length-1]=npop-nprot[nprot.length-1];
					}
					totinf.push(totinf[totinf.length-1]+newinf[newinf.length-1]);
					nprot.push(nprot[nprot.length-1]+newinf[newinf.length-1]);
					if (totinf.length > 6) {
						if (totinf[totinf.length-1] - totinf[totinf.length-6] < 1.0) {
							keepgoing=false;
						}
					}
				}
				if (cvgval*100===Math.round(cvg*100.0)) {
					data2.addRow([cvgval*100, Math.round(totinf[totinf.length-1]), Math.round(npop-npop*cvgval*efficacy),'___________________________________','Coverage']);
				}
				else {
					data2.addRow([cvgval*100, Math.round(totinf[totinf.length-1]), Math.round(npop-npop*cvgval*efficacy),null,null]);
				}
			}

			var view2 = new google.visualization.DataView(data2);
			var maxinfchart = new google.visualization.LineChart(document.getElementById('line_numsick'));
			var zoommaxinfchart = new google.visualization.LineChart(document.getElementById('zoom_line_numsick'));
			maxinfchart.draw(view2, {hAxis: {title: 'Coverage (%)',
																viewWindow: {min: 0, max: 100}
																},
				             vAxis: {title: 'Max Num Infected',
														viewWindow: {min: 0, max: npop}
														},
				             colors: ['#368800','#b8ff88','#183c00'],
										 annotations: {
												style: 'line',
												textStyle: {opacity: 0}
												}
				             });
			zoommaxinfchart.draw(view2, {hAxis: {title: 'Coverage (%)',
																viewWindow: {min: 80, max: 100}
																},
				             vAxis: {title: 'Max Num Infected',
														viewWindow: {min: 0, max: 1.1*Math.round(npop-npop*efficacy*0.8)}
														},
				             colors: ['#368800','#b8ff88','#183c00'],
				             chartArea: {left: 70, width: "60%", height: "75%" },
										 annotations: {
												style: 'line',
												textStyle: {opacity: 0}
												}
				             });
		};
	};
</script>

