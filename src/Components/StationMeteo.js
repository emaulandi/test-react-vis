import React from 'react';
import {DiscreteColorLegend} from 'react-vis';

import {csv} from 'd3-fetch';
import Vents from './../data/wind2016.csv';
import Precipitations from './../data/precipitation2016.csv';
import Temperature from './../data/temperature2016.csv';
import MultipleLineMarkSeries from  './../Components/MultipleLineMarkSeries';
import ChartTitle from  './../Components/ChartTitle';
import SourceLink from './../Components/SourceLink';

import {
  meteo_chartprops,
	IDstationsMeteoPSN,
	sourceLinkMeteo,
	ventsCategories,
	precipitationsCategories
} from './../constants';

import {
  cleanDataVents,
	cleanDataPrecipitations,
	findIndex,
	generateSelectOption
} from './../utils';

const axis = {
	x:{
		label: '',
		tickAngle: -30
	},
	y:{
		label: 'Puissance du vent en 2016'
	}
}

{/* prepare the chart configuration & load the data of the given station to display */}
const ventsConfig = [
	{chartType: 'LineMarkSeries', className:'', label:'max', style: {stroke: 'white'}, curve: '', values: []},
	{chartType: 'LineMarkSeries', className:'', label:'min', style: {stroke: 'white'}, curve: '', values: []},
	{chartType: 'LineMarkSeries', className:'', label:'mean', style: {}, curve: 'curveMonotoneX', values: []}
];

const precipitationsConfig = [
	{chartType: 'VerticalBarSeries', className:'', label:'humid_mean', values: []},
	{chartType: 'LineMarkSeries', className:'', label:'precip_sum', values: []}
];

{/* for one station, generate one serie (x,y) for each category of the array  */}
function generateAllSeries(data, allSeries, array){
	var i;
	if(typeof data !== "undefined"){
		for(i=0;i<array.length;i++){
			allSeries[i].values = data[array[i]];
		}
	}

	return allSeries;
}

function stationsPSN(data,key,conditions){
	return data.filter(d => { 
		return conditions.includes(d[key])
	});
}

export default class StationMeteo extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
					dataVents: [],
					dataPrecipitations: [],
					selectValue: ''
        };
		
		this.handleChange = this.handleChange.bind(this);
  }
	
	initiateSelect(initValue){
		this.setState({selectValue: initValue});
	}
	
	handleChange(event) {
    this.setState({selectValue: event.target.value});
  }

	componentDidMount() {

		csv(Vents)
				.then(data => {
					const cDataVents= cleanDataVents(data);
				
					this.setState({
							dataVents: cDataVents
					});
		});
		
		csv(Precipitations)
				.then(data => {
					const cDataPrecipitations= cleanDataPrecipitations(data);
				
					this.setState({
							dataPrecipitations: cDataPrecipitations
					});
		});
	}
	
	render() {	
		
		{/* compute the list of PSN stations and extract their names for the dropdwon selection */}
		const listStationsPSN = stationsPSN(this.state.dataPrecipitations,'ID',IDstationsMeteoPSN);
		const nomStationsPSN = listStationsPSN.map(d => d.Nom);
		
		{/* at first loading of the select dropdwon, the select value is the intial state '', so we  force the value of the first of the given list */}
		var IDvents, IDprecipitations, selectValue;
		if ( this.state.selectValue !== '' ) {
			selectValue = this.state.selectValue;
		}
		else {
			selectValue = nomStationsPSN[0];
		}
		IDvents = findIndex(selectValue, 'Nom', this.state.dataVents);
		IDprecipitations  = findIndex(selectValue, 'Nom', this.state.dataPrecipitations);
		
		const allSeriesVents = generateAllSeries(this.state.dataVents[IDvents], ventsConfig, ventsCategories);
		const allSeriesPrecipitations = generateAllSeries(this.state.dataPrecipitations[IDprecipitations], precipitationsConfig, precipitationsCategories);

		return (
			<div>
			
			<ChartTitle title={{main: "Station météorologique"}}/>

			<select value={this.state.selectValue} onChange={this.handleChange}>
				{generateSelectOption(nomStationsPSN)}
			</select>

			<ChartTitle title={{h2: "Vents 2016"}}/>
			<MultipleLineMarkSeries 
				chartProps={meteo_chartprops}
				chartType={{xType: "ordinal"}}
				axis={axis}
				data={allSeriesVents}
			/>
			<DiscreteColorLegend
      orientation="horizontal"
      width={meteo_chartprops.width}
      items={['Maximum (m/s)','Minimum (m/s)', 'Moyenne(m/s)']}
			/>

			
			<ChartTitle title={{h2: "Précipitations & humidité 2016"}}/>
			<MultipleLineMarkSeries 
				chartProps={meteo_chartprops}
				chartType={{xType: "ordinal"}}
				axis={axis}
				data={allSeriesPrecipitations}
			/>
			<DiscreteColorLegend
      orientation="horizontal"
      width={meteo_chartprops.width}
      items={['Humidité (%)', 'Total des précipitations (mm)']}
			/>
				
			<SourceLink data={sourceLinkMeteo}/>
			
			</div>
		);
	}
	
}