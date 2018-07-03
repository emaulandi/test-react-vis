import {
	secteurINSEE,
	departement_PSN_num,
	departement_PSN,
	niveauDiplomeINSEE,
	month,
	monthNum,
	IDstationsMeteoPSN,
	colorSankeyData,
	colorScaleSankeyData,
	IDregionPSN
} from './constants';

import React from 'react';

import {_} from 'underscore';


export function cleanDataEmploi(data) {
	
	// From crosstab to list
	var listData = [];
	
	//console.log(data[4]);
	
	data.forEach( d => {
		//d.Emploi = +d.Emploi;
		var datum = {};
		var i;
		
		for (i= 0; i<secteurINSEE.length ; i++) {
			
			datum.DepartementID = +d['Departement'].slice(0,2);
			datum.Departement = d['Departement'].slice(3);
			datum.Secteur = secteurINSEE[i];
			//convert to number
			datum.Emploi = +d[secteurINSEE[i]];
			listData.push(datum);
			datum = {};
		}
	});	
	
	return listData ;
}

export function cleanDataTourisme(data) {
	
	data.forEach( d => {
		//Change , percentage from original data
		d.Hotel_tourisme_perc_residents_etrangers = +d.Hotel_tourisme_perc_residents_etrangers.replace(",",".") ;
		
		//Swith to number
		d.Hotel_tourisme_nb_etablissement = +d.Hotel_tourisme_nb_etablissement;
		d.Hotel_tourisme_total_nuitees_milliers = +d.Hotel_tourisme_total_nuitees_milliers;
		d.pop2018 = +d.pop2018;
		
		//Compute hotel nights by for 1000 inhabitants
		d.nuitees_population_relatif = d.Hotel_tourisme_total_nuitees_milliers * 1000 / d.pop2018;
		
	});
	
	return data;

}

export function cleanDataDiplome(data) {
	var proportion = [];
	var i;
	var header1624 = ['dpx_recAs1age2_rec1rpop2014','dpx_recAs2age2_rec1rpop2014',
										'dpx_recBs1age2_rec1rpop2014','dpx_recBs2age2_rec1rpop2014',
										'dpx_recCs1age2_rec1rpop2014','dpx_recCs2age2_rec1rpop2014',
										'dpx_recDs1age2_rec1rpop2014','dpx_recDs2age2_rec1rpop2014'];

	data.forEach( d => {
		var sum = 0;
		for (i=0;i<header1624.length;i++){
			d[header1624[i]] = +d[header1624[i]];
			sum += d[header1624[i]];
		}
		
		var item = {
				"code_departement": +d.DR16,
				"departement": d.LIBELLE16,
				"niveau":{
				  "Aucun ou BEPC": (d.dpx_recAs1age2_rec1rpop2014 + d.dpx_recAs2age2_rec1rpop2014)/sum,
					"Niveau BEP": (d.dpx_recBs1age2_rec1rpop2014 + d.dpx_recBs2age2_rec1rpop2014)/sum,
					"Niveau Baccalaureat": (d.dpx_recCs1age2_rec1rpop2014 + d.dpx_recCs2age2_rec1rpop2014)/sum,
					"Diplome du supérieur": (d.dpx_recDs1age2_rec1rpop2014 + d.dpx_recDs2age2_rec1rpop2014)/sum
				}
			}
		proportion.push(item);
	
	});
	return proportion;
}

/* Clean and change data structure to fit x:Month y:value for each series : wind_max, wind_min, wind_mean*/
export function cleanDataVents(data){

	var seriesVentsMax, seriesVentsMin, seriesVentsMean ;
	var temp, value ;
	
	var dataVents = data.map( d => {
		seriesVentsMax = [];
		seriesVentsMin = [];
		seriesVentsMean = [];
		
		Object.keys(d).forEach(function eachKey(key) { 

			if (key.startsWith('wind_max')){
				temp =  month[monthNum.indexOf(key.slice(-2))] ;
				value = +d[key].replace(",",".");
				seriesVentsMax.push({x: temp, y: value});
			}
			
			if (key.startsWith('wind_min')){
				temp =  month[monthNum.indexOf(key.slice(-2))] ;
				value = +d[key].replace(",",".");
				seriesVentsMin.push({x: temp, y: value});
			}
			
			if (key.startsWith('wind_mean')){
				temp =  month[monthNum.indexOf(key.slice(-2))] ;
				value = +d[key].replace(",",".");
				seriesVentsMean.push({x: temp, y: value});
			}

  	});
		
		return {
			ID: +d.ID,
			Nom: d.Nom,
			seriesVentsMax: seriesVentsMax,
			seriesVentsMin: seriesVentsMin,
			seriesVentsMean: seriesVentsMean			
		}
		
	});
	
	return dataVents;
	
}

