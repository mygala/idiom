var iUrl = "http://honeywell.younglionschina.com/xyj2015/assets/images/";
var shareUrl = "http://honeywell.younglionschina.com/xyj2015/p0.html";
var appId = "wxf7b10f77acd8aa0e";
var serverUrl = "/Wechat/GetWechatJsSdkSignature";

var p = 0;

var descs = new Array(
    "玄奘西行，经17年，行5万里，跨138国，取得真经657部，最终黄天不负有心人变成了蓝天。",
    "我竟然是大圣，脚踩祥云身披金甲的高富帅。",
    "我竟然是唐僧，念念不忘必有回响女儿国王。",
    "我竟然是猪八戒，这一定不是真的！",
    "我竟然是沙和尚，物流的鼻祖快递小哥的精神领袖。",
    "我竟然是颜赛潘安，文胜李杜，武压关张的小白龙。",
    "我竟然是哪吒，极限少年，新新人类的极客偶像。",
    "我竟然是太上老君，悬炉济世的医学、化学专家。"
);

var imgs = new Array(
    "share_normal.png",
    "share_P16A.png",
    "share_P16B.png",
    "share_P16C.png",
    "share_P16D.png",
    "share_P16E.png",
    "share_P16F.png",
    "share_P16G.png"
);

var shareData = {
    title: "西天取净",
    desc: descs[p],
    link: shareUrl,
    imgUrl: iUrl + imgs[p]
}

$(function () {
    var server = serverUrl;
    var currentUrl = encodeURIComponent(window.location.href);
    var postData = "url=" + currentUrl;

    $.ajax({
        type: "POST",
        url: server,
        data: postData,
        async: true,
        dataType: "json",
        success: function (result) {
            if (result.Status == 1) {
                //分享功能 s
                wx.config({
                    debug: false,
                    appId: 'wxf7b10f77acd8aa0e',
                    timestamp: result.Timestamp,
                    nonceStr: result.Noncestr,
                    signature: result.Signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo'
                    ]
                });
                wx.ready(function () {
                    wxReady(shareData);
                })
                wx.error(function (res) {
                    alert(res.errMsg);
                });
            }
        },
        error: function () {
            //window.alert("系统错误，请稍后再试");
        }
    });
});

// 初始化微信API
function wxReady(shareData) {
    wx.onMenuShareAppMessage(shareData);
    wx.onMenuShareTimeline(shareData);
    wx.onMenuShareQQ(shareData);
    wx.onMenuShareWeibo(shareData);
}

// 获取地址栏参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}