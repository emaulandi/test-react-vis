import React from 'react';
import {csv} from 'd3-fetch';

import SankeyHint from './../Components/SankeyHint';
import listeData from './../data/listeData2.csv';
import ChartTitle from './../Components/ChartTitle';
import SourceLink from './../Components/SourceLink';
import {Sankey, Hint, DiscreteColorLegend, XYPlot, LabelSeries} from 'react-vis';
import {scaleOrdinal} from 'd3-scale';

import {
	generateSankey2
} from '../utils';

import {
	large_sankey_chartprops,
	colorDomainSankeyData,
	colorScaleSankeyData
} from '../constants';

function HintValue(activeLink) {
	return {
		Title: activeLink.source.name + ' ➞ ' + activeLink.target.name,
		Data: activeLink.value + " jeux de données",
		Liste: activeLink.descriptionList}
}

function HintRender(hintValue, activeLink, x, y){
	const myValue = hintValue;
	const listArray = myValue.Liste.split("\n");
		return (
			<Hint x={x} y={y} value={myValue}>
				<div style={{}}
						 className='rv-hint__content'>
					<p>{myValue.Title}</p>
					<p>{myValue.Data}</p>
					<ul>
					{
						listArray.map( (d,idx) => {
							if (d != ''){
								return (
									<li key={idx}>{d}</li>
								);
							}
						})
					}
					</ul>
				</div>
			</Hint>
		);
}

const listSourceTargetKeys = [
		{sourceKey: 'Catégorie', sourcePrefix: '', targetKey: 'plateforme', targetPrefix: ''},
		{sourceKey: 'plateforme', sourcePrefix: '', targetKey: 'source', targetPrefix: ' '},
		{sourceKey: 'source', sourcePrefix: ' ', targetKey: 'date', targetPrefix: ''}
	];

const colorDefault = '#b3ccff'

function getColorSankey(item, colorDomain, colorScale){
	if (colorDomain.includes(item)){
			return colorScale(item);
	}
	else{
		return colorDefault;
	}
}

const sankeyLabels = [
  {x: 2, y: 10, label: ''}, // tweek for plot to display other text without cut on y
	{x: 2, y: 0, label: 'Thème'},
	{x: 4.5, y: 0, label: 'Plateforme'},
  {x: 7.5, y: 0, label: 'Source'},
  {x: 10, y: 0, label: 'Année'}
];

export default class SankeyData extends React.Component {

	constructor(props) {
			super(props)
			this.state = {
					data: { nodes: [], links: [] }
			};
  }

	componentDidMount() {

		csv(listeData)
				.then(data => {
					console.log('Sankey - data', data);
					//try to sort data by year before display
					data.sort(function(a, b) {
						return +a.date - +b.date;
					});
					//console.log('Sankey - data', data);
					const dataList = generateSankey2(data,listSourceTargetKeys,getColorSankey, colorDomainSankeyData, colorScaleSankeyData, colorDefault);
			
					//console.log('Sankey - dataList', dataList);

					this.setState({
						data: dataList
					});
			});
	}

	render() {
		
		console.log(colorScaleSankeyData.range());

		return ( 
			<div>
			
				<ChartTitle title={{main:"Données identifiées et collectées à date"}}/>
				
				<XYPlot width={large_sankey_chartprops.width} height={30} margin={large_sankey_chartprops.margin}>
					<LabelSeries
						data={sankeyLabels} />
				</XYPlot>

			
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

					<DiscreteColorLegend
					orientation="horizontal"
					width={large_sankey_chartprops.width}
					items={

						colorDomainSankeyData.map( (d,idx) => {
								var title = {}
								if (d.startsWith('target:')) {title = d.slice(7)}
								else {title = d}
								return {title: title, color: colorScaleSankeyData.range()[idx]};
						})
					}
					/>

				
			
			</div>
			
		);
	}
	
}