/* Clean and change data structure to fit x:Month y:value for each series : humid_mean, snow_sum, precip_sum */
export function cleanDataPrecipitations(data){

	var seriesHumidMean, seriesSnowSum, seriesPrecipSum ;
	var temp, value ;
	
	var dataPrecipitations = data.map( d => {
		seriesHumidMean = [];
		seriesSnowSum = [];
		seriesPrecipSum = [];
		
		Object.keys(d).forEach(function eachKey(key) { 

			if (key.startsWith('humid_mean')){
				temp =  month[monthNum.indexOf(key.slice(-2))] ;
				value = +d[key].replace(",",".");
				seriesHumidMean.push({x: temp, y: value});
			}
			
			if (key.startsWith('snow_sum')){
				temp =  month[monthNum.indexOf(key.slice(-2))] ;
				value = +d[key].replace(",",".");
				seriesSnowSum.push({x: temp, y: value});
			}
			
			if (key.startsWith('precip_sum')){
				temp =  month[monthNum.indexOf(key.slice(-2))] ;
				value = +d[key].replace(",",".");
				seriesPrecipSum.push({x: temp, y: value});
			}

  	});
		
		return {
			ID: +d.ID,
			Nom: d.Nom,
			seriesHumidMean: seriesHumidMean,
			seriesSnowSum: seriesSnowSum,
			seriesPrecipSum: seriesPrecipSum			
		}
		
	});
	
	//console.log(dataPrecipitations);
	return dataPrecipitations;
	
}

/* Compute actual number of enterprise creation from % of total */
export function cleanDataCreaEntreprises(data){
	
	const headerCrea = ["Part de l'industrie","Part de la construction",	"Part du commerce, transport, hébergement, restauration", 
											"Part des services aux entreprises",	"Part des services aux particuliers"];
	const secteurCrea = ['Industrie', 'Construction', "Commerce, transport, hébergement, restauration",'Services aux entreprises','Services aux particuliers'];
	
	data.forEach( d => {
			secteurCrea.forEach( (e, idx) => {
				d[e] = +d[headerCrea[idx]] * +d["Nombre de créations d'entreprises"] / 100;
			});
	})
	
	console.log(data);
	
	mergeRegionPSN(data,secteurCrea);
}

/* From an array of region, merge idf and Normandie in PSN region */
export function mergeRegionPSN(data,arrayMerge){
	var exceptPSN = data.filter( d => {return !IDregionPSN.includes(d.RegionID)});
	console.log(exceptPSN);
	
	var PSN = {
		Region: "Vallée de Seine",
		RegionID: "PSN"
	};
	
	IDregionPSN.forEach( d => {
		/*d[]arrayMerge*/
	})
	
}

// Find the the index of an element given a property key and a matching value
export function findIndex(value, key, data){
	return data.map(function(e) { return e[key]; }).indexOf(value);
}

export function generateSeries(data, colorTab) {
	var seriesList = [];
	var i,j;
	
	for(i=0;i<niveauDiplomeINSEE.length;i++){
		seriesList.push({
			series: niveauDiplomeINSEE[i],
			values: [],
			color: colorTab[i]
		});
	}

	var filterPSN = data.filter(d => isPSNdep(d.code_departement));

	data.filter(d => isPSNdep(d.code_departement)).forEach( d => {
		for(j=0;j<niveauDiplomeINSEE.length;j++){
			seriesList[j].values.push({
				"x": d.departement,
				"y": d.niveau[niveauDiplomeINSEE[j]] * 100
			});
		}
	});
	
	return seriesList;
}

export function generateItemsScatterplot(data, xAttribute, yAttribute, sizeAttribute) {

	return data.map(row => {
		return {
			x: row[xAttribute], 
			y: row[yAttribute] , 
			size: Math.sqrt(row[sizeAttribute]),
			dep: row['Departement']
		};
			
	});
}

export function generateItemsScatterplotColor(data, xAttribute, yAttribute, sizeAttribute, colorFunction, colorAttribute) {

	return data.map(row => {
		
		return {
			x: row[xAttribute], 
			y: row[yAttribute] , 
			size: Math.sqrt(row[sizeAttribute]),
			color: colorFunction(+row[colorAttribute]),
			dep: row['Departement']
		};
			
	});
}

export function colorRegion(colorAttribute) {
	var color = 0;

	if ( colorAttribute === 11 || colorAttribute === 27 ) {
		color = 1;
		
	}
	
	return color;
}

export function sumDataCodeDep(data, attributePSN, attributeCount) {
	var sum = 0 ;
	var sumPSN = 0;
	
	data.forEach( (d) => {
		sum += d[attributeCount];
		if ( isPSNdep(d[attributePSN]) ) {
			sumPSN += d[attributeCount];
		}
	});
	
	return {total: sum, psn: sumPSN};
}

