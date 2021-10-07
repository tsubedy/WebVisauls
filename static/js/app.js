// Reading json data file using D3 
d3.json("data/samples.json").then((sampleData) => {

	// printing the dataset in the console 
  	console.log(sampleData);

  	var data = sampleData;

	// sample ID in the dropdown menu
	var names = data.names;
	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
})

  
// Initializing plots with default values

function init() {
	// Choosing a datapoint sample ID = 940 (the first data point in the database) as default
	defaultDataPoint = data.samples.filter(sample => sample.id === "940")[0];
	console.log(defaultDataPoint);

	// Selecting Values, IDs and Labels for the default sample ID
	sampleValuesDefault = defaultDataPoint.sample_values;
	sampleIdsDefault = defaultDataPoint.otu_ids;
	sampleLabelsDefault = defaultDataPoint.otu_labels;

	// Selecting top 10 OTUs for the sample ID with their values, ids and labels
	sampleValuesTopTen = sampleValuesDefault.slice(0, 10).reverse();
	otuIdsTopTen = sampleIdsDefault.slice(0, 10).reverse();
	otuLabelsTopTen = sampleLabelsDefault.slice(0, 10).reverse();

	console.log(sampleValuesTopTen);
	console.log(otuIdsTopTen);
	console.log(otuLabelsTopTen);

	// BAR CHART
	// Adding trace for the default Data
	var trace1 = {
		x: sampleValuesTopTen,
		y: otuIdsTopTen.map(otuId => `OTU ${otuId}`),
		text: otuLabelsTopTen,
		type: "bar", 
		marker: {
			color: "rgb(0, 128, 256)", 
		},
		orientation: "h"
	};

	// data for the bar chart
	var barData = [trace1];

	var barlayout = {
		title: `<b> Top 10 OTUs for selected Sample <b>`,
		xaxis: { title: "Sample Values"},
		yaxis: { title: "OTU IDs"},
		autosize: false,
		width: 650,
		height: 600
	}

	// Rendering the plot to the div tag with id "bar"
	Plotly.newPlot("bar", barData, barlayout);

	// BUBBLE CHART
	var trace2 = {
		x: sampleIdsDefault,
		y: sampleValuesDefault,
		text: sampleLabelsDefault,
		mode: 'markers',
		marker: {
			color: sampleIdsDefault,
			size: sampleValuesDefault
		}
	};
	// Data for the bubble chart
	var bubbleData = [trace2];
	
	var bubbleLayout = {
		title: '<b>Bubble Chart: sample values by OTU Ids for selected sample<b>',
		xaxis: { title: "OTU IDs"},
		yaxis: { title: "Sample Values"}, 
		showlegend: false,
	};
	
	Plotly.newPlot('bubble', bubbleData, bubbleLayout);

	// DEMOGRAPHICS for the default sample ID = 940
	demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
	console.log(demoDefault);

	// Displaying key-value pair from the metadata JSON object
	Object.entries(demoDefault).forEach(
		([key, value]) => d3.select("#sample-metadata")
				.append("p").text(`${key.toUpperCase()}: ${value}`));

	// GAUGE CHART
	// Geting the washing frequency value for the default sample ID

	var washFreqDefault = demoDefault.wfreq;

	var gaugeData = [
		{
		domain: { x: [0, 1], y: [0, 1] },
		value: washFreqDefault,
		title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
		type: "indicator",
		mode: "gauge+number",
		gauge: {
			axis: { range: [0, 9] },
			steps: [
				{ range: [0, 1], color: 'rgb(161, 221, 156)' },
				{ range: [1, 2], color: 'rgb(161, 211, 156)' },
				{ range: [2, 3], color: 'rgb(161, 201, 156)' },
				{ range: [3, 4], color: 'rgb(161, 191, 156)' },
				{ range: [4, 5], color: 'rgb(161, 181, 156)' },
				{ range: [5, 6], color: 'rgb(161, 171, 156)' },
				{ range: [6, 7], color: 'rgb(161, 161, 156)' },
				{ range: [7, 8], color: 'rgb(161, 151, 156))' },
				{ range: [8, 9], color: 'rgb(161, 141, 156)' },
			],
				
			threshold: {
				line: { color: "red", width: 4 },
				thickness: 0.75,
				value: 9}
		}
		}
	];
	
	var gaugeLayout = { width: 550, height: 500, margin: { t: 0, b: 0 } };
	
	Plotly.newPlot('gauge', gaugeData, gaugeLayout);
	}

init();
 
	// Updating bargraph on changing datapoint 
	d3.selectAll("#selDataset").on("change", updatePlot);

	// Creating horizontal bar chart with a dropdown menu displaying top 10 OTUs for selected sample.

	function updatePlot() {

		// Using D3 to select the dropdown menu
		var inputElement = d3.select("#selDataset");

		// Assigning the input value to a variable
		var inputValue = inputElement.property("value");
		console.log(inputValue);

		// Filtering the datapoint on input value (sample ID)
		dataset = data.samples.filter(sample => sample.id === inputValue)[0];
		console.log(dataset);

		// Selecting values, ids and labels of the selected sample ID 
			sampleValues = dataset.sample_values;
			sampleIds = dataset.otu_ids;
			sampleLabels = dataset.otu_labels;

		// Select the top 10 OTUs for selected sample ID with their values, ids and labels
		top10Values = sampleValues.slice(0, 10).reverse();
		top10Ids = sampleIds.slice(0, 10).reverse();
		top10Labels = sampleLabels.slice(0, 10).reverse();

		// BAR CHART
		Plotly.restyle("bar", "x", [top10Values]);
		Plotly.restyle("bar", "y", [top10Ids.map(outId => `OTU ${outId}`)]);
		Plotly.restyle("bar", "text", [top10Labels]);

		// BUBBLE CHART
		Plotly.restyle('bubble', "x", [sampleIds]);
		Plotly.restyle('bubble', "y", [sampleValues]);
		Plotly.restyle('bubble', "text", [sampleLabels]);
		Plotly.restyle('bubble', "marker.color", [sampleIds]);
		Plotly.restyle('bubble', "marker.size", [sampleValues]);

		// DEMOGRAPHIC INFO
		metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];

		// Clearing out the current contents if exists in the panel
		d3.select("#sample-metadata").html("");

		// Display each key-value pair from the metadata JSON object
		Object.entries(metainfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

		// GAUGE CHART:
		var washFreq = metainfo.wfreq;

    	Plotly.restyle('gauge', "value", washFreq);
	}
});

