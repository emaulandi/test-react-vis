import React from 'react';
import {csv} from 'd3-fetch';
import {scaleOrdinal} from 'd3-scale';

import listeData from './../data/listeData_disponibles.csv';
import overviewData from './../data/listeData_all.csv';
import nextData from './../data/listeData_souhaitees.csv';

import SankeyHint from './../Components/SankeyHint';
import ChartTitle from './../Components/ChartTitle';
import {Hint, DiscreteColorLegend, XYPlot, LabelSeries} from 'react-vis';

import {
	generateSankey2,
	getColorSankey
} from '../utils';

import {
	large_sankey_chartprops,
	colorDomainCategories,
	colorValuesCategories,
	sankeyStyle
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
							if (d !== ''){
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

const listSourceTargetKeysOverview = [
	{sourceKey: 'Catégorie', sourcePrefix: '', targetKey: 'Couverture', targetPrefix: ''},
	{sourceKey: 'Couverture', sourcePrefix: '', targetKey: 'intégré', targetPrefix: ''},
	{sourceKey: 'intégré', sourcePrefix: '', targetKey: 'Accès', targetPrefix: ''}
];

const listSourceTargetKeysNext = [
	{sourceKey: 'Catégorie', sourcePrefix: '', targetKey: 'Couverture', targetPrefix: ''},
	{sourceKey: 'Couverture', sourcePrefix: '', targetKey: 'Source', targetPrefix: ''},
	{sourceKey: 'Source', sourcePrefix: '', targetKey: 'Accès', targetPrefix: ''}
];

const colorDefault = '#b3ccff'

const sankey_chartprops = {
	height: 400,
	width: 1100,
	margin: {left: 10, right: 10, top: 10, bottom: 10} 
};

const sankeyLabels = [
  {x: 2, y: 10, label: ''}, // tweek for plot to display other text without cut on y
	{x: 2, y: 0, label: 'Catégorie'},
	{x: 4.5, y: 0, label: 'Plateforme'},
  {x: 7.5, y: 0, label: 'Source'},
  {x: 10, y: 0, label: 'Année'}
];

const sankeyLabelsOverview = [
  {x: 2, y: 10, label: ''}, // tweek for plot to display other text without cut on y
	{x: 2, y: 0, label: 'Catégorie'},
	{x: 4.7, y: 0, label: 'Couverture'},
  {x: 7.9, y: 0, label: 'Donnée exploitée'},
  {x: 10, y: 0, label: "Accessibilité de la donnée"}
];

const sankeyLabelsNext = [
  {x: 2, y: 10, label: ''}, // tweek for plot to display other text without cut on y
	{x: 2, y: 0, label: 'Catégorie'},
	{x: 4.4, y: 0, label: 'Couverture'},
	{x: 7.5, y: 0, label: 'Source'},
  {x: 10, y: 0, label: "Accessibilité de la donnée"}
];

const colorScaleUsed = scaleOrdinal()
			.domain(colorDomainCategories.concat(['target:2018','target:2017']))
			.range(colorValuesCategories.concat(['#ff9966','#ff9966']))

const colorScaleOverview = scaleOrdinal()
			.domain(colorDomainCategories.concat(['target:Identifié et non accessible','target:Identifié et payant']))
			.range(colorValuesCategories.concat(['#ff9966','#ff9966']))

const colorScaleNext = scaleOrdinal()
			.domain(colorDomainCategories.concat(['target:Identifié et non accessible','target:Identifié et payant']))
			.range(colorValuesCategories.concat(['#ff9966','#ff9966']))

const sankeyCharts = [
	{title: {main:"Données collectées et exploitées à date"}, 
	 labels: sankeyLabels,
	 chartProps: large_sankey_chartprops,
	 dataLabel: 'usedData',
	 colorScale : colorScaleUsed,
	 HintValue: HintValue, HintRender: HintRender
	},
	{title: {main:"Vue d'ensemble des données identifiées"}, 
	 labels: sankeyLabelsOverview,
	 chartProps: sankey_chartprops,
	 dataLabel: 'overviewData',
	 colorScale : colorScaleOverview,
	 HintValue: HintValue, HintRender: HintRender
	},
	{title: {main:"Focus sur les données non exploitées", h2: ""}, 
	 labels: sankeyLabelsNext,
	 chartProps: large_sankey_chartprops,
	 dataLabel: 'nextData',
	 colorScale : colorScaleNext,
	 HintValue: HintValue, HintRender: HintRender
	}
];

const detailsSource = [ "IAU IDF: Institut d’Aménagement et Urbanisme Ile-de-France", "AURBSE: Agence d’Urbanisme de Rouen et des Boucles de Seine et Eure", 
								 "AURH: Agence d’Urbanisme de la Région du Havre et de l’Estuaire de la Seine", "AUCAME: Agence d’Urbanisme de Caen Normandie Métropole", 
								 "ATOUT FRANCE: Agence de développement touristique de la France"];

export default class SankeyData extends React.Component {

	constructor(props) {
			super(props)
			this.state = {
					usedData: { nodes: [], links: [] },
					overviewData: { nodes: [], links: [] },
					nextData: { nodes: [], links: [] }
			};
  }

	componentDidMount() {

		csv(listeData)
				.then(data => {
					//console.log('Sankey - data', data);
					//console.log('Sankey - data', data);
					const dataList = generateSankey2(data,listSourceTargetKeys,getColorSankey, colorScaleUsed, colorDefault, 'Description');
					//console.log('Sankey - dataList', dataList);

					this.setState({
						usedData: dataList
					});
			});
		
			csv(overviewData)
				.then(data => {
					//console.log('Sankey - data overview ', data);
					//console.log('Sankey - data', data);
					const dataListOverview = generateSankey2(data,listSourceTargetKeysOverview,getColorSankey, colorScaleOverview, colorDefault, "Détails");
					//console.log('Sankey - dataList', dataListOverview);

					this.setState({
						overviewData: dataListOverview
					});
			});
		
			csv(nextData)
				.then(data => {
					//console.log('Sankey - data overview ', data);
					//console.log('Sankey - data', data);
					const dataListNext = generateSankey2(data,listSourceTargetKeysNext,getColorSankey, colorScaleNext, colorDefault, "Détails");
					//console.log('Sankey - dataList', dataListNext);

					this.setState({
						nextData: dataListNext
					});
			});
	}

	render() {

		return ( 
			<div>
			
				{
					sankeyCharts.map( (c,id) => {
						
						return (
								<div  key={'div'+id}>
								<ChartTitle title={c.title}  key={'chartTitle1-' +id}/>
								<br></br>
			
								<XYPlot width={c.chartProps.width} height={30} margin={c.chartProps.margin}>
									<LabelSeries
										data={c.labels} />
								</XYPlot>
			
								<SankeyHint 
									style={sankeyStyle}
									data={this.state[c.dataLabel]} 
									chartprops={c.chartProps} 
									sankeyMode={'right'}
									hintValueFunction={c.HintValue}
									hintRenderFunction={c.HintRender}
								/>
			
								
								<DiscreteColorLegend
									orientation="horizontal"
									width={large_sankey_chartprops.width}
									items={

										c.colorScale.domain().map( (d,idx) => {
												var title = {}
												if (d.startsWith('target:')) {title = d.slice(7)}
												else {title = d}
												return {title: title, color: c.colorScale.range()[idx]};
										})
									}
									/>

									<br></br>
									<hr></hr>
									<br></br>
								
								</div>
						);
					
					}	
				)}
				
				<ChartTitle title={{h2: 'Détails des sources'}}/>
				{
					detailsSource.map( (d,id) => {
						return (
							<ChartTitle title={{p: d}} key={'chartTitle2-' +id}/>
						);
					}
				)}
			
			</div>
			
		);
	}
	
}