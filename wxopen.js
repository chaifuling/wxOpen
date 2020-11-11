/**
 * @author 蔡福令
 * @name  微信唤醒app脚本
 *  @todo  试运行版本
 */

// 创建引入脚步方法
const putScript = (obj) => {
  const scriptdom = window.document.createElement("script");
  script.src = obj.src;
  window.document.append(scriptdom);
};

const createOpenApp = (root, schema) => {
  root.setAttribute("launch-box-created", true);
  const box = document.createElement("div");
  // 创建开放标签
  const clickDom = document.createElement("wx-open-launch-app");
  box.appendChild(clickDom);
  // 设置Shadow host节点css样式，是其可以完全覆盖在目标元素上。注意设置overflow:hidden;属性
  box.style.width = root.clientWidth + "px";
  box.style.height = root.clientHeight + "px";
  box.style.position = "absolute";
  box.style.top = "0";
  box.style.left = "0";
  box.style.zIndex = "999";
  box.style.overflow = "hidden";
  box.setAttribute("class", "launch-app-box");
  // 模板内容样式特殊处理为width: 1000px; height: 1000px;目的是能完全覆盖
  clickDom.innerHTML = `<template>
      <style>
        .btn {
          width: 1000px;
          height: 1000px;
        }
      </style>
      <div class="btn"><div>
    </template>`;
  clickDom.setAttribute("extinfo", schema);
  clickDom.setAttribute("appid", "********");
  if (window.getComputedStyle(root, null).position === "static") {
    // 为目标元素设置position属性
    root.style.position = "relative";
  }
  root.appendChild(box);
  clickDom.addEventListener("ready", function () {
    console.log("dom ready", new Date().getTime() - domReadyTime);
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
  });
};

(function (window) {
  // 引入微信sdk
  putScript({ src: "https://res.wx.qq.com/open/js/jweixin-1.6.0.js" });
  //  引入vue
  putScript({ src: "vue.min.js" });
  // 获取vue 绑定元素
  var wxopenDom = window.document.getElementById("wxopenapp");
  // 检查原先是否有元素
  if (!wxopenDom) {
    var wxopenapp = window.document.createElement("div");
    wxopenapp.id = "wxopenapp";
    window.document.append(wxopenapp);
  }
})(window);
