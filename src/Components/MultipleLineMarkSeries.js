import React from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
	VerticalBarSeries,
  LineMarkSeries
} from 'react-vis';

export default class MultipleLineMarkSeries extends React.Component {
  render() {
		
    return (
      <XYPlot
				{...this.props.chartProps}
				{...this.props.chartType}
			>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickLabelAngle={this.props.axis.x.tickAngle}/>
        <YAxis />
			

			{
				this.props.data.map((d, idx) => {
					
					switch(d.chartType) {
					
					case 'VerticalBarSeries':
							return (
								<VerticalBarSeries
								key={idx}
								className={d.className}
								data={d.values}
								/>
							);
							break;	
					default:
						return (
							<LineMarkSeries
							key={idx}
							className={d.className}
							data={d.values}
							style={d.style}
							curve={d.curve}
							/>
						);
					}
							
							
				})
			}

      </XYPlot>
    );
  }
	
}