export function sumPSN(data, attributePSN, attributeCount) {
	var sum = 0 ;
	var sumPSN = 0;
	
	data.forEach( (d) => {
		
		sum += d[attributeCount];
	
		if ( isPSN(d[attributePSN]) ) {
			sumPSN += d[attributeCount];
		}
		
	});
	
	return {total: sum, psn: sumPSN};
}

export function sumData(data, attributeCount) {
	var sum = 0 ;
	
	data.forEach( (d) => {
		sum += d[attributeCount];
	
	});
	
	return sum;
}

export function fluxMigratoire(data) {
	
	//console.log(data.features.length);
	var source = [];
	var target = [];

	// La cible est PSN
	var PSN = data.features.filter( d => isPSN(d.properties.code_insee2) );
	//console.log(PSN);
	
	// List of source & target
	PSN.forEach( d => {
		source.push(d.properties.commune1);
		target.push(d.properties.commune2);
		
	});
	
	const uniqueSource = [...new Set(source)]; 
	//console.log(uniqueSource); 
	
	const uniqueTarget = [...new Set(target)]; 
	//console.log(uniqueTarget);
	
	var nodes = [...source, ...target];
	
	var sankeyNodes = nodes.map( (d) => { return {name: d} });

	//console.log(sankeyNodes);
	
	// Generate list of link with unique ID
	var sankeyLinks = PSN.map( (d) => {
		return {
			source: uniqueSource.indexOf(d.properties.commune1) , 
			target: uniqueSource.length + uniqueTarget.indexOf(d.properties.commune2) , 
			value: +d.properties.migration 
		};
	});
	//console.log(sankeyLinks);
	
	return {
		nodes: sankeyNodes, 
		links: sankeyLinks
	};
}

export function isPSNdep(codeDep) {
	
	var isPSN = false ;
	var i;
	
	for (i=0; i< departement_PSN_num.length; i++) {
		if ( codeDep === departement_PSN_num[i] ) { isPSN = true ; break ;}
	}

	return isPSN;
}

export function isPSN(codeCommune) {
	var isPSN = false ;
	var i;
	
	for (i=0; i< departement_PSN.length; i++) {
		if ( codeCommune.indexOf(departement_PSN[i]) === 0) { isPSN = true ; break ;}
	}
	
	// if ( codeCommune.indexOf(departement_PSN[0]) == 0) { isPSN = true ; }
	
	return isPSN;
}

export function filterSeries(data, conditionsSeries){
	//Filtrer sur le département > pas réalisé
	var conditionsDepartements = ['Yvelines',"Val-d'Oise",'Hauts-de-Seine','Seine-Saint-Denis','Paris','Seine-Maritime','Eure','Calvados','Manche'];
	
	var filteredSeries = data.filter(d => { 
		return conditionsSeries.includes(d.series)
	});
	
	//Filtrer sur le département > pas réalisé
	/*
	var filtered = filteredSeries.map( (d, idx) => {
		var values = [];
		d.values.forEach( (item) => { 
			if( conditionsDepartements.includes(item.x) ) { values.push(item) ;	} 
		});	
		
		return {"series":d.series, "values": values};
	});
	*/

	return filteredSeries;
}

export function filterDataScatterplot(data, conditionsX, conditionsY){

	//var conditionsX = ['Paris'];
	//var conditionsY = [secteurINSEE[0],secteurINSEE[1]];

	var unSecteur = data.filter((d) => { 
		return conditionsX.includes(d.x) && conditionsY.includes(d.y) ;
		}
	);

	return unSecteur;
	
}

export function generateCheckBox(array){
	var checkBoxArray = [];
	array.forEach( d => {
		checkBoxArray.push({label: d, checked: true});
	});
	return checkBoxArray;
}

export function conditionsFromCheckboxes(checkboxesStatus) {
	var conditions = [];
	checkboxesStatus.forEach( d => {
		if (d.checked) { conditions.push(d.label) ; }
	});
	return conditions;
}

