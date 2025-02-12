// Initialiser la carte
var map = L.map('map', {
center: [48.111, -1.667],
zoom: 14,
attributionControl: true});

// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution('Réalisation : <a href="https://esigat.wordpress.com/" target="_blank">Master SIGAT</a> / OSM / Rennes Métropole');

// Appel du fond de carte
//L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);

// Ajouter des fonds de carte
var baselayers = {
Carto: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'),
ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
OSM: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'),
OrthoRM :L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'raster:ortho2021'}),
PlanRM :L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows', {layers: 'ref_fonds:pvci_simple_gris'})};

// Fond de carte par défaut
baselayers.Carto.addTo(map);


// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Ajouter une MiniMap

var miniMapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true, minimized: false, position: 'bottomright'}).addTo(map);

// Coordonner le fond de carte d ela MiniMap avec celui choisi par l'utilisateur
map.on('baselayerchange', function(event) {miniMapLayer.setUrl(event.layer._url);});

// RENNES 2

// Ajout Pop Up Rennes 2
var popuprennes2 = '<h1>Université Rennes 2 </h1> <br> <img src="https://static.actu.fr/uploads/2023/02/universite-rennes-2-blocage-6-fevrier-2023.jpeg" width="350px">';

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

// Définir des logos personalisés pour les marqueurs
var rennes2icone = L.icon({
iconUrl: 'https://upload.wikimedia.org/wikipedia/fr/2/23/Logo_univ-rennes2-2016.svg',
iconSize: [40, 40] });

// Ajouter des marqueurs manuels
var Rennes2 = L.marker([48.119, -1.7013], {icon: rennes2icone}).bindPopup(popuprennes2,customOptions);

// GARE

// Ajout Pop Up Gare de Rennes
var popupgare = '<h1>Gare de Rennes </h1> <br> <img src="https://www.laviedurail.com/rp/wp-content/uploads/sites/3/2019/07/23C-Rennes.jpg" width="350px">';

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

// Définir des logos personalisés pour les marqueurs
var Gareicone = L.icon({
iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Logo_des_trains_grandes_lignes.png/1200px-Logo_des_trains_grandes_lignes.png',
iconSize: [30, 30] });

// Ajouter des marqueurs manuels
var Gare = L.marker([48.103, -1.672], {icon: Gareicone}).bindPopup(popupgare,customOptions);

// Ajouter un gestionnaire d'événements pour le survol (hover)
Gare.on('mouseover', function (e) {
this.openPopup();
});

// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Gare.on('mouseout', function (e) {
this.closePopup();
});

// AJOUT DONNEES

// Ajout du cadastre en WMS
var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms',
{layers: 'CP.CadastralParcel',format: 'image/png',transparent: true, opacity : 0.5});

var Cyclable = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'trp_doux:v_voirie_amenagement_velo',format: 'image/png',transparent: true});

var Bati = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'ref_cad:batiment',format: 'image/png',transparent: true});

var Traffic = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'trp_rout:v_rva_trafic_fcd',format: 'image/png',transparent: true});


// Ajout des Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson,{
// Transformer les marqueurs en point
pointToLayer: function (geoJsonPoint, latlng) {
return L.circleMarker(latlng);
},
// Modifier la symbologie des points
style: function (geoJsonFeature) {
return {
fillColor: '#6c3548',
radius: 6,
fillOpacity: 0.7,
stroke: false};
},
}
).addTo(map);
  // Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h2> Station : "+velos.feature.properties.nom+"</h2>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
});
});


// CONTROLE DES MARQUEURS

var couches = {
  "Université Rennes 2": Rennes2,
  "Gare de Rennes" : Gare,
  "Cadastre": Cadastre,
  "Cyclable": Cyclable,
  "Bati": Bati,
  "Traffic": Traffic,
};

// Ajouter le controleur de couches
var menu1 = L.control.layers(baselayers, null, {position: 'bottomleft', collapsed : false }).addTo(map);
var menu2 = L.control.layers(null, couches, {position: 'topright', collapsed : false }).addTo(map);


// Ajouter un titre au menu1
var menu1Container = menu1.getContainer();
var title1 = document.createElement("div");
title1.innerHTML = "<b>Fond de carte</b>";
title1.style.textAlign = "center";
title1.style.padding = "5px";
title1.style.backgroundColor = "#EEC4C9"
menu1Container.insertBefore(title1, menu1Container.firstChild);

// Ajouter un titre au menu2
var menu2Container = menu2.getContainer();
var title2 = document.createElement("div");
title2.innerHTML = "<b>Couches</b>";
title2.style.textAlign = "center";
title2.style.padding = "5px";
title2.style.backgroundColor = "#EEC4C9"
menu2Container.insertBefore(title2, menu2Container.firstChild);