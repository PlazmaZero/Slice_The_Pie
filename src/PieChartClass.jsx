import React, { useRef, useEffect, useState } from 'react';


class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.d3Container = React.createRef();
    this.dimensions = ({
      width: props.width ? props.width : 200,
      height: props.height ? props.height : 200,
      padding: props.padding ? props.padding : 50
    });
  }

  componentDidMount() {
    this.initChart();
    this.updateChart();
  }

  componentDidUpdate(prevProps) {
    //If nothing changed or we dont have the container we can skip the update
    if (!this.props.data || prevProps.data == this.props.data || !this.d3Container.current)
      return;
    this.updateChart();
  }

  initChart() {
    this.pie = d3.pie()
      .sort(null)
      .value(d => d.value);

    this.arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(this.dimensions.width, this.dimensions.height) / 2 - 1);

    this.chartSvg = d3.select(this.d3Container.current)
      .append('g')
      .attr('class', 'chart-content')
      .attr('transform', `translate(
      ${this.dimensions.width / 2 + this.dimensions.padding},
      ${this.dimensions.height / 2 + this.dimensions.padding})`);
  }

  updateChart() {
    const data = [...this.props.data];
    const valueSum = d3.sum(data, d => d.value);
    if (100 - valueSum > 0) {
      data.push({
        name: '$empty',
        value: (100 - valueSum),
        color: '#7f8187'
      });
    }

    const arcs = this.pie(data);

    this.chartSvg
      .selectAll('path')
      .data(arcs)
      .join('path')
      .on('mouseover', (event, d) => this.onSliceOver(event, d))
      .on('mouseout', (event, d) => this.onSliceOut(event, d))
      .transition().duration(500)
      .attr('fill', d => d.data.color)
      .attr('transform', d => d.data.name == '$empty' ? 'scale(0.95)' : '')
      .attr('d', this.arc);
  }

  onSliceOver(event, d) {
    if (d.data.name == '$empty')
      return;

    let pointer = d3.pointer(event);

    d3.select(event.currentTarget)
      .transition().duration(200)
      .attr('transform', 'scale(1.1)')

    this.chartSvg.select('#chart-tooltip').remove();
    this.chartSvg.append('text')
      .attr('x', pointer[0])
      .attr('y', pointer[1] - 20)
      .attr('fill', this.getColorValue(d.data.color) > 150 ? '#000000' : '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('id', 'chart-tooltip')
      .text(`${d.data.name} ${d.data.value.toFixed(2)}%`);
		console.log(d.data.value)
  }

  onSliceOut(event, d) {
    if (d.data.name == '$empty')
      return;

    d3.select(event.currentTarget)
      .transition().duration(200)
      .attr('transform', 'scale(1)')

    this.chartSvg.select('#chart-tooltip').remove();
  }

  getColorValue(color) {
    let sumVal = 0;
    for (let i = 1; i < color.length; i += 2) {
      let val = parseInt(`0x${color[i]}${color[i + 1]}`);
      sumVal += val;
    }
    sumVal /= 3;
    return sumVal;
  }

  render() {
    console.warn('RENDER');
    return (
      <svg
        className="pie-chart"
        width={this.dimensions.width + 2 * this.dimensions.padding}
        height={this.dimensions.height + 2 * this.dimensions.padding}
        ref={this.d3Container}
      >
      </svg>
    );
  }
}

export default PieChart;