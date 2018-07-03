import React from 'react';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries, Hint} from 'react-vis';
import CustomAxisLabel from './../Components/CustomAxisLabel';

export default class ScatterplotHint extends React.Component {

	state = {
    	activeNode: null
	}

	_renderHint() {
	

		const {activeNode} = this.state;

		if (activeNode === null) {
		  return null;
		}
		
		const hintValue = this.props.hintValueFunction(activeNode);

		return (
		  <Hint className='Hint' x={activeNode.x} y={activeNode.y} value={hintValue} />
		);
	}

    render() {
    	return (
				<div>
	        <XYPlot 
	        	{...this.props.colorProps} 
	        	{...this.props.chartProps}
						{...this.props.chartType}
	        	{...this.props.scaleProps}
	        	>
			
				<VerticalGridLines />
				<HorizontalGridLines />
				<XAxis tickLabelAngle={this.props.tickAngle} />
				{ typeof this.props.axisProps !== 'undefined' &&
					<YAxis tickFormat={v => v + this.props.suffixY} />
				}
				{ typeof this.props.axisProps === 'undefined' &&
					<YAxis />
				}
			
			  <MarkSeries
					sizeRange={this.props.sizeRange}
					data={ this.props.data }
					onValueMouseOver={(d, {event}) => {
						this.setState({ activeNode: d });
					}}
					onValueMouseOut={() => this.setState({ activeNode: null }) }
				/>
			
				{ this._renderHint() }

				{ this.props.axisProps !== null &&
						<CustomAxisLabel axis={this.props.axisProps}/>
				}
					
			</XYPlot>
			

		</div>
		);
    }
}

