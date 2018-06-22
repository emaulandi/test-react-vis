import React from 'react';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries, Hint} from 'react-vis';


export default class ScatterplotHint extends React.Component {

	state = {
    	activeNode: null
	}

	_renderHint() {
	

		const {activeNode} = this.state;

		if (activeNode === null) {
		  return null;
		}
		
		const hintValue = {
			Departement: activeNode.dep,
			Nuites: activeNode.size
		}

		return (
		  <Hint x={activeNode.x} y={activeNode.y} value={hintValue} />
		);
	}

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
					data={ this.props.data }
					onValueMouseOver={(d, {event}) => {
						this.setState({ activeNode: d });
					}}
					onValueMouseOut={() => this.setState({ activeNode: null }) }
				/>
			
				{ this._renderHint() }
				
			</XYPlot>
		);
    }
}

