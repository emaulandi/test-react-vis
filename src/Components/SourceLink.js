import React from 'react';

export default class SourceLink extends React.Component {

    render() {
    	return (
    		<div className="Chart-header">
		
					<p><i> <a href={this.props.data.link} >{this.props.data.label}</a> </i> </p> 

			</div>
    	);
    }
}