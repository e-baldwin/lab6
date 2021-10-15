const margin = ({top: 50, right: 50, bottom: 40, left: 50})
const width = 650 - margin.left - margin.right,
     height = 500 - margin.top - margin.bottom; 


let newDate;
d3.csv('unemployment.csv').then(data=>{
    console.log('unemployment', data);
    data.forEach(function(d) {
        if( d['date']){
            newDate= d['date'].split('-');
            d['year'] = newDate[0];
            d['month'] = parseInt(newDate[1]);
            d['day'] = parseInt(newDate[2]);
        }     
        d['Wholesale and Retail Trade'] = +d['Wholesale and Retail Trade'];
        d['Manufacturing'] = +d['Manufacturing'];
        d['Leisure and hospitality'] = +d['Leisure and hospitality'];
        d['Business services'] = +d['Business services'];
        d['Construction'] = +d['Contsruction'];
        d['Education and Health'] = +d['Education and Health'];
        d['Government']= +d['Government'];
        d['Finance']= +d['Finance'];
        d['Self-employed']= +d['Self-employed'];
        d['Other']= +d['Other'];
        d['Transportation and Utilities'] = +d['Transportation and Utilities'];
        d['Information'] =+ d['Information'];
        d['Agriculture'] =+ d['Agriculture'];
        d['Mining and Extraction'] =+ d['Mining and Extraction'];
                       
                       
                       
               
                       
    });

    var keys = data.columns.slice(1)

    // color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeSet2);



// input: selector for a chart container e.g., ".chart"
function AreaChart(container){

	// initialization
    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    const xScale = d3
        .scaleLinear()
        
        .domain([d3.min(data, function(d){return d.year;}), d3.max(data, function(d){return d.year;})])
        .range([0,width]);
    const yScale = d3
        .scaleLinear()
        //.domain([])
        .range([height,0]);
    
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format("d"));
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    const yAxis =  d3.axisLeft()
        .scale(yScale);
    svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);
    
    
    

	function update(data){ 
        yScale.domain([0, d3.max(data, function(d){return d.Government;})]);
        var areaChart = svg.append('g')
		// update scales, encodings, axes (use the total count)
        var area = d3.area()
            .x(function(d){return xScale(d.data.year);})
            .y0(function(d) {return yScale(d[0]);})
            .y1(function(d) {return yScale(d[1]);})
        var series = svg.selectAll("g.series")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "series");
        areaChart
            .selectAll("area")
            .data(data)
            .enter()
            .append("path")
              .attr("class", function(d) { return "area " + d.key })
              .style("fill", function(d) { return d3.color("blue"); })
              .attr("d", area)
            .append("title") // TITLE APPENDED HERE
              .text(function(d) { return d.value; });
        series.append("path")
            //.style("fill", function(d){return color(d.listedKeys);})
            //.merge(areas)
            .attr("d", area);
		
	}

	return {
		update // ES6 shorthand for "update": update
	};
}
 function StackedAreaChart(container) {
    var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    var keys = data.columns.slice(1)

    // color 
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeSet2);
  
    
    var stackedData = d3.stack()
      .keys(keys)
      (data)
    //var xScale = d3.scaleLinear()
     //   .domain(d3.extent(data, function(d) { return d.year; }))
     //   .range([ 0, width -70 ]);
    /*const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format("d"));
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);*/
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width -70 ]);
      var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x) .tickFormat(d3.format("d")));

    /*var yScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData[stackedData.length-1], function(d){return d[1];})])
        .range([ height, 0 ]);
    const yAxis =  d3.axisLeft()
        .scale(yScale);
    svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);*/
        var y = d3.scaleLinear()
            .domain([0, d3.max(stackedData[stackedData.length-1], function(d){return d[1];})])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5))
        
    
	// initialization

	function update(data){
        var area = d3.area()
        .x(function(d){return x(d.data.year);})
        .y0(function(d) {return y(d[0]);})
        .y1(function(d) {return y(d[1]);})

    const areas = svg.selectAll(".area")
        .data(stackedData, d => d.key);
    
    var div = d3.select("body").append("div")
        .attr("class", "tooltip-display")
        .style("opacity", 0);
    
    var series = svg.selectAll("g")
        .data(stackedData)
        .enter()
        .append("path")
        
        .attr("d", area)
        .append("svg:title")
        .text(function(d) { return d.value; });
        //.attr("class", "series");
    /*series.append("path")
        .style("fill", function(d){return color(d.listedKeys);})
        .merge(areas)
        .attr("d", area);*/
    areas.enter() 
       .append("path")
        .style("fill", function(d){return color(d.key);})
        .merge(areas)
        .attr("d", area)
        
    .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.85')
            div.transition()
                 .duration(50)
                 .style("opacity", 1);
            let val = d.value;
            div.html(d.key)
               //.style("left", (d3.event.pageX + 10) + "px")
               //.style("top", (d3.event.pageY - 15) + "px");
        })
    .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1')
            div.transition()
                 .duration('50')
                 .style("opacity", 0);
    });
    
    areas.exit().remove();

	
    }
	return {
		update
	}
}





const areaChart1 = StackedAreaChart(".chart");

areaChart1.update(data); 


})