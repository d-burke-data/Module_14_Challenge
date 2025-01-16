// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data["metadata"];

    // Filter the metadata for the object with the desired sample number
    let found = metadata.filter(data => { return data.id == sample; });

    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    htmlText = "";
    found.forEach(item => {
      let keys = Object.keys(item);
      let values = Object.values(item);
      for (i = 0; i < keys.length; i++) {
        // sampleMetadata.append("html").text("<b>" + keys[i].toUpperCase() + ":</b>" + values[i]); 
        htmlText += "<b>" + keys[i].toUpperCase() + ":</b> " + values[i] + "<br>";
      }
      sampleMetadata.html(htmlText);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data["samples"];

    // Filter the samples for the object with the desired sample number
    let found = samples.filter(data => { return data.id == sample; })[0];

    // Get the otu_ids, otu_labels, and sample_values
    let ids = found["otu_ids"];
    let labels = found["otu_labels"];
    let values = found["sample_values"];

    otus = [];
    
    for (i = 0; i < values.length; i++) {
      let newData = { 
        id: ids[i],
        id_string: `OTU ${ids[i]}  `,
        value: values[i],
        label: labels[i]
      };
      otus.push(newData);
    };

    // Build a Bubble Chart
    let trace = {
      x: otus.map(item => item.id),
      y: otus.map(item => item.value),
      mode: "markers",
      marker: {
        size: otus.map(item => item.value),
        color: otus.map(item => item.id),
      },
      type: "bubble",
      // text: otus.map(item => buildHoverText(item.label)),
      name: "OTU Labels",
      hovertemplate: otus.map(item => formatHoverText(item.label)),
      sort: false
    };

    let layout = {
      title: { text: "<b>Bacteria Cultures Per Sample<br>(Subject #" + sample + ")</b>" },
      xaxis: { title: { text: "<b>OTU ID</b>" } },
      yaxis: { title: { text: "<b>Number of Bacteria</b>" } },
      width: 1200,
      height: 600      
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [trace], layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    otus.sort((itemA, itemB) => itemB.value - itemA.value);
    
    let sliced = otus.slice(0, 10);
    sliced.reverse();

    trace = {
      x: sliced.map(item => item.value),
      y: sliced.map(item => item.id_string),
      orientation: "h",
      type: "bar",
      name: "OTU Labels",
      hovertemplate: sliced.map(item => formatHoverText(item.label)),
      showlegend: false
    };

    layout = {
      title: { text: "<b>Top 10 Bacteria Cultures Found<br>(Subject #" +  sample + ")</b>" },
      xaxis: { title: { text: "<b>Number of Bacteria</b>" } },
      yaxis: { title: { text: "<b>OTU ID</b>" }, automargin: true },
      width: 800,
      height: 600
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace], layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data["names"];

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdown.append("option").text(name).attr("value", name);
    });

    // Get the first sample from the list
    let first = (dropdown.select("option").text());

    // Build charts and metadata panel with the first sample
    optionChanged(first);

    dropdown.on("change", () => {
      let newSample = dropdown.property("value");
      optionChanged(newSample);
    });
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Function to format hover text
function formatHoverText(text) {
  return text.replaceAll(";", "<br>");
}

// Initialize the dashboard
init();