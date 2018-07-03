import React from 'react';
import {} from 'react-vis';
import {csv} from 'd3-fetch';
import {DiscreteColorLegend} from 'react-vis';

import {
	marginleft_chartprops,
	niveauDiplomeINSEE
} from '../constants';

import Diplomes from './../data/INSEE_diplomes_2014_extract.csv';

import {
  filterSeries,
  generateCheckBox,
  conditionsFromCheckboxes,
	cleanDataDiplome,
	generateSeries
} from './../utils';

import MultipleStackedBar from './../Components/MultipleStackedBar';
import ChartTitle from './../Components/ChartTitle';
import SourceLink from './../Components/SourceLink';

const title = {
		main: "Répartition des 16 - 24 ans par niveau de diplômes"
}

const sourceLink = {
	label: 'Source : INSEE - 2014',
	link: 'https://www.insee.fr/fr/statistiques/3524476?sommaire=3202716#consulter'
};

function renderCheckboxesDiplome() {
	const checkboxes = this.state.checkboxesDiplome;
	return checkboxes
			.map((checkbox, index) =>
					<div key={'divCheckboxeDiplome' + index}>
							<label className="container">
									<input
											type="checkbox"
											checked={checkbox.checked}
											onChange={toggleCheckbox.bind(this, index, 'Diplome')}
									/>
									 <span className="checkmark"></span>
									{checkbox.label}
							</label>
					</div>
			);
}

function toggleCheckbox(index,categorie) {

	switch (categorie) {
		case 'Diplome':
			const checkboxesDiplome = this.state.checkboxesDiplome;
				checkboxesDiplome[index].checked = !checkboxesDiplome[index].checked;
				this.setState({
				checkboxesDiplome: checkboxesDiplome
			});
				break;
	}
}

const standardColor = ['#12939A','#79C7E3', '#1A3177', '#FF9833', '#EF5D28'];

export default class MultStackBarDiplomes extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
            data: [],
            checkboxesDiplome: generateCheckBox(niveauDiplomeINSEE)
		}
  
	}
	
	componentDidMount() {

		csv(Diplomes)
				.then(data => {
					const cDataDiplome = cleanDataDiplome(data);
					//console.log(cDataDiplome);
					
					const updatedDataDiplome = generateSeries(cDataDiplome,standardColor)	
					//console.log(updatedDataDiplome);
					
					this.setState({
						data: updatedDataDiplome
					});
					
			});
	}

	render() {

		return (
			<div>
				<ChartTitle title={title}/>

				<MultipleStackedBar
					chartProps={ marginleft_chartprops }
					yaxis={{title: ""}}
					scaleProps= { {yDomain: [0, 100] } }
					data={filterSeries(this.state.data,conditionsFromCheckboxes(this.state.checkboxesDiplome))} 
				/>

				<DiscreteColorLegend
				orientation="horizontal"
				width={marginleft_chartprops.width}
				items={
					this.state.data.map(d => d.series)
				}
				/>
				
				<SourceLink data={sourceLink}/>

				<div className="checkbox-container">
					{renderCheckboxesDiplome.call(this)}
				</div>

			</div>
		);
	}


}
