import React from 'react';
import {csv} from 'd3-fetch';

import creationEntreprises from './../data/creation-entreprise-region.csv';

import ChartTitle from './../Components/ChartTitle';
import SankeyHint from './../Components/SankeyHint';

import {
	cleanDataCreaEntreprises
} from '../utils';

export default class SankeyCreationEntreprises extends React.Component {

	constructor(props) {
			super(props)
			this.state = {
					data: { nodes: [], links: [] }
			};
  }

	componentDidMount() {

		csv(creationEntreprises)
				.then(data => {
					console.log('Sankey - creation entreprises', data);
					const cleanCre = cleanDataCreaEntreprises(data);
					//const dataList = generateSankey2(data,listSourceTargetKeys,getColorSankey,colorDefault);


					this.setState({
						//data: dataList
					});
			});
	}

	render() {

		return ( 
			<div>
			
				<ChartTitle title={{main:"Création d'entreprises par secteur en 2016"}}/>
			
			{/*
				<SankeyHint 
						style={{ 
							labels: {
								fontSize:'11px'
							},
							links: {
								stroke: 'white',
								strokeWidth: '1.5px'
							},
							rects: {
								stroke: 'white',
								strokeWidth: '1.5px',
								fill: '#6a6a62'
							}
						}}
						data={this.state.data} 
						chartprops={large_sankey_chartprops} 
						sankeyMode={'right'}
						hintValueFunction={HintValue}
						hintRenderFunction={HintRender}
					/>

			*/}	
			
			</div>
			
		);
	}
	
}