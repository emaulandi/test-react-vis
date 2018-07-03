import React, { Component } from 'react';
import './App.css';
import 'react-vis/dist/style.css';
import SankeyData from  './Components/SankeyData';
import ChartComposition from  './Components/ChartComposition';

import WebFont from 'webfontloader';

import { BrowserRouter, Route, Link } from 'react-router-dom'

WebFont.load({
  google: {
    families: ['Libre+Franklin:bold', 'Montserrat']
  },
	typekit: {
    id: 'myriad-pro'
  }
});



class App extends Component {

  render() {

  	
    return (
		<div className="App">
			
			  <BrowserRouter basename={process.env.PUBLIC_URL}>
				<div>
					<Route exact path="/" component={ChartComposition}/>
					<Route path="/data" component={SankeyData}/>
				</div>
				</BrowserRouter>
			
			

		</div>

    );
  }
}

export default App;
