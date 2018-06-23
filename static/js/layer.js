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
    // 百度地图原有海量点所在地图面板为mapPane
    this._map.getPanes().mapPane.appendChild(this._app.view);
    return this._app.view;
  };

  CustomLayerOverlay.prototype.draw = function () {
    // 画布尺寸重置
    this.resetSize();
    // 画布位置重置
    this.resetPosition();
    // 画布重新绘制
    this.render();
  };

  /**
   * 渲染
   */
  CustomLayerOverlay.prototype.render = function () {
    if (!this.isAppValid()) return;

    if (this._particleContainer) {
      // 去除上一个粒子容器
      this._app.stage.removeChild(this._particleContainer);
    }
    // 添加新的粒子容器
    var texture = PIXI.Texture.fromImage('static/images/markers.png');
    texture.frame = new PIXI.Rectangle(0, 0, 28, 31);

    this._particleContainer = new PIXI.Container();
    for (var i = 0; i < 5000; i++) {
      var sprite = new PIXI.Sprite(texture);
      sprite.interactive = true;
      sprite.buttonMode = true;
      sprite.on('click', this.dealEvent.bind(this));
      sprite.on('mouseover', this.dealEvent.bind(this));
      sprite.on('mouseout', this.dealEvent.bind(this));
      sprite.x = Math.random() * this._app.screen.width;
      sprite.y = Math.random() * this._app.screen.height;
      sprite.tint = Math.random() * 0xE8D4CD;
      this._particleContainer.addChild(sprite);
    }
    this._app.stage.addChild(this._particleContainer);
  };
  /**
   * app大小重置
   */
  CustomLayerOverlay.prototype.resetSize = function () {
    if (!this.isAppValid()) return;

    var size = this.getContainerSize();
    var app = this._app;
    if (app.screen.width !== size.width || app.screen.height !== size.height) {
      app.renderer.resize(size.width, size.height);
    }
  };
  /**
   * app位置重置
   */
  CustomLayerOverlay.prototype.resetPosition = function () {
    if (!this.isAppValid()) return;

    var mapConstainer = this._map.getContainer();
    var view = this._app.view;

    // 观察百度地图dom结构发现有一个BMap_mask的div不会随着拖动而移动
    // 取他的偏移量作为app view的偏移量,使得app view 不会被拖动
    var maskDiv = mapConstainer.querySelector('.BMap_mask');
    if (view.offsetTop !== maskDiv.offsetTop || view.offsetLeft !== maskDiv.offsetLeft) {
      view.style.top = maskDiv.offsetTop + 'px';
      view.style.left = maskDiv.offsetLeft + 'px';
    }
    // !!这里还可以使用relative的偏移量方式,可以不依赖BMap内部dom结构
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
    canvasView.style.top = 0;
    canvasView.style.left = 0;
    canvasView.style['user-select'] = 'none';
    return app;
  };
  /**
   * 获取地图容器尺寸
   */
  CustomLayerOverlay.prototype.getContainerSize = function () {
    return this._map.getSize();
  };

  /**
   * pixi app是否有效
   */
  CustomLayerOverlay.prototype.isAppValid = function () {
    return !!this._app;
  };

  /**
   * 处理事件
   * @param e
   */
  CustomLayerOverlay.prototype.dealEvent = function (e) {
    console.log(e);
  }
})();