/**
 * @author 蔡福令
 * @name  微信唤醒app脚本
 *  @todo  试运行版本
 */

 
class WXOpen {
  constructor(props) {
    Object.keys(props).forEach((item) => {
      this[item] = props[item];
    });
    this.wxConfidReady = false;
    this.loadingDom = null;
    this.value = "";
    // 判断ios、android
    this.systemType = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
      ? "IOS"
      : "Android"
    this.asyncStartTime = 0; // 记录微信jssdk加载到wx.ready触发的时长
    this.domReadyTime = 0; // 记录微信开放标签的初始化时长
    this.options = {
      apkurl:
        "https://sj.qq.com/myapp/detail.htm?apkName=com.laolaiwangtech",
      iosUrl:
        "https://itunes.apple.com/cn/app/lao-lai-wang/id967110467?l=en&mt=8",
      schemaUrl: "laolaiapp://com.laolaiwangtech",
      iosschemaUrl: "com.laolai.app://cn.a-eye.MyLaoLai",
      commonUrl: "http://www.laolai.com/mobAuthDown.html",
      jumptoken: "&cusfrom",
      wxtoken: "isllwwx",
      guidedata: {},
      initCallback: "start",
    }
  }

  /* 应对简单场景页面，直接调用该方法即可，
   * 由于是对dom进行操作，如果复杂异步渲染dom的场景可以酌情组合使用asyncWeiXinJS，wxConfig，domTraverse等方法
   */
  createWXOpenTag(dom, str = "value") {
    this.value = this.getUrlParam(str);
    if (this.isWeixinFn()) {
      if (this.weixin_version() > 7011) {
        this.changeurl();
        this.domTraverse(dom, this.value);
        this.asyncWeiXinJS(() => {
          this.wxConfig();
        });
      } else {
        this.createdom()
      }
    } else {
      this.createdom()
    }
  }

  domTraverse(rootElement, schema) {
    const startTime = new Date().getTime();
    // console.log('==domTraverse start==', startTime)
    // 创建引导遮罩模块
    const wxstyle = document.createElement("style");
    wxstyle.innerHTML = `
    #launch-btn {} 
    #llw-guide {
        position: fixed;
        background-image: url("${this.imgUrl}");
        width: 100%;
        height: 100%;
        background-size: 90%;
        background-color: rgba(0, 0, 0, 0.65);
        background-repeat: no-repeat;
        background-position-x: center;
        background-position-y: 10px;
        z-index: 999999999;
        top: 0px;
        left: 0px;
      }`;
    document.head.append(wxstyle);
    const llwguide = document.createElement("div");
    llwguide.id = "llw-guide"
    llwguide.style.display = "none";
    llwguide.onclick = () => {
      llwguide.style.display = "none";
    }
    document.body.append(llwguide);
    if (!document.getElementById("root-wx-open-launch-app")) {
      const wxdiv = document.createElement("div");

      wxdiv.className = "root-wx-open-launch-app";
      wxdiv.schema = schema;
      document.body.append(wxdiv);
    }
    let domList = [];
    if (rootElement) {
      domList = rootElement.getElementsByClassName("root-wx-open-launch-app");
    } else {
      domList = document.getElementsByClassName("root-wx-open-launch-app");
    }
    let j = 0;
    for (let i = 0; i < domList.length; i++) {
      const item = domList[i];
      const schema = item.getAttribute("schema");
      const launchCreated = item.getAttribute("launch-box-created");
      if (!launchCreated) {
        j++;
        this.createOpenApp(item, schema);
      }
    }
    console.log("开放标签数量：", j);
    console.log(
      "所有开放标签创建花费时间：",
      new Date().getTime() - startTime + "ms"
    );

  }

