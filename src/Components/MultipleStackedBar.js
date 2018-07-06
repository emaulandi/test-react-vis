import React from 'react';
import {XYPlot, XAxis, YAxis,  VerticalBarSeries, HorizontalBarSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis';

export default class MultipleStackedBar extends React.Component {

	render() {

		return (
			
			<XYPlot 
				{...this.props.xyplotAxisType}
				{...this.props.chartProps}
				{...this.props.scaleProps}
				
				>
        <HorizontalGridLines />
				<VerticalGridLines />

			  <XAxis tickLabelAngle={-30} />
				<YAxis/>
			{
				this.props.data.map((d, idx) => {
					
					if (this.props.xyplotAxisType.stackBy ==="y") {
						return(
							<VerticalBarSeries 
							key={idx}
							data={d.values}
							color={d.color}
							/>
						);
					}
					else {
						return(
							<HorizontalBarSeries 
							key={idx}
							data={d.values}
							color={d.color}
							/>
						);
					}
						
					
				})
			}
			</XYPlot>

		);
	}


}
