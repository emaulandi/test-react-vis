import React from 'react';

import {csv} from 'd3-fetch';
import Vents from './../data/wind2016.csv';
import {DiscreteColorLegend} from 'react-vis';
import MultipleLineMarkSeries from  './../Components/MultipleLineMarkSeries';
import ChartTitle from  './../Components/ChartTitle';
import SourceLink from './../Components/SourceLink';

import {
  meteoCompare_chartprops,
	IDstationsMeteoPSN,
	sourceLinkMeteo,
	ventsCategories,
	ventsCategoriesLabel
} from './../constants';

import {
  cleanDataVents,
	generateSelectOption
} from './../utils';

function generateSeriesStations(label,data){
	//for each station, generate series with chartType, style, curve and value
	//stations : ID, Nom, serieVentMax, serieVentMean, serieVentMin
	//label would be serieVentMax, serieVentMean, serieVentMin
	return data.map( d => {
		return {chartType: 'LineMarkSeries', className:'', label:'max', style: {}, curve: 'curveMonotoneX', values: d[label]}
	})

}

const axis = {
	x:{
		label: '',
		tickAngle: -30
	},
	y:{
		label: 'Puissance du vent en 2016'
	}
}


export default class CompareStationsMeteo extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
					dataVents: [],
					selectCatVents : ventsCategoriesLabel[0]
        };
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event) {
    this.setState({selectCatVents: event.target.value});
  }
	
	componentDidMount() {

		csv(Vents)
				.then(data => {
					const cDataVents= cleanDataVents(data);
				
					this.setState({
							dataVents: cDataVents
					});
		});

	}
	
	render() {	
		
		return (
			<div>
			
			<ChartTitle title={{main: "Comparaisons des stations météorologiques de la vallée de Seine", h2: "Vents 2016 (m/s)"}}/>
			
			<select value={this.state.selectValue} onChange={this.handleChange}>
				{generateSelectOption(ventsCategoriesLabel)}
			</select>
			
			<MultipleLineMarkSeries 
				chartProps={meteoCompare_chartprops}
				chartType={{xType: "ordinal"}}
				axis={axis}
				data={generateSeriesStations(
					ventsCategories[ventsCategoriesLabel.indexOf(this.state.selectCatVents)],
					this.state.dataVents.filter(d => IDstationsMeteoPSN.includes(d['ID']))
				)}
			/>

			<DiscreteColorLegend
      orientation="horizontal"
      width={meteoCompare_chartprops.width}
      items={
				this.state.dataVents.filter(d => IDstationsMeteoPSN.includes(d['ID'])).map(d => d.Nom)
			}
			/>
				
			<SourceLink data={sourceLinkMeteo}/>
			</div>
	
		);
	}
	
}