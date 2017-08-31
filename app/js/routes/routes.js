
// 路由、拦截器语言包初始化处理
idiomApp.config(["$stateProvider", "$urlRouterProvider", "$translateProvider", function($sp, $urp, $translateProvider) {

    // startup
    $sp.state("startup", {
        url: "/startup",
        templateUrl: "tpls/startup.html?t=" + Math.floor(Date.now() / 1000)
    });

    $sp.state("doing", {
        url: "/doing",
        templateUrl: "tpls/doing.html?t=" + Math.floor(Date.now() / 1000)
    });

    $sp.state("completed", {
        url: "/completed",
        templateUrl: "tpls/completed.html?t=" + Math.floor(Date.now() / 1000)
    });

    //设置默认路由
    $urp.otherwise('/startup');

    // 设置国际化
    $translateProvider.translations('en-US', translationsEN);
    $translateProvider.translations('zh-CN', translationsCN);
    $translateProvider.preferredLanguage('en-US');
    $translateProvider.fallbackLanguage('en-US');
}]);