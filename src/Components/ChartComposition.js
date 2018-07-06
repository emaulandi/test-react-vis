import React from 'react';

import ScatterplotEmploi from './../Components/Scatterplot-emploi';
import MultStackBarDiplomes from './../Components/MultStackBar-Diplomes';
import MultStackBarRecherche from './../Components/MultStackBar-Recherche';
import ScatterplotToursime from './../Components/Scatterplot-Tourisme';
import SankeyFluxPSN from  './../Components/Sankey-fluxPSN';
import CompareStationsMeteo from  './../Components/CompareStationsMeteo';
import SankeyCreationEntreprises from  './../Components/Sankey-creationEntreprises';
import StationMeteo from  './../Components/StationMeteo';

export default class ChartComposition extends React.Component {
		
		

    render() {
			
			return (
			<div className="App">

				<div className="ChartWrapperHalf">
					<div className="insideChartWrapperHalf">
					<StationMeteo />
					</div>
				</div>

				<div className="ChartWrapperHalf">
					<div className="insideChartWrapperHalf">
					<ScatterplotToursime/>
					</div>
				</div>
				
				<div className="ChartWrapperFull">
					<CompareStationsMeteo />
				</div>

				<div className="ChartWrapperFull">
				<SankeyFluxPSN/>
				</div>

				<div className="ChartWrapperFull">
					<ScatterplotEmploi /> 
				</div>
				
				<div className="ChartWrapperFull">
					<SankeyCreationEntreprises />
				</div>
				
				<div className="ChartWrapperFull">
					<MultStackBarRecherche />
				</div>
				
				<div className="ChartWrapperFull">
					<MultStackBarDiplomes />
				</div>

				</div>
				);

    }
}
