import React from 'react';
import {csv} from 'd3-fetch';
import {DiscreteColorLegend} from 'react-vis';

import MultipleStackedBar from './../Components/MultipleStackedBar';
import ChartTitle from './../Components/ChartTitle';
import SourceLink from './../Components/SourceLink';
import StatsHighlights from './../Components/StatsHighlights';

import Recherche from './../data/INSEE_recherchedev_effectif_depenses.csv';

import {
	marginleft_chartprops,
	depenseRecherche,
	standardColor
} from '../constants';

import {
	cleanDataRecherche,
	generateSeries,
	mergeRegionPSN,
	arraySum,
	sumData
} from './../utils';

const title = {
		main: "Dépenses de recherche et développement par région en 2014",
		p: "en milliers d'euros"
}

const sourceLink = {
	label: 'Source : INSEE - 2014',
	link: 'https://www.insee.fr/fr/statistiques/2012678#tableau-TCR_058_tab1_regions2016'
};

const xyplotAxisType = {
	stackBy: 'x',
  yType: 'ordinal'
};

export default class MultStackBarRecherche extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
            data: [],
						sum: {
							total: 0,
							psn:0
						}
		}
  
	}
	
	componentDidMount() {

		csv(Recherche)
				.then(data => {
					const cDataRecherche = cleanDataRecherche(data);
					//console.log(cDataRecherche);

					const dataPSNmerge = mergeRegionPSN(cDataRecherche,depenseRecherche);
					//console.log(dataPSNmerge);
			
					dataPSNmerge.sort(function(a, b) {
						return +a[depenseRecherche[1]] - +b[depenseRecherche[1]];
					});
					
					const updatedDataRecherche = generateSeries(
																			dataPSNmerge,
																			'y',
																			'Region',
																			depenseRecherche,
																			standardColor)	
					//console.log(updatedDataRecherche);
					
					this.setState({
						data: updatedDataRecherche,
						sum: {
							psn: arraySum(dataPSNmerge.filter(d => {return d.RegionID === "PSN"}),depenseRecherche[1]),
							total: sumData(dataPSNmerge,depenseRecherche[1])
						}
					});
					
					
			});
	}

	render() {

		return (
			<div>
				<ChartTitle title={title}/>
				<StatsHighlights data={ this.state.sum } item={"milliers d'euros dépensés dans la recherche pour les établissements privés"} />
				<ChartTitle title={{p:"La zone Vallée de Seine concerne les régions Ile de France et Normandie"}}/>

				<MultipleStackedBar
					chartProps={ marginleft_chartprops }
					xyplotAxisType = {xyplotAxisType}
					yaxis={{title: ""}}

					data={this.state.data} 
				/>

				<DiscreteColorLegend
				orientation="horizontal"
				width={marginleft_chartprops.width}
				items={["Etablissements publics","Etablissements privés"]	}
				/>
				
				<SourceLink data={sourceLink}/>

			</div>
		);
	}


}
