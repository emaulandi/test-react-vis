import React from 'react';
import {csv} from 'd3-fetch';

import ScatterplotHint from './../Components/ScatterplotHint';
import StatsHighlights from './../Components/StatsHighlights';

import Tourisme from './../data/INSEE_departements.csv';

import {colorProps, large_chartprops} from './../constants';

import {
  cleanDataTourisme,
  generateItemsScatterplotColor,
  colorRegion,
  sumPSN
} from './../utils';


export default class ScatterplotTourisme extends React.Component {

	
	constructor(props) {
        super(props)
        this.state = {
            dataTourisme: [],
            sum: {total: 0, psn:0}
        };
    }
	
	componentDidMount() {

		csv(Tourisme)
			.then(data => {
				
				const cDataTourisme = cleanDataTourisme(data);
				//console.log(cDataTourisme);
				
				{/*
				const updatedDataTourisme = generateItemsScatterplot(cDataTourisme, "Hotel_tourisme_nb_etablissement", "Hotel_tourisme_perc_residents_etrangers", "Hotel_tourisme_total_nuitees_milliers");	
				*/}
				
				const updatedDataTourisme = generateItemsScatterplotColor(
					cDataTourisme, 
					"nuitees_population", 
					"Hotel_tourisme_perc_residents_etrangers", 
					"Hotel_tourisme_total_nuitees_milliers",
					colorRegion, 
					"REGION"	
				);
				
				console.log(updatedDataTourisme);
				
				
				var sum = sumPSN(cDataTourisme, "CODEGEO", "Hotel_tourisme_total_nuitees_milliers");
				console.log(sum);
				

				this.setState({
					dataTourisme: updatedDataTourisme,
					sum: sum
				});
		});
	}
	
	render() {
		return (
			<div>
			
			<StatsHighlights data={ this.state.sum } />
			
			<ScatterplotHint 
				data={ this.state.dataTourisme } 
				chartProps={  large_chartprops }
				scaleProps= { {yDomain: [0, 70] } }
				colorProps={colorProps}
				tickAngle={-30} 
				suffixY = {'%'}
				sizeRange={[2, 20]}/>
			</div>
		);
	}
	
}
