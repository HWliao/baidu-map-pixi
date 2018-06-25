(function () {
  'use strict';
  window.CustomLayerOverlay = CustomLayerOverlay;
  // 默认配置
  var theOptions = {
    url: '',
    // 获取坐标点配置集合
    getPoints: function () {
    }
  };
  // 默认坐标点配置
  var pointOptions = {};

  /**
   * 自定义绘制覆盖物
   * @constructor
   */
  function CustomLayerOverlay(options) {
    // 配置
    this._options = Object.assign({}, theOptions, options);
    // 事件列表
    this._events = {};
    // 分辨率/设备像素比率 retina屏幕上为2
    this._resolution = 1;
    // 是否已经加载资源
    this._isLoaded = false;
    // 纹理贴图
    this._resources = {};
    // 图标容器(精灵容器)
    this._container = null;
    // 事件处理函数,这个比较特殊
    var that = this;
    this.handleEvent = function (e) {
      var sprite = this;
      that.dealEvent(e, sprite);
    };
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
    // 加载资源(纹理贴图集)
    this._app.loader.add(this._options.url).load(this.setup.bind(this));
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
    // pixi app 无效
    if (!this.isAppValid()) return;
    // 资源未加载
    if (!this.isLoad()) return;

    if (this._container) {
      // 去除上一个精灵容器
      this._app.stage.removeChild(this._container);
    }

    // 坐标点获取
    if (!this._options.getPoints || typeof this._options.getPoints !== 'function') {
      throw new Error('options getPoints must be function!!');
    }
    // 待显示坐标点
    var points = this._options.getPoints() || [];
    // 地图当前可视区域
    var bounds = this._map.getBounds();

    // 添加精灵容器
    this._container = new PIXI.Container();
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      // 该坐标点不在当前坐标区域内,跳过
      if (!bounds.containsPoint(point)) continue;
      // 地理坐标转化为像素坐标
      var pixel = this._map.pointToPixel(point);

      // 创建精灵 pixi概念 代表显示元素
      var sprite = new PIXI.Sprite(this._resources.marker.texture);
      sprite.interactive = true;
      sprite.buttonMode = true;
      sprite.anchor.set(this._resources.marker.anchor.x, this._resources.marker.anchor.y);
      sprite.on('click', this.handleEvent);
      sprite.on('mouseover', this.handleEvent);
      sprite.on('mouseout', this.handleEvent);
      sprite.x = pixel.x;
      sprite.y = pixel.y;
      sprite.point = point;
      this._container.addChild(sprite);
    }
    this._app.stage.addChild(this._container);
  };
  CustomLayerOverlay.prototype.dealEvent = function (e, sprite) {
    if (sprite && e && e.type === 'mouseover') {
      sprite.texture = this._resources.hover.texture;
      var childs = this._container.children;
      var lastChild = childs[childs.length - 1];
      this._container.swapChildren(sprite, lastChild);
    } else if (sprite && e && e.type === 'mouseout') {
      sprite.texture = this._resources.marker.texture;
    } else if (e && e.type === 'click') {
      console.log(sprite.point);
    }
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
      // 分辨率比率
      resolution: this._resolution || 1,
      width: size.width,
      height: size.height
    });
    var canvasView = app.view;
    canvasView.style.position = 'absolute';
    canvasView.style.top = 0 + 'px';
    canvasView.style.left = 0 + 'px';
    canvasView.style['user-select'] = 'none';
    return app;
  };
  /**
   * 资源加载完成,设置应用
   */
  CustomLayerOverlay.prototype.setup = function () {
    this._isLoaded = true;
    // 是否在高分辨率比率屏幕上
    var isRetina = this._resolution > 1;
    var markerKey = !isRetina ? 'marker.png' : 'marker@2x.png';
    var markerHoverKey = !isRetina ? 'marker_hover.png' : 'marker_hover@2x.png';

    var markerAnchor = !isRetina ? { x: 0.5, y: 0.9 } : { x: 0.5, y: 0.9 };
    var markerHoverAnchor = !isRetina ? { x: 0.5, y: 0.9 } : { x: 0.5, y: 0.9 };

    // 标注纹理
    this._resources.marker = {
      texture: PIXI.TextureCache[markerKey],
      anchor: markerAnchor
    };
    // 标注hover状态纹理
    this._resources.hover = {
      texture: PIXI.TextureCache[markerHoverKey],
      anchor: markerHoverAnchor
    };

    // 渲染
    this.render();
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
   * 是否已经加载资源
   */
  CustomLayerOverlay.prototype.isLoad = function () {
    return this._isLoaded;
  };
})();