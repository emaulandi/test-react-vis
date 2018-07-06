import React from 'react';
import {csv} from 'd3-fetch';

import creationEntreprises from './../data/creation-entreprise-region.csv';

import ChartTitle from './../Components/ChartTitle';
import SankeyHint from './../Components/SankeyHint';
import StatsHighlights from './../Components/StatsHighlights';
import SourceLink from './../Components/SourceLink';

import {DiscreteColorLegend} from 'react-vis';

import {
	cleanDataCreaEntreprises,
	deserializeMultiAttribute,
	generateSankey,
	colorSankeyLinkSource,
	mergeRegionPSN,
	sumData,
	arraySum
} from '../utils';

import {
	secteurCrea,
	medium_sankey_chartprops,
	colorScaleSankeyEntreprises,
	sankeyStyle
} from '../constants';

import {format} from 'd3-format';
const int = format(".0f");

const sourceLink = {
	label: 'Source : INSEE - 2016',
	link: 'https://www.insee.fr/fr/statistiques/2134432'
};

function HintValue(activeLink) {
	return {[activeLink.source.name + ' ➞ ' + activeLink.target.name]: + int(activeLink.value) + " creation d'entreprises"}
}

export default class SankeyCreationEntreprises extends React.Component {

	constructor(props) {
			super(props)
			this.state = {
				data: { nodes: [], links: [] },
				sum: {
					total: 0,
					psn:0
				}
			};
  }

	componentDidMount() {

		csv(creationEntreprises)
				.then(data => {
					//console.log('Sankey - creation entreprises', data);
					const cleanCreationEntreprises = cleanDataCreaEntreprises(data);

					const dataPSNmerge = mergeRegionPSN(cleanCreationEntreprises,secteurCrea);
					//console.log(dataPSNmerge);
			
					const arrayID = ['RegionID', 'Region'];
					const newKeys = ['Secteur','CreationEntreprise']
					const flat = deserializeMultiAttribute(dataPSNmerge, arrayID, secteurCrea, newKeys);
					//console.log(flat);
					const sankeyData = generateSankey(flat,'Region','', newKeys[0],'', newKeys[1]);
					const sankeyDataColor = colorSankeyLinkSource(sankeyData, 'Vallée de Seine', 'source', colorScaleSankeyEntreprises.range()[1]);
				  //console.log(sankeyDataColor);
			
					this.setState({
						data: sankeyDataColor,
						sum: {
							psn: arraySum(flat.filter(d => {return d.RegionID === "PSN"}),newKeys[1]),
							total: sumData(flat,newKeys[1])
						}
					});
			});
	}

	render() {

		return ( 
			<div>
			
				<ChartTitle title={{main:"Création d'entreprises par secteur en France Métropolitaine en 2016"}}/>
				
				<StatsHighlights data={ this.state.sum } item={"création d'entreprises"} />
				<ChartTitle title={{p:"La zone Vallée de Seine concerne les régions Ile de France et Normandie"}}/>

				<SankeyHint 
						style={sankeyStyle}
						data={this.state.data} 
						chartprops={medium_sankey_chartprops} 
						sankeyMode={'center'}
						hintValueFunction={HintValue}
						hintRenderFunction={null}
					/>
			
				<DiscreteColorLegend
					orientation="horizontal"
					width={medium_sankey_chartprops.width}
					items={
						colorScaleSankeyEntreprises.range().map( (d,idx) => {
							return {
								title: colorScaleSankeyEntreprises.domain()[idx], 
								color: colorScaleSankeyEntreprises.range()[idx]
							};
						})
					}
					/>

			<SourceLink data={sourceLink}/>
			
			</div>
			
		);
	}
	
}