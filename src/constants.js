import {scaleOrdinal} from 'd3-scale';

export const std_chartprops = {
	height: 300,
	width: 300,
	margin: {left: 50, right: 10, top: 10, bottom: 50} 
};

export const meteo_chartprops = {
	height: 200,
	width: 400,
	margin: {left: 30, right: 50, top: 10, bottom: 50} 
};

export const meteoCompare_chartprops = {
	height: 400,
	width: 600,
	margin: {left: 30, right: 50, top: 10, bottom: 50} 
};

export const custom_chartprops = {
	height: 400,
	width: 400,
	margin: {left: 70, right: 30, top: 10, bottom: 70} 
}

export const smallSaneky_chartprops = {
	height: 250,
	width: 300,
	margin: {left: 10, right: 10, top: 10, bottom: 10} 
}

export const large_chartprops = {
	height: 500,
	width: 100,
	margin: {left: 20, right: 20, top: 20, bottom: 20} 
};

export const marginleft_chartprops = {
	height: 500,
	width: 900,
	margin: {left: 200, right: 80, top: 20, bottom: 80} 
};

export const sankey_chartprops = {
	height: 400,
	width: 600,
	margin: {left: 10, right: 10, top: 10, bottom: 10} 
};

export const large_sankey_chartprops = {
	height: 550,
	width: 980,
	margin: {left: 0, right: 0, top: 10, bottom: 10} 
};

export const colorProps = {
	colorType:"category", 
	colorRange:["#79C7E3","#95C11F"],
	stroke:"white"
};

export const colorArray = ["#79C7E3","#95C11F"];

export const niveauDiplomeINSEE = ["Diplome du supérieur", "Niveau BEP", "Niveau Baccalaureat",  "Aucun ou BEPC"];
export const secteurINSEE = ['Agriculture', 'Construction', 'Industrie', 'Tertiaire marchand', "Tertiaire non marchand"];
export const DepartementsPSN = ['Yvelines',"Val-d'Oise",'Hauts-de-Seine','Seine-Saint-Denis','Paris','Seine-Maritime','Eure','Calvados','Manche'];
export const departement_PSN_num = [78,95,92,93,75,76,27,14,50];
export const departement_PSN = ['78','95','92','93','75','76','27','14','50'];
export const IDstationsMeteoPSN = [7020,7027,7139,7037,7149];
export	const month = ['Janvier','Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export	const monthNum = ['01','02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export const IDregionPSN = ['11','28'];

export const colorDomainSankeyData = ['Tissu économique', 'Transport et logistique', 'Tourisme', 'Environnement et Energie','Foncier','target:2018','target:2017'];
export const colorScaleSankeyData = scaleOrdinal()
			.domain(colorDomainSankeyData)
			.range(['#95C11F','#F7A600','#919188', '#0080C9' ,"#d55d5d",'#ff9966','#ff9966','#ff9966']);

export const sourceLinkMeteo = {
	label: 'Source : Météo France - 2016',
	link: 'https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=115&id_rubrique=38'
};

export const ventsCategories = ['seriesVentsMax', 'seriesVentsMin', 'seriesVentsMean'];
export const precipitationsCategories = ['seriesHumidMean', 'seriesPrecipSum'];