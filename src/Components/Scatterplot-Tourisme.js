import React from 'react';
import {csv} from 'd3-fetch';
import {format} from 'd3-format';

import {ContinuousSizeLegend, DiscreteColorLegend} from 'react-vis';

import ScatterplotHint from './../Components/ScatterplotHint';
import StatsHighlights from './../Components/StatsHighlights';
import ChartTitle from './../Components/ChartTitle';
import SourceLink from './../Components/SourceLink';

import Tourisme from './../data/INSEE_departements.csv';

import {colorProps, custom_chartprops} from './../constants';

import {
  cleanDataTourisme,
  generateItemsScatterplotColor,
  colorRegion,
  sumPSN
} from './../utils';

const number = format(",.0f")	;

const title = {
	main: "Fréquentation des hôtels de tourisme par département"
}

const sourceLink = {
	label: 'Source : INSEE - 2017',
	link: 'https://www.insee.fr/fr/statistiques/2012672#tableau-TCRD_020_tab1_departements'
};

const axis = {
	x:{
		label: 'Ratio milliers de nuits pour 1 000 habitants',
		rotate:0,
		translateX: -30,
		translateY: -custom_chartprops.margin.bottom + 15
	},
	y:{
		label: 'Pourcentage de visiteurs étrangers',
		rotate:-90,
		translateX: custom_chartprops.height/2,
		translateY: -190,
		suffix: '%'
	}
}

function HintValue(activeNode) {
	return {
			Departement: activeNode.dep,
			// Because we squared the value to display the size according to the surface, not the radius, we ave to get the right value back to display
			Nuites: number(Math.pow(activeNode.size,2)) + ' milliers',
			'Visites étrangères': activeNode.y + ' %'
		}
}

export default class ScatterplotTourisme extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
            dataTourisme: [],
            sum: {
							total: 0,
							psn:0
						},
						item: "milliers de nuits"
        };
    }
	
	componentDidMount() {

		csv(Tourisme)
			.then(data => {
				
				// clean and compute numbers of nights for 1000 inhabitants
				const cDataTourisme = cleanDataTourisme(data);
				
				const updatedDataTourisme = generateItemsScatterplotColor(
					cDataTourisme, 
					"nuitees_population_relatif", 
					"Hotel_tourisme_perc_residents_etrangers", 
					"Hotel_tourisme_total_nuitees_milliers",
					colorRegion, 
					"REGION"	
				);

				var sum = sumPSN(cDataTourisme, "CODEGEO", "Hotel_tourisme_total_nuitees_milliers");
			
				this.setState({
					dataTourisme: updatedDataTourisme,
					sum: sum
				});
		});
	}
	
	render() {
		return (
			<div>

				<ChartTitle title={title}/>

				<StatsHighlights data={ this.state.sum } item={this.state.item} />

				<ScatterplotHint 
					data={ this.state.dataTourisme } 
					chartProps={  custom_chartprops }
					scaleProps= { {yDomain: [5, 70] } }
					colorProps={colorProps}
					axisProps={axis}

					sizeRange={[2, 20]}
					hintValueFunction={HintValue}/>
			
			<DiscreteColorLegend
				orientation="horizontal"
				width={custom_chartprops.width}
				items={[
					{title: 'Département de la vallée de Seine', color: colorProps.colorRange[1]},
					{title: 'Autres département', color: colorProps.colorRange[0]}
				]}
			/>
			
			<ContinuousSizeLegend
      	width={custom_chartprops.width}
				circlesTotal={8}
        startTitle="10"
				endSize={40}
				endTitle="35,000"
			/>
			
			<ChartTitle title={{p: "milliers de nuits"}}/>
			
			<SourceLink data={sourceLink}/>

			</div>
		);
	}
	
}
