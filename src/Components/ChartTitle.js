import React from 'react';

export default class ChartTitle extends React.Component {

    render() {
    	return (
    		<div className="Chart-header">
				
				{typeof this.props.title.main !== undefined &&
					<h1> {this.props.title.main} </h1> 
				}
				{typeof this.props.title.h2 !== undefined &&
					<h2> {this.props.title.h2} </h2> 
				}
				{typeof this.props.title.p !== undefined &&
					<p> <i> {this.props.title.p} </i></p> 
				}			
			</div>
    	);
    }
}
