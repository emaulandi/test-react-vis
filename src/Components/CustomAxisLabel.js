import React from 'react';


function constructTransform(axisProps){
	return {transform: 'rotate(' + axisProps.rotate +'deg) translate('  + axisProps.translateX + 'px,'  + axisProps.translateY + 'px)'};
}
export default class CustomAxisLabel extends React.Component {

	
		
    render() {
				
    	return (
				
				<div>
				
 				<div  className="AxisLabel" 
					style={ constructTransform(this.props.axis.y) }>
					{this.props.axis.y.label}
				</div>
				
				<div  className="AxisLabel" 
					style={ constructTransform(this.props.axis.x) }>
					{this.props.axis.x.label}
				</div>
				
				</div>
    	);
    }
}