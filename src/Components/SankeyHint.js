import React from 'react';
import {Sankey, Hint} from 'react-vis';


const BLURRED_LINK_OPACITY = 0.3;
const FOCUSED_LINK_OPACITY = 0.6;

export default class SankeyHint extends React.Component {

	state = {
    	activeLink: null
	}

	 _renderHint() {
		const {activeLink} = this.state;

		if (activeLink === null) {
		  return null;
		}

		// calculate center x,y position of link for positioning of hint
		const x = activeLink.source.x1 + ((activeLink.target.x0 - activeLink.source.x1) / 2);
		const y = activeLink.y0 - ((activeLink.y0 - activeLink.y1) / 2);
		const hintValue = this.props.hintValueFunction(activeLink);
		 
		if (this.props.hintRenderFunction == null){
			return (
		  <Hint x={x} y={y} value={hintValue} />
		);
		}
		else {
			return this.props.hintRenderFunction(hintValue, activeLink, x, y);
		}
	}

    render() {
    
    	const {activeLink} = this.state;
    	
    	return (
    	
    		<div>
				
			    <Sankey 
					
					width={this.props.chartprops.width}
					height={this.props.chartprops.height}
					margin={this.props.chartprops.margin}
				
					nodes={this.props.data.nodes}
					links={this.props.data.links.map((d, i) => ({
						...d,
						opacity: activeLink && i === activeLink.index ? FOCUSED_LINK_OPACITY : BLURRED_LINK_OPACITY
					}))}
					nodePadding={5}

					style={this.props.style}
					// do not use voronoi in combination with link mouse over

					hasVoronoi={false}
					onLinkMouseOver={node => this.setState({activeLink: node})}
					onLinkMouseOut={() => this.setState({activeLink: null})}
					>
					{ this._renderHint() }
				</Sankey>
			
			</div>
		);
    }
}

