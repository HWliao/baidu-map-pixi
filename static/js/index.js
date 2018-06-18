var map = new BMap.Map('allmap');
map.centerAndZoom(new BMap.Point(116.3964, 39.9093), 10);
map.enableScrollWheelZoom();
var customLayerOverlay = new CustomLayerOverlay();
map.addOverlay(customLayerOverlay);
