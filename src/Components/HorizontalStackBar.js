import React from 'react';
import {XYPlot, XAxis, YAxis,  BarSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis';

export default class HorizontalStackBar extends React.Component {

	render() {

		return (
			
			<XYPlot 
				{...this.props.chartProps}
				{...this.props.scaleProps}
				stackBy="y"
        yType="ordinal">
			
        <HorizontalGridLines />
				<VerticalGridLines />

			  <XAxis/>
				<YAxis/>
			{
				this.props.data.map((d, idx) => {
					
					return (
						<BarSeries 
						key={idx}
						data={d.values}
						/>
					);
				})
			}
			</XYPlot>

		);
	}


}