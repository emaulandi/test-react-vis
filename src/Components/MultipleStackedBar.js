import React from 'react';
import {XYPlot, XAxis, YAxis,  VerticalBarSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis';

export default class MultipleStackedBar extends React.Component {

	render() {

		return (
			
			<XYPlot 
				{...this.props.chartProps}
				{...this.props.scaleProps}
				stackBy="y"
        		xType="ordinal">
			
        <HorizontalGridLines />
				<VerticalGridLines />

			  <XAxis tickLabelAngle={-30} />
				<YAxis/>
			{
				this.props.data.map((d, idx) => {
					
					return (
						<VerticalBarSeries 
						key={idx}
						data={d.values}
						color={d.color}
						/>
					);
				})
			}
			</XYPlot>

		);
	}


}
