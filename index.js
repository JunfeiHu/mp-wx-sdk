'use strict';
const Promise = require('bluebird');

class WeChat {
  /**
   * 通过构造函数传入wx对象
   * @param {Object} wx 
   */
  constructor(wx) {
    this.wx = wx;
  }
  /**
   * 微信接口Promise化工具方法
   * 
   * @param {function} api  是  wx中的方法
   */
  promisify(api) {
    if (!this.wx) {
      throw new Error('wx对象不存在');
    }
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        if (typeof options === 'function') {
          resolve(api(options));
        } else {
          api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
        }
      });
    };
  }
  /**
   * 设置参数，并判断wx对象是否存在
   * @param {string}  fun       是  wx中的方法名称字符串
   * @param {object}  options   否  参数根据不同方法传递的不同参数
   */
  setOption(fun, options) {
    if (!this.wx) {
      throw new Error('wx对象不存在');
    }
    if (options) {
      return this.promisify(this.wx[fun])(options);
    } else {
      return this.promisify(this.wx[fun])();
    }
  }
  /**
   * 微信登录
   *
   * @param {object}  options   timeout   {number}    否  超时时间，单位ms
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "login:ok"
   *                            code      {string}        用户登录凭证（有效期五分钟）。需要在服务器后台调用 auth.code2Session，使用 code 换取 openid 和 session_key 等信息
   */
  async login(options) {
    return this.setOption('login', options);
  }

  /**
   * 微信获取用户信息
   *
   * @param {object}  options   withCredentials  {boolean}    否  是否带上登录态信息。当 withCredentials 为 true 时，要求此前有调用过 wx.login 且登录态尚未过期，
   *                                                              此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，
   *                                                              不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。
   *                            lang      {string}    否  默认值:en  显示用户信息的语言
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "getUserInfo:ok"
   *                            code      {string}        用户登录凭证（有效期五分钟）。需要在服务器后台调用 auth.code2Session，使用 code 换取 openid 和 session_key 等信息
   */
  async getUserInfo(options) {
    return this.setOption('getUserInfo', options);
  }

  /**
   * 发起授权请求
   *
   * @param {object}  options   scope     {string}    是  需要获取权限的 scope
   *                                                      scope授权列表
   *                                                      scope.userInfo          wx.getUserInfo                      用户信息
   *                                                      scope.userLocation      wx.getLocation, wx.chooseLocation   地理位置
   *                                                      scope.address           wx.chooseAddress                    通讯地址
   *                                                      scope.invoiceTitle      wx.chooseInvoiceTitle               发票抬头
   *                                                      scope.invoice           wx.chooseInvoice                    获取发票
   *                                                      scope.werun             wx.getWeRunData                     微信运动步数
   *                                                      scope.record            wx.startRecord                      录音功能
   *                                                      scope.writePhotosAlbum  wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum  保存到相册
   *                                                      scope.camera            <camera /> 组件                     摄像头
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "getSetting:ok"
   */
  async authorize(options) {
    return this.setOption('authorize', options);
  }

  /**
   * 获取授权信息
   *
   * @param {object}  options   complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "getSetting:ok"
   */
  async getSetting(options) {
    return this.setOption('getSetting', options);
  }

  /**
   * 检查登录态是否过期
   *
   * @param {object}  options   complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "checkSession:ok"
   */
  async checkSession(options) {
    return this.setOption('checkSession', options);
  }
  /**
   * 获取系统信息
   *
   * @param {object}  options   complete              {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg                        {string}        "getSystemInfo:ok"
   *                    brand                         {string}        设备品牌
   *                    model                         {string}        设备型号
   *                    pixelRatio                    {number}        设备像素比
   *                    screenWidth                   {number}        屏幕宽度，单位px
   *                    screenHeight                  {number}        屏幕高度，单位px
   *                    windowWidth                   {number}        可使用窗口宽度，单位px
   *                    windowHeight                  {number}        可使用窗口高度，单位px
   *                    statusBarHeight               {number}        状态栏的高度，单位px
   *                    language                      {string}        微信设置的语言
   *                    version                       {string}        微信版本号
   *                    system                        {string}        操作系统及版本
   *                    platform                      {string}        客户端平台
   *                    fontSizeSetting               {number}        用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准
   *                    SDKVersion                    {string}        客户端基础库版本
   *                    benchmarkLevel                {number}        设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50）
   *                    albumAuthorized               {boolean}       允许微信使用相册的开关（仅 iOS 有效）
   *                    cameraAuthorized              {boolean}       允许微信使用摄像头的开关
   *                    locationAuthorized            {boolean}       允许微信使用定位的开关
   *                    microphoneAuthorized          {boolean}       允许微信使用麦克风的开关
   *                    notificationAuthorized        {boolean}       允许微信通知的开关
   *                    notificationAlertAuthorized   {boolean}       允许微信通知带有提醒的开关（仅 iOS 有效）
   *                    notificationBadgeAuthorized   {boolean}       允许微信通知带有标记的开关（仅 iOS 有效）
   *                    notificationSoundAuthorized   {boolean}       允许微信通知带有声音的开关（仅 iOS 有效）
   *                    bluetoothEnabled              {boolean}       蓝牙的系统开关
   *                    locationEnabled               {boolean}       地理位置的系统开关
   *                    wifiEnabled                   {boolean}       Wi-Fi 的系统开关
   */
  async getSystemInfo(options) {
    return this.setOption('getSystemInfo', options);
  }
  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   *
   * @param {object}  options   url       {string}    是  需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数。
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "switchTab:ok"
   */
  async switchTab(options) {
    return this.setOption('switchTab', options);
  }
  /**
   * 关闭所有页面，打开到应用内的某个页面
   *
   * @param {object}  options   url       {string}    是  需要跳转的应用内页面路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "reLaunch:ok"
   */
  async reLaunch(options) {
    return this.setOption('reLaunch', options);
  }
  /**
   * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
   *
   * @param {object}  options   url       {string}    是  需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 ? 分隔，参数键与参数值用 = 相连，不同参数用 & 分隔；如 'path?key=value&key2=value2'
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "redirectTo:ok"
   */
  async redirectTo(options) {
    return this.setOption('redirectTo', options);
  }
  /**
   * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 this.wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
   *
   * @param {object}  options   url       {string}    是  需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 ? 分隔，参数键与参数值用 = 相连，不同参数用 & 分隔；如 'path?key=value&key2=value2'
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "navigateTo:ok"
   */
  async navigateTo(options) {
    return this.setOption('navigateTo', options);
  }
  /**
   * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
   *
   * @param {object}  options   delta     {number}    是  返回的页面数，如果 delta 大于现有页面数，则返回到首页。
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "navigateBack:ok"
   */
  async navigateBack(options) {
    return this.setOption('navigateBack', options);
  }
  /**
   * 显示消息提示框
   *
   * @param {object}  options   title     {string}    是  提示的内容
   *                            icon      {string}    否  默认值： 'success'  图标
   *                                                      （可选值为：'success' 显示成功图标，'loading' 显示加载图标，此时 title 文本最多显示 7 个汉字长度；'none' 不显示图标，此时 title 文本最多可显示两行）
   *                            image     {string}    否  自定义图标的本地路径，image 的优先级高于 icon
   *                            duration  {number}    否  默认值： 1500   提示的延迟时间  
   *                            mask      {boolean}   否  默认值： false  是否显示透明蒙层，防止触摸穿透  
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "showToast:ok"
   */
  async showToast(options) {
    return this.setOption('showToast', options);
  }
  /**
   * 隐藏消息提示框
   *
   * @param {object}  options   complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "hideToast:ok"
   */
  async hideToast(options) {
    return this.setOption('hideToast', options);
  }
  /**
   * 显示模态对话框
   *
   * @param {object}  options   title         {string}    是  提示的内容
   *                            content       {string}    是  提示的内容
   *                            showCancel    {boolean}   否  默认值： true     是否显示取消按钮
   *                            cancelText    {string}    否  默认值： '取消'   取消按钮的文字，最多 4 个字符
   *                            cancelColor   {string}    否  默认值： #000000  取消按钮的文字颜色，必须是 16 进制格式的颜色字符串
   *                            confirmText   {string}    否  默认值： '确定'   确认按钮的文字，最多 4 个字符
   *                            confirmColor  {string}    否  默认值： #576B95  确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
   *                            complete      {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg        {string}        "showModal:ok"
   *                            cancel        {boolean}       为true表示点击了取消
   *                            confirm       {boolean}       为true表示点击了确定
   */
  async showModal(options) {
    return this.setOption('showModal', options);
  }
  /**
   * 显示 loading 提示框。需主动调用 hideLoading 才能关闭提示框
   * 注意：  showLoading 和 showToast 同时只能显示一个
   *         showLoading 应与 hideLoading 配对使用
   *
   * @param {object}  options   title     {string}    是  提示的内容
   *                            mask      {boolean}   否  默认值： false  是否显示透明蒙层，防止触摸穿透
   *                            complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "showLoading:ok"
   */
  async showLoading(options) {
    return this.setOption('showLoading', options);
  }
  /**
   * 隐藏 loading 提示框
   *
   * @param {object}  options   complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}        "hideLoading:ok"
   */
  async hideLoading(options) {
    return this.setOption('hideLoading', options);
  }
  /**
   * 显示操作菜单
   *
   * @param {object}  options   itemList  {Array.<string>}  是  按钮的文字数组，数组长度最大为 6
   *                            itemColor {string}          否  默认值： #000000 按钮的文字颜色
   *                            complete  {function}        否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}              "showActionSheet:ok"
   *                            tapIndex  {number}              用户点击的按钮序号，从上到下的顺序，从0开始
   */
  async showActionSheet(options) {
    return this.setOption('showActionSheet', options);
  }
  /**
   * 在当前页面显示导航条加载动画
   *
   * @param {object}  options   complete  {function}        否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}              "showNavigationBarLoading:ok"
   */
  async showNavigationBarLoading(options) {
    return this.setOption('showNavigationBarLoading', options);
  }
  /**
   * 在当前页面隐藏导航条加载动画
   *
   * @param {object}  options   complete  {function}        否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}              "hideNavigationBarLoading:ok"
   */
  async hideNavigationBarLoading(options) {
    return this.setOption('hideNavigationBarLoading', options);
  }
  /**
   * 动态设置当前页面的标题
   *
   * @param {object}  options   title     {string}          是  页面标题
   *                            complete  {function}        否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg    {string}              "setNavigationBarTitle:ok"
   */
  async setNavigationBarTitle(options) {
    return this.setOption('setNavigationBarTitle', options);
  }
  /**
   * 动态设置当前页面的标题
   *
   * @param {object}  options   frontColor      {string}    是  前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
   *                            backgroundColor {string}    是  背景颜色值，有效值为十六进制颜色
   *                            animation       {Object}    否  动画效果
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   *                  options.animation 结构
   *                            duration        {number}    否  默认值： 0         动画变化时间，单位 ms
   *                            timingFunc      {string}    否  默认值： 'linear'  动画变化方式（可选值为：'linear':动画从头到尾的速度是相同的；'easeIn':动画以低速开始；'easeOut':动画以低速结束；'easeInOut':动画以低速开始和结束）
   * @returns {Promise}         errMsg          {string}        "setNavigationBarColor:ok"
   */
  async setNavigationBarColor(options) {
    return this.setOption('setNavigationBarColor', options);
  }
  /**
   * 动态设置下拉背景字体、loading 图的样式
   *
   * @param {object}  options   textStyle       {string}    是  下拉背景字体、loading 图的样式（可选值为：'dark':dark 样式；'light':light 样式）。
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "setBackgroundTextStyle:ok"
   */
  async setBackgroundTextStyle(options) {
    return this.setOption('setBackgroundTextStyle', options);
  }
  /**
   * 显示 tabBar 某一项的右上角的红点
   *
   * @param {object}  options   index           {number}    是  tabBar 的哪一项，从左边算起，从0开始
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "showTabBarRedDot:ok"
   */
  async showTabBarRedDot(options) {
    return this.setOption('showTabBarRedDot', options);
  }
  /**
   * 动态加载网络字体。文件地址需为下载类型。iOS 仅支持 https 格式文件地址。
   * 注意：
   *    1、引入中文字体，体积过大时会发生错误，建议抽离出部分中文，减少体积，或者用图片替代
   *    2、字体链接必须是https（ios不支持http)
   *    3、字体链接必须是同源下的，或开启了cors支持，小程序的域名是servicewechat.com
   *    4、canvas等原生组件不支持使用接口添加的字体
   *    5、工具里提示 Faild to load font可以忽略
   *
   * @param {object}  options   family          {string}    是  定义的字体名称
   *                            source          {string}    是  字体资源的地址。建议格式为 TTF 和 WOFF，WOFF2 在低版本的iOS上会不兼容。
   *                            desc            {Object}    否  可选的字体描述符
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   *                  options.desc 结构
   *                            style           {string}    否  默认值： 'normal'  字体样式（可选值为 normal / italic / oblique）
   *                            weight          {string}    否  默认值： 'normal'  字体粗细（可选值为 normal / bold / 100 / 200../ 900）
   *                            variant         {string}    否  默认值： 'normal'  设置小型大写字母的字体显示文本（可选值为 normal / small-caps / inherit）
   * @returns {Promise}
   */
  async loadFontFace(options) {
    return this.setOption('loadFontFace', options);
  }
  /**
   * 停止当前页面下拉刷新。
   *
   * @param {object}  options   complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "stopPullDownRefresh:ok"
   */
  async stopPullDownRefresh(options) {
    return this.setOption('stopPullDownRefresh', options);
  }
  /**
   * 将页面滚动到目标位置
   *
   * @param {object}  options   scrollTop       {number}    是  滚动到页面的目标位置，单位 px
   *                            duration        {number}    否  默认值： 300  滚动动画的时长，单位 ms
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "pageScrollTo:ok"
   */
  async pageScrollTo(options) {
    return this.setOption('pageScrollTo', options);
  }
  /**
   * 动态设置置顶栏文字内容。只有当前小程序被置顶时能生效，如果当前小程序没有被置顶，也能调用成功，
   * 但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容.
   * 注意：
   *    调用成功后，需间隔 5s 才能再次调用此接口，如果在 5s 内再次调用此接口，会回调 fail，errMsg："setTopBarText: fail invoke too frequently"
   *
   * @param {object}  options   text            {string}    是  置顶栏文字
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "setTopBarText:ok"
   */
  async setTopBarText(options) {
    return this.setOption('setTopBarText', options);
  }
  /**
   * 延迟一部分操作到下一个时间片再执行。（类似于 setTimeout）
   * 说明：
   *    因为自定义组件中的 setData 和 triggerEvent 等接口本身是同步的操作，当这几个接口被连续调用时，都是在一个同步流程中执行完的，因此若逻辑不当可能会导致出错。
   *    一个极端的案例：当父组件的 setData 引发了子组件的 triggerEvent，进而使得父组件又进行了一次 setData，期间有通过 wx:if 语句对子组件进行卸载，就有可能引发奇怪的错误，所以对于不需要在一个同步流程内完成的逻辑，可以使用此接口延迟到下一个时间片再执行。
   *
   * @param {function}  options   回调函数（在当前同步流程结束后，下一个时间片执行）
   * @returns {Promise}
   */
  async nextTick(options) {
    return this.setOption('nextTick', options);
  }
  /**
   * 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
   *
   * @returns {Promise}         errMsg    {string}        "getMenuButtonBoundingClientRect:ok"
   *                            width     {number}        宽度，单位：px
   *                            height    {number}        高度，单位：px
   *                            top       {number}        上边界坐标，单位：px
   *                            right     {number}        右边界坐标，单位：px
   *                            bottom    {number}        下边界坐标，单位：px
   *                            left      {number}        左边界坐标，单位：px
   */
  async getMenuButtonBoundingClientRect() {
    return this.setOption('getMenuButtonBoundingClientRect');
  }
  /**
   * 监听窗口尺寸变化事件
   *
   * @param {function}  options   窗口尺寸变化事件的回调函数
   * @returns {Promise}         errMsg        {string}    "getMenuButtonBoundingClientRect:ok"
   *                            size          {Object}    窗口尺寸
   *                            windowWidth   {number}    变化后的窗口宽度，单位 px
   *                            windowHeight  {number}    变化后的窗口高度，单位 px
   */
  async onWindowResize(options) {
    return this.setOption('onWindowResize', options);
  }
  /**
   * 取消监听窗口尺寸变化事件
   *
   * @param {function}  options   窗口尺寸变化事件的回调函数
   * @returns {Promise}
   */
  async offWindowResize(options) {
    return this.setOption('offWindowResize', options);
  }
  /**
   * 发起 HTTPS 网络请求
   * 注意：
   *    配置流程
   *      1、域名只支持 https (wx.request、wx.uploadFile、wx.downloadFile) 和 wss (wx.connectSocket) 协议；
   *      2、域名不能使用 IP 地址或 localhost；
   *      3、可以配置端口，如 https://myserver.com:8080，但是配置后只能向 https://myserver.com:8080 发起请求。如果向 https://myserver.com、https://myserver.com:9091 等 URL 请求则会失败。
   *      4、如果不配置端口。如 https://myserver.com，那么请求的 URL 中也不能包含端口，甚至是默认的 443 端口也不可以。如果向 https://myserver.com:443 请求则会失败。
   *      5、域名必须经过 ICP 备案；
   *      6、出于安全考虑，api.weixin.qq.com 不能被配置为服务器域名，相关API也不能在小程序内调用。 应将 AppSecret 保存到后台服务器中，通过服务器使用 getAccessToken 接口获取 access_token，并调用相关 API；
   *      7、对于每个接口，分别可以配置最多 20 个域名
   *    超时时间
   *      1、默认超时时间和最大超时时间都是 60s；
   *      2、超时时间可以在 app.json 或 game.json 中通过 networktimeout 配置。
   *    使用限制
   *      1、网络请求的 referer header 不可设置。其格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为工具，其余为正式版本；
   *      2、wx.request、wx.uploadFile、wx.downloadFile 的最大并发限制是 10 个；
   *      3、小程序进入后台运行后（非置顶聊天），如果 5s 内网络请求没有结束，会回调错误信息 fail interrupted；在回到前台之前，网络请求接口调用都会无法调用。
   *    返回值编码
   *      1、建议服务器返回值使用 UTF-8 编码。对于非 UTF-8 编码，小程序会尝试进行转换，但是会有转换失败的可能。
   *      2、小程序会自动对 BOM 头进行过滤（只过滤一个BOM头）。
   *    回调函数
   *      1、只要成功接收到服务器返回，无论 statusCode 是多少，都会进入 success 回调。请根据业务逻辑对返回值进行判断。
   *    data 参数说明
   *      最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
   *      1、对于 GET 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
   *      2、对于 POST 方法且 header['content-type'] 为 application/json 的数据，会对数据进行 JSON 序列化
   *      3、对于 POST 方法且 header['content-type'] 为 application/x-www-form-urlencoded 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
   *
   * @param {object}  options   url             {string}    是  服务器接口地址  
   *                            data            {string/object/ArrayBuffer}    否  请求的参数  
   *                            header          {Object}    否  设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
   *                            method          {string}    否  默认值： GET   HTTP 请求方法（可选值：OPTIONS / GET / HEAD / POST / PUT / DELETE / TRACE / CONNECT）
   *                            dataType        {string}    否  默认值： json  返回的数据格式（可选值：json 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse；其他 不对返回的内容进行 JSON.parse）
   *                            responseType    {string}    否  默认值： text  响应的数据类型（可选值：text  响应的数据为文本；arraybuffer 响应的数据为 ArrayBuffer）
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "request:ok"
   *                            data            {string/Object/Arraybuffer} 服务器返回的数据
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   *                            header          {Object}        服务器返回的 HTTP Response Header
   */
  async request(options) {
    return this.setOption('request', options);
  }
  /**
   * 发起 HTTPS GET 网络请求
   * @param {string} url                          是  服务器接口地址
   * @param {string/object/ArrayBuffer} data      否  请求的参数  
   * @param {Object} header                       否  设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "request:ok"
   *                            data            {string/Object/Arraybuffer} 服务器返回的数据
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   *                            header          {Object}        服务器返回的 HTTP Response Header
   */
  async get(url = '', data = {}, header) {
    return this.setOption('request', Object.assign({}, { method: 'GET', url, data, header }));
  }
  /**
   * 发起 HTTPS POST 网络请求
   * @param {string} url                          是  服务器接口地址
   * @param {string/object/ArrayBuffer} data      否  请求的参数  
   * @param {Object} header                       否  设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "request:ok"
   *                            data            {string/Object/Arraybuffer} 服务器返回的数据
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   *                            header          {Object}        服务器返回的 HTTP Response Header
   */
  async post(url = '', data = {}, header) {
    return this.setOption('request', Object.assign({}, { method: 'POST', url, data, header }));
  }
  /**
   * 发起 HTTPS PUT 网络请求
   * @param {string} url                          是  服务器接口地址
   * @param {string/object/ArrayBuffer} data      否  请求的参数  
   * @param {Object} header                       否  设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "request:ok"
   *                            data            {string/Object/Arraybuffer} 服务器返回的数据
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   *                            header          {Object}        服务器返回的 HTTP Response Header
   */
  async put(url = '', data = {}, header) {
    return this.setOption('request', Object.assign({}, { method: 'PUT', url, data, header }));
  }
  /**
   * 发起 HTTPS DELETE 网络请求
   * @param {string} url                          是  服务器接口地址
   * @param {string/object/ArrayBuffer} data      否  请求的参数  
   * @param {Object} header                       否  设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "request:ok"
   *                            data            {string/Object/Arraybuffer} 服务器返回的数据
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   *                            header          {Object}        服务器返回的 HTTP Response Header
   */
  async delete(url = '', data = {}, header) {
    return this.setOption('request', Object.assign({}, { method: 'DELETE', url, data, header }));
  }

  /**
   * 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径。
   * 注意：
   *    请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。
   *
   * @param {object}  options   url             {string}    是  服务器接口地址
   *                            header          {Object}    否  HTTP 请求的 Header，Header 中不能设置 Referer  
   *                            filePath        {string}    否  指定文件下载后存储的路径
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "downloadFile:ok"
   *                            tempFilePath    {string}        临时文件路径。如果没传入 filePath 指定文件存储路径，则下载后的文件会存储到一个临时文件
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async downloadFile(options) {
    return this.setOption('downloadFile', options);
  }
  /**
   * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。
   *
   * @param {object}  options   url             {string}    是  服务器接口地址
   *                            filePath        {string}    是  要上传文件资源的路径
   *                            name            {string}    是  文件对应的 key，在服务端可以通过这个 key 获取文件的二进制内容
   *                            header          {Object}    否  HTTP 请求的 Header，Header 中不能设置 Referer  
   *                            formData        {Object}    否  HTTP 请求中其他额外的 form data
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "uploadFile:ok"
   *                            data            {string}        服务器返回的数据
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async uploadFile(options) {
    return this.setOption('uploadFile', options);
  }
  /**
   * 创建一个 WebSocket 连接
   *
   * @param {object}  options   url             {string}    是  服务器 wss 接口地址
   *                            header          {Object}    否  HTTP 请求的 Header，Header 中不能设置 Referer  
   *                            protocols       {Array.<string>}  否  子协议数组
   *                            tcpNoDelay      {boolean}   否  默认值： false  文件对应的 key，在服务端可以通过这个 key 获取文件的二进制内容
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "connectSocket:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async connectSocket(options) {
    return this.setOption('connectSocket', options);
  }
  /**
   * 监听 WebSocket 连接打开事件
   *
   * @param {function}  options   WebSocket 连接打开事件的回调函数
   * @returns {Promise}           errMsg          {string}        "onSocketOpen:ok"
   *                              header          {object}        连接成功的 HTTP 响应 Header
   */
  async onSocketOpen(options) {
    return this.setOption('onSocketOpen', options);
  }
  /**
   * 监听 WebSocket 连接关闭事件
   *
   * @param {function}  options   WebSocket 连接打开事件的回调函数
   * @returns {Promise}           errMsg          {string}        "onSocketClose:ok"
   *                              header          {object}        连接成功的 HTTP 响应 Header
   */
  async onSocketClose(options) {
    return this.setOption('onSocketClose', options);
  }
  /**
   * 监听 WebSocket 接受到服务器的消息事件
   *
   * @param {function}  options   WebSocket 连接打开事件的回调函数
   * @returns {Promise}           errMsg          {string}        "onSocketMessage:ok"
   *                              header          {object}        连接成功的 HTTP 响应 Header
   */
  async onSocketMessage(options) {
    return this.setOption('onSocketMessage', options);
  }
  /**
   * 监听 WebSocket 错误事件
   *
   * @param {function}  options   WebSocket 连接打开事件的回调函数
   * @returns {Promise}           errMsg          {string}        "onSocketError:ok"
   *                              header          {object}        连接成功的 HTTP 响应 Header
   */
  async onSocketError(options) {
    return this.setOption('onSocketError', options);
  }
  /**
   * 通过 WebSocket 连接发送数据。需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
   *
   * @param {object}  options   data            {string/ArrayBuffer}  是  需要发送的内容
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "sendSocketMessage:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async sendSocketMessage(options) {
    return this.setOption('sendSocketMessage', options);
  }
  /**
   * 关闭 WebSocket 连接
   *
   * @param {object}  options   code            {number}    否  默认值： 1000（表示正常关闭连接）  一个数字值表示关闭连接的状态号，表示连接被关闭的原因。
   *                            reason          {string}    否  一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "closeSocket:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async closeSocket(options) {
    return this.setOption('closeSocket', options);
  }
  /**
   * 保存图片到系统相册
   * 调用前需要 用户授权 scope.writePhotosAlbum
   *
   * @param {object}  options   filePath        {string}    是  图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "saveImageToPhotosAlbum:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async saveImageToPhotosAlbum(options) {
    return this.setOption('saveImageToPhotosAlbum', options);
  }
  /**
   * 在新页面中全屏预览图片
   *
   * @param {object}  options   urls            {Array.<string>}  是                  需要预览的图片链接列表。2.2.3 起支持云文件ID。
   *                            current         {string}    否  默认值：urls 的第一张   当前显示图片的链接filePath        {string}    是  图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "previewImage:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async previewImage(options) {
    return this.setOption('previewImage', options);
  }
  /**
   * 获取图片信息
   * 网络图片需先配置download域名才能生效
   *
   * @param {object}  options   src             {string}    是  图片的路径，可以是相对路径、临时文件路径、存储文件路径、网络图片路径
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "getImageInfo:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async getImageInfo(options) {
    return this.setOption('getImageInfo', options);
  }
  /**
   * 压缩图片接口，可选压缩质量
   *
   * @param {object}  options   src             {string}    是  图片路径，图片的路径，可以是相对路径、临时文件路径、存储文件路径
   *                            quality         {number}    否  默认值：80  压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对jpg有效）
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "compressImage:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async compressImage(options) {
    return this.setOption('compressImage', options);
  }
  /**
   * 从客户端会话选择文件
   *
   * @param {object}  options   count           {number}          是  最多可以选择的文件个数，可以 0～100
   *                            type            {string}          否  默认值：'all'  所选的文件的类型
   *                            extension       {Array.<string>}  否  根据文件拓展名过滤，仅 type==file 时有效。每一项都不能是空字符串。默认不过滤。
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "chooseMessageFile:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async chooseMessageFile(options) {
    return this.setOption('chooseMessageFile', options);
  }
  /**
   * 从本地相册选择图片或使用相机拍照
   *
   * @param {object}  options   count           {number}          否  默认值：9                           最多可以选择的图片张数
   *                            sizeType        {Array.<string>}  否  默认值：['original', 'compressed']  所选的图片的尺寸
   *                            sourceType      {Array.<string>}  否  默认值：['album', 'camera']         选择图片的来源
   *                            complete        {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise}         errMsg          {string}        "chooseImage:ok"
   *                            statusCode      {number}        服务器返回的 HTTP 状态码
   */
  async chooseImage(options) {
    return this.setOption('chooseImage', options);
  }
}
module.exports = WeChat;
