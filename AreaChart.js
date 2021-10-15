export default function AreaChart() {

    //function AreaChart(container){
        const xScale = d3
          .scaleLinear()
          
          .domain([d3.min(data, function(d){return d.year;}), d3.max(data, function(d){return d.year;})])
          .range([0,width]);
        const yScale = d3
          .scaleLinear()
          //.domain([])
          .range([height,0]);
    
    // initialization
    
    function update(data){ 
    
        y.domain([0,d3.max(data)]);
        svg.select(".yAxis").transition().duration(1000).call(yAxis);
        data.shift();
        // update scales, encodings, axes (use the total count)
        
    }
    
    return {
        update // ES6 shorthand for "update": update
        };
    //}
    }