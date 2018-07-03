import React from 'react';
import {csv} from 'd3-fetch';
import {format} from 'd3-format';

import ScatterOrdinal from './../Components/ScatterOrdinal';
import ScatterplotHint from './../Components/ScatterplotHint';
import ChartTitle from './../Components/ChartTitle';
import StatsHighlights from './../Components/StatsHighlights';
import Emploi from './../data/emploi-salarie-secteur.csv';
import SourceLink from './../Components/SourceLink';

import {
	marginleft_chartprops,
	secteurINSEE,
	DepartementsPSN,
	colorArray
} from './../constants';

import {
  cleanDataEmploi,
  generateItemsScatterplot,
  filterDataScatterplot,
	sumDataCodeDep,
  generateCheckBox,
  conditionsFromCheckboxes
} from './../utils';

const number = format(",.0f")	;

const title = {
		main: "Nombre d'emploi salarié par secteur et par département"
}

const sourceLink = {
	label: 'Source : INSEE - 2015',
	link: 'https://www.insee.fr/fr/statistiques/3524476?sommaire=3202716#consulter'
};

function renderCheckboxesDepartement() {
    const checkboxes = this.state.checkboxesDepartement;

    return checkboxes
        .map((checkbox, index) =>
            <div key={'divCheckboxesDepartement'+index}>
                <label className="container">
                    <input
						 						type="checkbox"
                        checked={checkbox.checked}
                        onChange={toggleCheckbox.bind(this, index, 'Departement')}
                    />
                    <span className="checkmark"></span>
                    {checkbox.label}
                </label>
            </div>
        );
}

function renderCheckboxesSecteur() {
    const checkboxes = this.state.checkboxesSecteur;

    return checkboxes
        .map((checkbox, index) =>
            <div key={'divCheckboxesSecteur'+index}>
                <label className="container">
                    <input
                        type="checkbox"
                        checked={checkbox.checked}
                        onChange={toggleCheckbox.bind(this, index, 'Secteur')}
                    />
                     <span className="checkmark"></span>
                    {checkbox.label}
                </label>
            </div>
        );
}

function toggleCheckbox(index,categorie) {

	switch (categorie) {
		case 'Departement':
			const checkboxesDepartement = this.state.checkboxesDepartement;
		    checkboxesDepartement[index].checked = !checkboxesDepartement[index].checked;
		    this.setState({
				checkboxesDepartement: checkboxesDepartement
			});
		    break;
		case 'Secteur':
			const checkboxesSecteur = this.state.checkboxesSecteur;
		    checkboxesSecteur[index].checked = !checkboxesSecteur[index].checked;
		    this.setState({
				checkboxesSecteur: checkboxesSecteur
			});
		    break;
	}
}

function HintValue(activeNode) {
	return {
			Departement: activeNode.dep,
			Secteur: activeNode.y,
			// Because we squared the value to display the size according to the surface, not the radius, we ave to get the right value back to display
			Emplois: number(Math.pow(activeNode.size,2)) + ' emplois'
			
		}
}

export default class ScatterPlotEmploi extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
            dataEmploi: [],
						sum: {total: 0, psn:0},
						item: "emplois salariés",
            checkboxesDepartement: generateCheckBox(DepartementsPSN),
            checkboxesSecteur: generateCheckBox(secteurINSEE)
        };
    }

	componentDidMount() {

		csv(Emploi)
				.then(data => {
					const cDataEmploi = cleanDataEmploi(data);
					//console.log(cDataEmploi);
									
					const updatedDataEmploi = generateItemsScatterplot(cDataEmploi, 'Departement', 'Secteur', 'Emploi')	
					//console.log(updatedDataEmploi);
					
					var sum = sumDataCodeDep(cDataEmploi, 'DepartementID', 'Emploi');

					this.setState({
						dataEmploi: updatedDataEmploi,
						sum: sum,
						item: 'emplois salariés'
					});
					
			});
	}
	
	render() {		
		return (
			
			<div>
				<ChartTitle title={title}/>
			
				<StatsHighlights data={ this.state.sum } item={this.state.item} />
				
			<ScatterplotHint 
					data={ 
						filterDataScatterplot(
							this.state.dataEmploi,
							conditionsFromCheckboxes(this.state.checkboxesDepartement),
							conditionsFromCheckboxes(this.state.checkboxesSecteur))
					} 
					chartProps={  marginleft_chartprops }
					chartType={ {yType:"ordinal", xType:"ordinal"}} 
					colorProps={{colorType:"category", colorRange: colorArray}}
					axisProps={null}
					sizeRange={[2, 20]}
					hintValueFunction={HintValue}/>
			{/*
				<ScatterOrdinal 
					chartProps={marginleft_chartprops} 
					chartType={ {yType:"ordinal", xType:"ordinal"}} 
					color={colorArray[1]}
					
					data={
						filterDataScatterplot(
							this.state.dataEmploi,
							conditionsFromCheckboxes(this.state.checkboxesDepartement),
							conditionsFromCheckboxes(this.state.checkboxesSecteur))
					}/>
				*/}
				<SourceLink data={sourceLink}/>
					
				<div className="checkbox-container">
					{renderCheckboxesDepartement.call(this)}
				</div>
				<div className="checkbox-container">
				{renderCheckboxesSecteur.call(this)}
				</div>
				
			</div>
		);
	}
	
}
