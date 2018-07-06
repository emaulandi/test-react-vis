import React from 'react';
import {format} from 'd3-format';

const perc = format(".2p");
const number = format(",.0f")	;

export default class StatsHighlights extends React.Component {


	render() {
		return (

			<div className="Chart-stats">
				<p> La <mark className="markPSN"> Vallée de Seine</mark> représente { number(this.props.data.psn)} {this.props.item}, 
				soit { perc(this.props.data.psn / this.props.data.total)}  de la France métropolitaine </p>
			</div>
		);
	}


}
