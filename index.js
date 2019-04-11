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
        api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
      });
    };
  }
  /**
   * 设置参数，并判断wx对象是否存在
   * @param {string} fun      是  wx中的方法名称字符串
   * @param {object} options  否  参数根据不同方法传递的不同参数
   */
  setOption(fun, options) {
    if (!this.wx) {
      throw new Error('wx对象不存在');
    }
    return this.promisify(this.wx[fun])(options);
  }
  /**
   *微信登录
   *
   * @param {object} options timeout   {number}    否  超时时间，单位ms
   *                         complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "login:ok"
   *                    code    {string}  用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 auth.code2Session，使用 code 换取 openid 和 session_key 等信息
   */
  async login(options) {
    return this.setOption('login', options);
  }
  /**
   *检查登录态是否过期
   *
   * @param {object} options complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "checkSession:ok"
   */
  async checkSession(options) {
    return this.setOption('checkSession', options);
  }
  /**
   *获取系统信息
   *
   * @param {object} options complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg                       {string}   "getSystemInfo:ok"
   *                    brand                        {string}   设备品牌
   *                    model                        {string}   设备型号
   *                    pixelRatio                   {number}   设备像素比
   *                    screenWidth                  {number}   屏幕宽度，单位px
   *                    screenHeight                 {number}   屏幕高度，单位px
   *                    windowWidth                  {number}   可使用窗口宽度，单位px
   *                    windowHeight                 {number}   可使用窗口高度，单位px
   *                    statusBarHeight              {number}   状态栏的高度，单位px
   *                    language                     {string}   微信设置的语言
   *                    version                      {string}   微信版本号
   *                    system                       {string}   操作系统及版本
   *                    platform                     {string}   客户端平台
   *                    fontSizeSetting              {number}   用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准
   *                    SDKVersion                   {string}   客户端基础库版本
   *                    benchmarkLevel               {number}   设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50）
   *                    albumAuthorized              {boolean}  允许微信使用相册的开关（仅 iOS 有效）
   *                    cameraAuthorized             {boolean}  允许微信使用摄像头的开关
   *                    locationAuthorized           {boolean}  允许微信使用定位的开关
   *                    microphoneAuthorized         {boolean}  允许微信使用麦克风的开关
   *                    notificationAuthorized       {boolean}  允许微信通知的开关
   *                    notificationAlertAuthorized  {boolean}  允许微信通知带有提醒的开关（仅 iOS 有效）
   *                    notificationBadgeAuthorized  {boolean}  允许微信通知带有标记的开关（仅 iOS 有效）
   *                    notificationSoundAuthorized  {boolean}  允许微信通知带有声音的开关（仅 iOS 有效）
   *                    bluetoothEnabled             {boolean}  蓝牙的系统开关
   *                    locationEnabled              {boolean}  地理位置的系统开关
   *                    wifiEnabled                  {boolean}  Wi-Fi 的系统开关
   */
  async getSystemInfo(options) {
    return this.setOption('getSystemInfo', options);
  }
  /**
   *跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   *
   * @param {object} options url       {string}    是  需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数。
   *                         complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "switchTab:ok"
   */
  async switchTab(options) {
    return this.setOption('switchTab', options);
  }
  /**
   *关闭所有页面，打开到应用内的某个页面
   *
   * @param {object} options url       {string}    是  需要跳转的应用内页面路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
   *                         complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "reLaunch:ok"
   */
  async reLaunch(options) {
    return this.setOption('reLaunch', options);
  }
  /**
   *关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
   *
   * @param {object} options url       {string}    是  需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 ? 分隔，参数键与参数值用 = 相连，不同参数用 & 分隔；如 'path?key=value&key2=value2'
   *                         complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "redirectTo:ok"
   */
  async redirectTo(options) {
    return this.setOption('redirectTo', options);
  }
  /**
   *保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 this.wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
   *
   * @param {object} options url       {string}    是  需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 ? 分隔，参数键与参数值用 = 相连，不同参数用 & 分隔；如 'path?key=value&key2=value2'
   *                         complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "navigateTo:ok"
   */
  async navigateTo(options) {
    return this.setOption('navigateTo', options);
  }
  /**
   *关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
   *
   * @param {object} options delta     {number}    是  返回的页面数，如果 delta 大于现有页面数，则返回到首页。
   *                         complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "navigateBack:ok"
   */
  async navigateBack(options) {
    return this.setOption('navigateBack', options);
  }
  /**
   *关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
   *
   * @param {object} options delta     {number}    是  返回的页面数，如果 delta 大于现有页面数，则返回到首页。
   *                         complete  {function}  否  接口调用结束的回调函数（调用成功、失败都会执行）
   * @returns {Promise} errMsg  {string}  "navigateBack:ok"
   */
  async showToast(options) {
    return this.setOption('showToast', options);
  }
}
module.exports = WeChat;
