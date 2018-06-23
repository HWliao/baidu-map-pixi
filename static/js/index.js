var map = new BMap.Map('allmap');
map.centerAndZoom(new BMap.Point(116.3964, 39.9093), 10);
map.enableScrollWheelZoom();
var customLayerOverlay = new CustomLayerOverlay();
map.addOverlay(customLayerOverlay);

//var pointCollection = new BMap.PointCollection([], {
//  size: BMAP_POINT_SIZE_SMALL,
//  shape: BMAP_POINT_SHAPE_STAR,
//  color: '#d340c3'
//});
//map.addOverlay(pointCollection);
