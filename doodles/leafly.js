var map = L.map('map').setView([44.9833, -93.2667], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var geos = CD5.features;

geos.forEach(addFeature);


function addFeature(element, index, arr) {
    console.log(index);
    L.geoJson(
	element,
	{
	    style: randomStyle
	}
    ).addTo(map);
}

function randomStyle(){
    return {
	"color" : "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
	"weight" : 1,
	"opacity" : 1
    };
}
