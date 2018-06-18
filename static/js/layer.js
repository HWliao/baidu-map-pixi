(function () {
  'use strict';
  window.CustomLayerOverlay = CustomLayerOverlay;

  /**
   * 自定义覆盖物
   * @constructor
   */
  function CustomLayerOverlay() {
  }

  CustomLayerOverlay.prototype = new BMap.Overlay();
  /**
   * 自定义覆盖物,初始化方法.
   */
  CustomLayerOverlay.prototype.initialize = function (map) {
    this._map = map;
    this._app = this.createPIXIApp();
    this._map.getPanes().labelPane.appendChild(this._app.view);
    this.render();
    return this._app.view;
  };

  CustomLayerOverlay.prototype.draw = function () {
    // 画布尺寸重置
    // 画布位置重置
    // 画布重新绘制
  };

  CustomLayerOverlay.prototype.render = function () {
    var app = this._app;
    var bunny = PIXI.Sprite.fromImage('static/images/markers.png');

    bunny.anchor.set(0.5);

    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    app.stage.addChild(bunny);

    app.ticker.add(function (delta) {
      bunny.rotation += 0.1 * delta;
    });
  };

  /**
   * 创建app
   * @returns {*}
   */
  CustomLayerOverlay.prototype.createPIXIApp = function () {
    var size = this.getContainerSize();
    var app = new PIXI.Application({
      // 透明背景
      transparent: true,
      width: size.width,
      height: size.height
    });
    var canvasView = app.view;
    canvasView.style.position = 'absolute';
    canvasView.style.top = '0px';
    canvasView.style.left = '0px';
    canvasView.style['user-select'] = 'none';
    return app;
  };
  /**
   * 获取地图容器尺寸
   */
  CustomLayerOverlay.prototype.getContainerSize = function () {
    var container = this._map.getContainer();
    var width = container.clientWidth;
    var height = container.clientHeight;
    return {
      width: width,
      height: height
    };
  }
})();