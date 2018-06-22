import React, { Component } from 'react';
import './App.css';
import 'react-vis/dist/style.css';


import SankeyFlux from './Components/Sankey-flux';
import ScatterplotEmploi from './Components/Scatterplot-emploi';
import MultStackBarDiplomes from './Components/MultStackBar-Diplomes';
import ScatterplotToursime from './Components/Scatterplot-Tourisme';

import {large_chartprops} from './constants';



class App extends Component {
  

  render() {

  	
    return (
		<div className="App">


			<ScatterplotEmploi /> 
			{/*
			
			<SankeyFlux />
			
			
			<MultStackBarDiplomes />
			
			<ScatterplotToursime/>

			

			
			
			*/}
			
			


		</div>

    );
  }
}

export default App;
