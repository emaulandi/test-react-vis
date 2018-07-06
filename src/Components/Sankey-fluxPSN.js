import React from 'react';
import {csv} from 'd3-fetch';
import SankeyHint from './../Components/SankeyHint';
import Flux2014 from './../data/df_flux14_pop.csv';
import ChartTitle from './../Components/ChartTitle';
import SourceLink from './../Components/SourceLink';

import {DiscreteColorLegend} from 'react-vis';

import {
	generateSankey,
	colorSankeyLinkSource,
	isPSN,
	arraySum,
	generateCheckBox
} from '../utils';

import {
	sankey_chartprops,
	smallSaneky_chartprops,
	sankeyStyle
} from '../constants';

import {format} from 'd3-format';
const perc = format(".2p");
const number = format(",.0f")	;

const sourceLink = {
	label: 'Source : INSEE - 2014',
	link: 'https://www.insee.fr/fr/statistiques/2862068'
};

function renderCheckboxes(id) {
	const checkbox = this.state.checkboxes[id];
	return (
			<div>
				<label className="switch">
					<input 
						type="checkbox"
						checked={checkbox.checked}
            onChange={toggleCheckbox.bind(this, id)}
					/>
					<span className="slider"></span>
				</label>
			</div>
	);
}

function toggleCheckbox(index) {

			const checkboxes = this.state.checkboxes;
			checkboxes[index].checked = !checkboxes[index].checked;
			this.setState({
				checkboxes: checkboxes
			});
	}

function HintValue(activeLink) {
	return {[activeLink.source.name + ' ➞ ' + activeLink.target.name]: + activeLink.value + " déménagements en 2014"}
}

const highlightColor = '#EF7D00';

{/* sankey chart high level properties, - to automate generation */}
const sankeyChartsFlux = [
	{ divClassName: 'insideChartWrapperHalf', checkBoxId: 0, title: "Vers la Vallée de Seine", dataLabel: 'data_versPSN', chartProps: smallSaneky_chartprops  },
	{ divClassName: 'insideChartWrapperHalf', checkBoxId: 1, title: "Depuis la Vallée de Seine", dataLabel: 'data_depuisPSN', chartProps: smallSaneky_chartprops  },
	{ divClassName: 'insideChartWrapper', checkBoxId: 2, title: "Au sein de la Vallée de Seine", dataLabel: 'data_dansPSN', chartProps: sankey_chartprops }
];

export default class SankeyFluxPSN extends React.Component {

	constructor(props) {
			super(props)
			this.state = {
					data_horsPSN: { nodes: [], links: [] },
					data_dansPSN: { nodes: [], links: [] },
					data_versPSN: { nodes: [], links: [] },
					data_depuisPSN: { nodes: [], links: [] },
					sumMigration : 0,
					checkboxes: generateCheckBox(['Vers PSN', 'Depuis PSN','Au sein de PSN'])
			};
  }

	componentDidMount() {

		csv(Flux2014)
				.then(data => {
					const horsPSN = generateSankey(
						data.filter( d => (!isPSN(d.code_insee2)) && (!isPSN(d.code_insee1))),
						'categorie_1','depart: ','categorie_2','arrivée: ', 'migration'
					);
			
					const dansPSN = generateSankey(
						data.filter( d => (isPSN(d.code_insee2)) && (isPSN(d.code_insee1))),
						'categorie_1','depart: ','categorie_2','arrivée: ', 'migration'
					);
					const dansPSNColor = colorSankeyLinkSource(dansPSN, 'depart: capitale', 'source', highlightColor);
			
					const versPSN = generateSankey(
						data.filter( d => (isPSN(d.code_insee2)) && (!isPSN(d.code_insee1))),
						'categorie_1','depart: ','categorie_2','arrivée: ', 'migration'
					);
					const versPSNColor = colorSankeyLinkSource(versPSN, 'arrivée: capitale', 'target', highlightColor);
			
					const depuisPSN = generateSankey(data.filter( d => (!isPSN(d.code_insee2)) && (isPSN(d.code_insee1))),
						'categorie_1','depart: ','categorie_2','arrivée: ', 'migration'
					);
					const depuisPSNColor = colorSankeyLinkSource(depuisPSN, 'depart: capitale', 'source', highlightColor);
		
					this.setState({
						data_horsPSN: horsPSN,
						data_dansPSN: dansPSNColor,
						data_versPSN: versPSNColor,
						data_depuisPSN: depuisPSNColor,
						sumMigration: arraySum(data,'migration')
					});
					
			});
	}

	render() {

		return ( 
			<div>
			
				<ChartTitle title={{main:"Flux migratoires: nombre de déménagements en 2014"}}/>
				
				{
					sankeyChartsFlux.map( (d, idx) => {
						return(
							<div key={'divSankey'+idx} className={d.divClassName}>
								<div>
								{/*
									<div className="checkbox-container">
										{renderCheckboxes.call(this,d.checkBoxId)}
									</div>
								*/}

								<ChartTitle title={{h2:d.title}}/>
								</div>
								<p> { number(arraySum(this.state[d.dataLabel].links, 'value'))} déménagements, soit { perc(arraySum(this.state[d.dataLabel].links, 'value') / this.state.sumMigration)} des déménagements en France en 2014 </p>

								<SankeyHint 
									style={sankeyStyle}
									data={this.state[d.dataLabel]} 
									chartprops={d.chartProps} 
									hintValueFunction={HintValue}
									hintRenderFunction={null}
								/>
							</div>	
						);

					})
				}
				
				<DiscreteColorLegend
					orientation="horizontal"
					width={sankey_chartprops.width}
					items={[{
								title: "Depuis et vers la capitale Paris", 
								color: highlightColor
					}]}
					/>
			
				<SourceLink data={sourceLink}/>
			
			</div>
			
		);
	}
	
}