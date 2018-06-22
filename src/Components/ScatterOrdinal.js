import React from 'react';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis';



export default class ScatterOrdinal extends React.Component {


        render() {
        	return (
		        <XYPlot
					
					{...this.props.chartProps}
					{...this.props.chartType}
					{...this.props.scaleProps}
	        	>
				
					<VerticalGridLines />
					<HorizontalGridLines />
					<XAxis tickLabelAngle={-30} />
					<YAxis />
				
				  	<MarkSeries
						className="mark-series-example"
						sizeRange={[3, 25]}
						data={this.props.data}

					/>
				</XYPlot>
			);
        }
}

