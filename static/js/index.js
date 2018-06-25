var map = new BMap.Map('allmap');
map.centerAndZoom(new BMap.Point(116.3964, 39.9093), 10);
map.enableScrollWheelZoom();
var points = [];

for (var i = 0; i < data.data.length; i++) {
  points.push(new BMap.Point(data.data[i][0], data.data[i][1]));
}

var customLayerOverlay = new CustomLayerOverlay({
  url: 'static/images/markers/markers.json',
  getPoints: function () {
    return points;
  }
});
map.addOverlay(customLayerOverlay);

customLayerOverlay.on(CustomLayerOverlay.EVENT_CLICK, function () {
  console.log('click');
  console.log(arguments);
});
customLayerOverlay.on(CustomLayerOverlay.EVENT_MOUSEOVER, function () {
  console.log('mouseover');
  console.log(arguments);
});
customLayerOverlay.on(CustomLayerOverlay.EVENT_MOUSEOUT, function () {
  console.log('mouseout');
  console.log(arguments);
});
//var pointCollection = new BMap.PointCollection([], {
//  size: BMAP_POINT_SIZE_SMALL,
//  shape: BMAP_POINT_SHAPE_STAR,
//  color: '#d340c3'
//});
//map.addOverlay(pointCollection);
