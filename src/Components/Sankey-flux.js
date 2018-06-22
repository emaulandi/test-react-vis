import React from 'react';
import SankeyTitle from './../Components/SankeyTitle';

import FluxDepuisPSN from './../data/fluxmigratoire_depuisPSN.json';

import {sankey_chartprops} from '../constants';

export default class SankeyFlux extends React.Component {

	 

	render() {
	
		return (
			<SankeyTitle data={FluxDepuisPSN} chartprops={sankey_chartprops} title={{main:"Flux migratoires depuis la vallée de seine", sub: "", p:""}}/>
		);
	}
	
}
