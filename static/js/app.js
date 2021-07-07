//Step1
//Use the D3 library to read in samples.json.

function Plot(id) {
    
    // get samples data from json file
    d3.json("data/samples.json").then((sampleData)=> {
        console.log(sampleData)

        var wfreq = sampleData.metadata.map(d => d.wfreq)
        console.log(`wFreq: ${wfreq}`)

        // filter sample values by id 
        var samples = sampleData.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // get top 10 sample values to plot and reverse 
        var sampleValues = samples.sample_values.slice(0, 10).reverse();

        // get top 10 otu ids for the plot
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get otu IDs in format for plot
        var idOtu = idValues.map(d => "OTU " + d)

        console.log(`OTU IDs: ${idOtu}`)

        // get top 10 labels 
        var labels = samples.otu_labels.slice(0, 10);

        console.log(`Sample values: ${sampleValues}`)
        console.log(`Id values: ${idValues}`)
//Step2
//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.
        
        // create trace variable 
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type:"bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable 
        var layout = {
            title: "Top 10 OTU Microbial Species",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };
        // create bar plot
        Plotly.newPlot("bar", data, layout);
        
//Step3
//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.

        // create trace for bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        // set layout for bubble plot
        var layout = {
            xaxis:{title: "OTU ID"},
            title: "Bacteria Cultures per Sample",
            height: 600,
            width: 1300
        };

        // create data variable 
        var data1 = [trace1];

        // create bubble plot
        Plotly.newPlot("bubble", data1, layout); 

    });    
}

//Step4
//Display the sample metadata, i.e., an individual's demographic information.
//Step5
//Display each key-value pair from the metadata JSON object somewhere on the page.

// create the function to get the sample info 
function Info(id) {
     //read json file to get data
    d3.json("data/samples.json").then((data)=> {
        
        // get metadata info for demographic panel
        var metadata = data.metadata;

       console.log(metadata)

        // filter data by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put sample data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty demographic panel each time 
        demographicInfo.html("");

        // get demographic data for id and add info to panel
        Object.entries(result).forEach((key) => {   
               demographicInfo.append("h5").text(key[0].toLowerCase() + ": " + key[1] + "\n");    
      });
    });
}

//Step6
//Update all of the plots any time that a new sample is selected.

// create function for CHANGE in ID selection
function optionChanged(id) {
    Plot(id);
    Info(id);
}
// create function for ID selection
function selection() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read data 
    d3.json("data/samples.json").then((data)=> {
      //  console.log(data)

        // get ID for dropdown 
        data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
        });

        // call functions to display data and plots
        Plot(data.names[0]);
        Info(data.names[0]);
    });
}

selection();
