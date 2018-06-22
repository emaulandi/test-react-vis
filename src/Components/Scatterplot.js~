import React from 'react';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis';


export default class Scatterplot extends React.Component {

        render() {
        	return (
		        <XYPlot 
		        	{...this.props.colorProps} 
		        	{...this.props.chartProps}
		        	{...this.props.scaleProps}
		        	>
				
					<VerticalGridLines />
					<HorizontalGridLines />
					<XAxis tickLabelAngle={this.props.tickAngle} />
					<YAxis tickFormat={v => `${v}` + this.props.suffixY} />
				
				  	<MarkSeries
						sizeRange={this.props.sizeRange}
						data={
						  this.props.data
					}/>
				</XYPlot>
			);
        }
}

