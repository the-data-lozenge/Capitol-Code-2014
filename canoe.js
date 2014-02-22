//map 

var map = L.map('map').setView([48.000, -91.200], 10);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var geos = boundary.features;

geos.forEach(addBoundary);

function addBoundary(element, index, arr) {
    console.log(index);
    L.geoJson(
	element,
	{
	    style: {
			"color" : "#357EDD",
			"weight" : 1,
			"opacity" : 1
		}
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

function makeClicky(feature,layer){
	//layer.bindPopup(feature.properties.description);
	layer.on("mouseover", function() {layer.setStyle({"weight":5}) ;});
	layer.on("mouseout", function() {layer.setStyle({"weight":1}) ;});
}