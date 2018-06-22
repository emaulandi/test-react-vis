import React from 'react';

export default class ChartTitle extends React.Component {


    render() {
    	return (
    		<div className="Chart-header">
				<h1> {this.props.title.main} </h1> 
				<h3> {this.props.title.sub} </h3>
				<p> <i> {this.props.title.p} </i></p>
			</div>
    	);
    }
}
