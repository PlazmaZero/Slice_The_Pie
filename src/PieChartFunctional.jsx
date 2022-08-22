import React, { useRef, useEffect } from 'react';


function PieChartFunctional (props) {

  console.log("calling piechart");
  console.log("props",props.data);
  
    // gets connected to svg drawn by React by variable name and its ref attribute
    let d3Container = React.createRef(null);
    
    let dimensions = ({
      width: props.width ? props.width : 200,
      height: props.height ? props.height : 200,
      padding: props.padding ? props.padding : 25
    });
 
    const data = [...props.data];
    
    let pie = d3.pie()
                .sort(null)
                .value(d => d.value);

    let arc = d3.arc()
                .innerRadius(0)
                .outerRadius(Math.min(dimensions.width, dimensions.height) / 2 - 1);
  
    


  // init code - only run on startup
  useEffect(function() {

      if (!(d3Container.current && data)) 
        return;
      
    let chartSvg = d3.select(d3Container.current);

    chartSvg.append('g')
      .attr('id', "pieChart-"+props.name)
      .attr('class', 'chart-content')
      .attr('transform', `translate(
      ${dimensions.width/ 2 + dimensions.padding},
      ${dimensions.height/2 + dimensions.padding})`);
    },[]);

  // update function
  useEffect(function() {

    console.log("update effect");
    
    if (!(d3Container.current && data)) 
        return;
    
    const valueSum = d3.sum(data, d => d.value);
    if (100 - valueSum > 0) {
      data.push({
        name: '$empty',
        value: (100 - valueSum),
        color: '#7f8187'
      });
    }

    const arcs = pie(data);

    const g = d3.select("#pieChart-"+props.name);
    g.selectAll('path')
        .data(arcs)
        .join('path')
        .on('mouseover', (event, d) => onSliceOver(event, d))
        .on('mouseout', (event, d) => onSliceOut(event, d))
        .transition().duration(500)
        .attr('fill', d => d.data.color)
        .attr('transform', d => d.data.name == '$empty' ? 'scale(0.95)' : '')
        .attr('d', arc);
    }, [props.data, d3Container.current ]
  ); // useEffect update function

  
  function onSliceOver(event, d) {
    if (d.data.name == '$empty')
      return;

    let pointer = d3.pointer(event);

    d3.select(event.currentTarget)
      .transition().duration(200)
      .attr('transform', 'scale(1.1)')

    const g = d3.select("#pieChart-"+props.name);
    g.select('#chart-tooltip').remove();
    g.append('text')
        .attr('x', pointer[0])
        .attr('y', pointer[1] - 20)
        .attr('fill', 'fill', getColorValue(d.data.color) > 150 ? '#000000' : '#ffffff')
        .attr('text-anchor', 'middle')
        .attr('id', 'chart-tooltip')
        .text(`${d.data.name} ${d.data.value.toFixed(2)}%`);
  }

  function onSliceOut(event, d) {
    if (d.data.name == '$empty')
      return;

    d3.select(event.currentTarget)
      .transition().duration(200)
      .attr('transform', 'scale(1)')

     const g = d3.select("#pieChart");
     g.select('#chart-tooltip').remove();
  }

  function getColorValue(color) {
    let sumVal = 0;
    for (let i = 1; i < color.length; i+=2) {
      let val = parseInt(`0x${color[i]}${color[i+1]}`);
      sumVal += val;
    }
    sumVal /= 3;
    return sumVal;
  }

  return (
        <svg
            className="pie-chart"
            width={dimensions.width + 2*dimensions.padding}
            height={dimensions.height + 2*dimensions.padding}
            ref={d3Container}
        />
    );
}


export default PieChartFunctional;