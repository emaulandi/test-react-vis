import React from 'react';
import {XYPlot, XAxis, YAxis,  VerticalBarSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis';

export default class MultipleStackedBar extends React.Component {
  


	render() {
		


		return (
			
			<XYPlot 
				{...this.props.chartProps} 
				stackBy="y"
        		xType="ordinal">
        		<HorizontalGridLines />
				<VerticalGridLines />
				<XAxis position="start"/>
				<YAxis title= {this.props.yaxis.title}/>
			{
				this.props.data.map((d, idx) => {
					
					return (
						<VerticalBarSeries 
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