export function generateSankey(data,sourceKey,sourcePrefix,targetKey,targetPrefix, valueKey){
	//generate sankey dataset in the form of list of nodes, and list of links between them with a weight
	//categorie_1,categorie_2
	
	var source = [];
	var target = [];
	
	//const insidePSN = data.filter( d => (!isPSN(d.code_insee2)) && (!isPSN(d.code_insee1))) ; 
	//console.log(insidePSN);
	// List of source & target categories for inside PSN
	//console.log(data.filter( d => (d.is_PSN_1 == 1) && (d.is_PSN_2 == 1)).length);
	//console.log(data.length);

	data.forEach( d => {
		source.push(sourcePrefix + d[sourceKey]);
		target.push(targetPrefix + d[targetKey]);
	});
	
	//Set of unique nodes
	var nodes = [...source, ...target];
	var uniqueNodes = [...new Set(nodes)];
	var uniqueSources = [...new Set(source)];
	var uniqueTargets = [...new Set(target)];
	
	var sankeyNodes = uniqueNodes.map( (d) => { return {name: d} });
	//console.log(sankeyNodes);
	
	// Generate list of link with unique ID
	var tempLinks = data.map( (d) => {
		return {
			source: uniqueNodes.indexOf(sourcePrefix + d[sourceKey]) , 
			target: uniqueNodes.indexOf(targetPrefix + d[targetKey]) , 
			value: +d[valueKey]
		};
	});
	
	//console.log(tempLinks);
	
	//Merge the link
	var sankeyLinks = [];
	
	//Create empty array
	var i, j;
	for(i=0;i<uniqueSources.length;i++) {
		for(j=0;j<uniqueTargets.length;j++) {
			sankeyLinks.push({
				source: i, target: uniqueSources.length + j, value: 0
			})
		}
	}
	
	//console.log(sankeyLinks);
	
	// Add each migration value in the correponding link
	tempLinks.forEach( d => {
		 sankeyLinks.find(e => (e.source === d.source) && (e.target === d.target) ).value += d.value;
	});

	//console.log(sankeyLinks);
	
	return {
		nodes: sankeyNodes, 
		//Delete any links with value 0 that are still plotted as fine line
		links: sankeyLinks.filter(d => d.value != 0)
	};
	
	
}

export function arraySum(array, sumAttribute){
	return array.reduce(function(prev, cur) {
		return +prev + +cur[sumAttribute];
	}, 0);
}

export function generateSankey2(data,listSourceTargetKeys, colorSankey, colorDomain, colorScale, colorDefault){
	var i,description;
	var allLinks = [];
	
	// LINKS
	// Create a list of all link (for every source / target array)
	data.forEach( d => {
		for (i=0; i<listSourceTargetKeys.length; i++) {
			description = d['Description'];
			//console.log(description);
			allLinks.push(
				{sourceName: d[listSourceTargetKeys[i].sourceKey] + listSourceTargetKeys[i].sourcePrefix, 
				 targetName: d[listSourceTargetKeys[i].targetKey] + listSourceTargetKeys[i].targetPrefix,
				 description: description
				}
			);
		}
	});
	
	//console.log('allLinks',allLinks);
	
	// Reduce the array counting the unique values
	var item = {};
	var sankeyLinks = allLinks.reduce( (acc,c) => {
		item = acc[acc.findIndex( d => { 
					return _.isEqual(_.omit(d, ['value','descriptionList']),_.omit(c, ['description']) );
				})
			  ] 
				|| 
				acc[ acc.push({sourceName:c.sourceName, targetName: c.targetName , value:0, descriptionList:''})-1] ;
		
		item.value++;
		item.descriptionList += c.description + '\n';
		return (item, acc);
	}
	,[]) ;
	
	
	//SIMPLE VERSION
	/*
	var sankeyLinks = allLinks.reduce( (acc,c) => (
			( acc[acc.findIndex( d => { 
					return _.isEqual(_.omit(d, 'value'),c);
				})
			  ] 
				|| 
				acc[ acc.push({sourceName:c.sourceName, targetName: c.targetName , value:0})-1]  
			).value++, acc)
	,[]) ;
	*/
	
	//console.log('sankeyLinks',sankeyLinks);
	
	// NODES
	var nodeList = [];
	// Collect all name
	sankeyLinks.forEach(d => {
		nodeList.push(d.sourceName);
		nodeList.push(d.targetName);
	});
	// Compute unique list
	var uniqueNodes = [...new Set(nodeList)];
	//console.log('uniqueNodes',uniqueNodes);
	
	// Create final list
	var sankeyNodes = uniqueNodes.map( (d) => { return {name: d} });

	// LINKS 
	// add unique ID of source and target
	
	sankeyLinks.forEach(d => {
		d.source = uniqueNodes.indexOf(d.sourceName) ;
		d.target = uniqueNodes.indexOf(d.targetName) ;
		
		//TBD : mieux généraliser pour autres usages ?
		var linkColor = colorSankey(d.sourceName,colorDomain, colorScale) ;
		var linkColorTarget = colorSankey('target:'+d.targetName,colorDomain, colorScale) ;
		
		// first check if there is a color rule on the source Name
		if (linkColor != colorDefault){
			d.color = linkColor;
		}
		// if not check if there is a color rule on the starget Name
		else if (linkColorTarget != colorDefault){
			d.color = linkColorTarget;
		}
		else{
			d.color = colorDefault ;
			//console.log(d.targetName);
		}

	});

	
	return {
		nodes: sankeyNodes, 
		links: sankeyLinks
	};
	
}

export function generateSelectOption(itemArray){

	return itemArray.map( (d,i) => {
		return (
			<option key={i} value={d}>{d}</option>
		)
	});
}