  createdom() {
    const that = this;
    const wxdiv = document.createElement("div");
    const wxstyle = document.createElement("style");
    wxdiv.className = "toApp";
    wxdiv.innerHTML = this.btnText;
    wxstyle.innerHTML = `.toApp {
      width: 100px;
      height: 50px;
      border-radius: 30px;
      background: #0094ff;
      color: #ffffff;
      text-align: center;
      line-height: 50px;
      position: absolute;
      bottom: 10vh;
      left: ${(document.body.offsetWidth / 2) - 35}px;
        }`;
    wxdiv.onclick = () => {
      if (this.systemType == "IOS") {
        window.location.href = that.options.iosschemaUrl + "?source=h5";
        times = setTimeout(function () {
          window.location.href = that.options.iosUrl;
        }, 2500);

      } else {
        window.location.href = that.options.schemaUrl + "?source=h5";
        times = setTimeout(function () {
          //同理
          var _a = document.createElement("a");
          _a.setAttribute(
            "download",
            "https://imtt.dd.qq.com/16891/apk/2A50E3FCC914BC27EAF127312A3C9A51.apk?fsname=com.laolaiwangtech_6.5.0_123.apk&csr=1bbd"
          );
          _a.setAttribute(
            "href",
            "https://imtt.dd.qq.com/16891/apk/2A50E3FCC914BC27EAF127312A3C9A51.apk?fsname=com.laolaiwangtech_6.5.0_123.apk&csr=1bbd"
          );
          _a.click();
          _llwczc.push([
            "_trackEvent",
            "老来APP下载页面",
            "安卓开始请求下载链接",
          ]);
          _llwczc.push([
            "_trackEvent",
            "老来APP下载页面",
            "安卓下载链接请求成功",
          ]);
        }, 2500);
      }

    }
    document.body.append(wxdiv);
    document.head.append(wxstyle);
  }

  createOpenApp(root, schema) {
    root.setAttribute("launch-box-created", true);
    const box = document.createElement("div");
    // 创建开放标签
    const clickDom = document.createElement("wx-open-launch-app");
    box.appendChild(clickDom);
    // 设置Shadow host节点css样式，是其可以完全覆盖在目标元素上。注意设置overflow:hidden;属性
    box.id = "launch-btn";
    box.style = `
    width: 100px;
    height: 50px;
    border-radius: 30px;
    background: #0094ff;
    color: #ffffff;
    text-align: center;
    line-height: 50px;
    position: absolute;
    bottom: 10vh;
    z-index:1;
    left: ${(document.body.offsetWidth / 2) - 35}px;
    `
    box.setAttribute("class", "launch-app-box");
    // 模板内容样式特殊处理为width: 1000px; height: 1000px;目的是能完全覆盖
    clickDom.innerHTML =`    
    <script type="text/wxtag-template">
     <style>
    .btn {
      padding: 12px;
    }
    .download {
      width: 100px;
      height: 50px;
      border-radius: 30px;
      background:#0094ff;
      color :#ffffff;
    }
  </style>
  <button class="download btn" style="height:50px;width:100%;border:none;">${this.btnText}</button>  
  </script>`;
    clickDom.setAttribute("extinfo", schema);
    if (this.systemType == 'IOS') this.copyTxt();
    clickDom.setAttribute("appid", this.appId);
    // if (window.getComputedStyle(root, null).position === "static") {
    //   // 为目标元素设置position属性
    //   root.style.position = "relative";
    // }
    root.appendChild(box);
    clickDom.addEventListener("ready", function () {
      console.log("dom ready", new Date().getTime() - this.domReadyTime);
      removeLoading(); // 移除loading遮罩
    });
    clickDom.addEventListener("click", function (e) {
      e.preventDefault();
    });
    clickDom.addEventListener("launch", function (e) {
      console.log("success", e);
    });
    clickDom.addEventListener("error", function (e) {
      console.log("fail", e.detail);
      const llwguide = document.getElementById('llw-guide');
      llwguide.style.display = "block";
    });
  }

