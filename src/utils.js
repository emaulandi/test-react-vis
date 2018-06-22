import {
	secteurINSEE,
	departement_PSN_num,
	departement_PSN
} from './constants';





export function cleanDataEmploi(data) {
	
	// From crosstab to list
	var secteur = ['Agriculture', 'Construction', 'Industrie', 'Tertiaire marchand', "Tertiaire non marchand"];
	var listData = [];
	
	//console.log(data[4]);
	
	data.forEach( d => {
		//d.Emploi = +d.Emploi;
		var datum = [];
		var i;
		
		for (i= 0; i<secteur.length ; i++) {
			datum.Departement = d['Departement'].slice(3);
			datum.Secteur = secteur[i];
			//convert to number
			datum.Emploi = +d[secteur[i]];
			listData.push(datum);
			datum = [];
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
		
		
		//Compute hotel nights by population
		d.nuitees_population = d.Hotel_tourisme_total_nuitees_milliers / d.pop2018;
		
		
	});
	
	return data;

}

export function generateItemsScatterplot(data, xAttribute, yAttribute, sizeAttribute) {

	return data.map(row => {
		return {
			x: row[xAttribute], 
			y: row[yAttribute] , 
			size: row[sizeAttribute]
			
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

function isPSNdep(codeDep) {
	
	var isPSN = false ;
	var i;
	
	for (i=0; i< departement_PSN_num.length; i++) {
		if ( codeDep === departement_PSN_num[i] ) { isPSN = true ; break ;}
	}

	return isPSN;
}

function isPSN(codeCommune) {
	var isPSN = false ;
	var i;
	
	for (i=0; i< departement_PSN.length; i++) {
		if ( codeCommune.indexOf(departement_PSN[i]) === 0) { isPSN = true ; break ;}
	}
	
	// if ( codeCommune.indexOf(departement_PSN[0]) == 0) { isPSN = true ; }
	
	return isPSN;
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