  async wxConfig() {
    const url = window.location.href.split("#")[0];
    let conf = {};
    if (this.wxConfidReady) return;
    const data = await this.jsonp(
      "http://manager.laolai.com/llw-bsprefor/info/web/wx/token.jspx?url=" + url
    );
    conf = {
      appId: data.data.appId,
      debug: false,
      nonceStr: data.data.noncestr,
      signature: data.data.signature,
      timestamp: data.data.timestamp,
      openTagList: ["wx-open-launch-app"],
      jsApiList: [
        "onMenuShareAppMessage",
        "onMenuShareTimeline",
        "onMenuShareQQ",
        "onMenuShareQZone",
      ], // 必填，需要使用的JS接口列表
    };
    // wxConf.debug = true
    // data.timestamp = data.timeStamp;
    window.wx.config({ ...conf });
    window.wx.ready(function () {
      this.domReadyTime = new Date().getTime();
      console.log(
        "wx.ready时间",
        new Date().getTime() - this.asyncStartTime + "ms"
      );
      this.wxConfidReady = true;
      wx.onMenuShareTimeline({
        title: "下载老来网APP", // 分享标题
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "http://statics.laolai.com/llw/llw-icon.png", // 分享图标
        success: function (res) { },
        cancel: function (res) { },
      });
      //分享给朋友
      wx.onMenuShareAppMessage({
        title: "下载老来网APP", // 分享标题
        desc: "互联网+医康养服务平台用科技重新定义生活", // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "http://statics.laolai.com/llw/llw-icon.png", // 分享图标
        type: "", // 分享类型,music、video或link，不填默认为link
        dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
        success: function (res) { },
        cancel: function (res) { },
      });
      //分享到QQ
      wx.onMenuShareQQ({
        title: "下载老来网APP", // 分享标题
        desc: "互联网+医康养服务平台用科技重新定义生活", // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "http://statics.laolai.com/llw/llw-icon.png", // 分享图标
        success: function (res) { },
        cancel: function (res) { },
      });
    });
    //失败
    window.wx.error(function (res) {
      console.log("==wx.error==", res);
      this.wxConfidReady = true;
    });
  }

  changeurl() {
    var from = window.location.href.indexOf(this.options.wxtoken);
    if (from < 0) {
      if (!!window.location.search) {
        window.location.href =
          window.location.href +
          this.options.jumptoken +
          "=" +
          this.options.wxtoken;
      } else {
        var jumptoken = JSON.parse(
          JSON.stringify(this.options.jumptoken)
        );
        window.location.href =
          window.location.href +
          "?" +
          jumptoken.slice(1) +
          "=" +
          this.options.wxtoken;
      }
    }
  }

  // 扩展axios jsonp方法
  jsonp(url) {
    if (!url) {
      console.error("JSONP 至少需要一个url参数!");
      return;
    }
    return new Promise((resolve, reject) => {
      window.jsonCallBack = (result) => {
        resolve(result);
      };
      var JSONP = document.createElement("script");
      JSONP.type = "text/javascript";
      JSONP.src = `${url}&callback=jsonCallBack`;
      document.head.appendChild(JSONP);
      setTimeout(() => {
        document.head.removeChild(JSONP);
      }, 500);
    });
  }

  // 获取地址栏参数
  getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; // 返回参数值
  }

  // 复制参数方法
  copyTxt() {
    var Url2 = document.createElement("input");
    Url2.value = this.value;
    document.body.appendChild(Url2);
    Url2.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令用户定义的代码区域用户定义的代码区域
    document.body.removeChild(Url2);
    this.copymsg = true;
    var that = this;
    if (this.timefn == true) {
      this.timefn == false;
      setTimeout(function () {
        that.copymsg = false;
        that.timefn == true;
      }, 1500);
    }
  };
  // 异步加载微信jssdk
  asyncWeiXinJS(cb) {
    this.asyncStartTime = new Date().getTime();
    if (this.isWeixinFn()) {
      const script = document.createElement("script");
      script.src = "http://statics.laolai.com/llw/js/jweixin-1.6.0.js";
      document.body.appendChild(script);
      if (cb) {
        script.addEventListener("load", cb);
      }
    }
  }
  // 判断微信内浏览器环境
  isWeixinFn() {
    // 判断是否是微信
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("micromessenger") !== -1;
  }

  //javascript获取版本号
  weixin_version() {
    var wechatInfo = window.navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
    var version = "";
    wechatInfo[1].split('.').forEach(item => {
      version += item
    })
    return Number(version);
  }
}

window._WXOpen = WXOpen;
document.addEventListener("visibilitychange", function () {
  var isHidden = document.hidden;
  console.log(document.visibilityState);
  if (document.visibilityState) {
    clearTimeout(times);
  }
});
var times = 0;
new window._WXOpen(
  {
    appId: "wx0d948348d1e2664d",
    imgUrl: "http://statics.laolai.com/llw/img/llw90101.png",
    btnText: "App内打开"
  }
).createWXOpenTag();