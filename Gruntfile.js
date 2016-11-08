module.exports = function(grunt) {

	// LiveReload的默认端口号，你也可以改成你想要的端口号
	var lrPort = 95729;
	// 使用connect-livereload模块，生成一个与LiveReload脚本
	// <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
	var lrSnippet = require('connect-livereload')({
		port: lrPort
	});
	// 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var lrMiddleware = function(connect, options, middlwares) {
		return [
			// 把脚本，注入到静态文件中
			lrSnippet,
			// 静态文件服务器的路径
			serveStatic(options.base[0]),
			// 启用目录浏览(相当于IIS中的目录浏览)
			serveIndex(options.base[0])
		];
	};

	// 项目配置(任务配置)
	grunt.initConfig({
		// 读取我们的项目配置并存储到pkg属性中
		pkg: grunt.file.readJSON('package.json'),
		// 通过connect任务，创建一个静态服务器
		connect: {
			options: {
				// 服务器端口号
				port: 9090,
				// 服务器地址(可以使用主机名localhost，也能使用IP)
				hostname: 'localhost',
				// 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
				base: '.'
			},
			livereload: {
				options: {
					// 通过LiveReload脚本，让页面重新加载。
					middleware: lrMiddleware
				}
			}
		},
		// 通过watch任务，来监听文件是否有更改
		watch: {
			client: {
				// 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
				options: {
					livereload: lrPort
				},
				// '**' 表示包含所有的子目录
				// '*' 表示包含所有的文件
				files: ['app/*.html', 'app/js/**/*.js', 'app/css/**/*.css', 'app/images/**/*', 'app/tpls/**/*.html', 'app/data/**/*.json', 'app/bower_components/**/*']
			}
		},
		// 文件合并
		concat: {
			options: {
				banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				separator: '\r\n\r\n/* ----------------- symbol ----------------- */\r\n\r\n',
				stripBanners: false
			},
			js_base: {
				//src: ['app/js/app.js', 'app/js/controllers.js', 'app/js/directives.js', 'app/js/filters.js', 'app/js/routes.js', 'app/js/services.js'],
				src: ['app/js/*.js'],
				dest: 'dest/js/<%= pkg.file %>.js'
			},
			js_extras: {
				//src: ['app/js/app.js', 'app/js/controllers.js', 'app/js/directives.js', 'app/js/filters.js', 'app/js/routes.js', 'app/js/services.js'],
				src: ['app/js/*.js'],
				dest: 'dest/js/<%= pkg.file %>.extras.js'
			},
			css_base: {
				src: ['app/css/main.css', 'app/css/extras.css'],
				dest: 'dest/css/<%= pkg.file %>.css'
			},
			css_extras: {
				src: ['app/css/main.css', 'app/css/extras.css'],
				dest: 'dest/css/<%= pkg.file %>.extras.css'
			}
		},
		// JS脚本语法检查
		jshint: {
			options: {
				"-W033": false,
				"-W030": true
			},
			//pre_base: ['app/js/app.js', 'app/js/controllers.js', 'app/js/directives.js', 'app/js/filters.js', 'app/js/routes.js', 'app/js/services.js'],
			pre_base: ['app/js/*.js'],
			//pre_extras: ['app/js/app.js', 'app/js/controllers.js', 'app/js/directives.js', 'app/js/filters.js', 'app/js/routes.js', 'app/js/services.js'],
			pre_extras: ['app/js/*.js'],
			concat_base: 'dest/js/<%= pkg.file %>.js',
			concat_extras: 'dest/js/<%= pkg.file %>.extras.js',
			build_base: 'dest/js/<%= pkg.file %>.min.js',
			build_extras: 'dest/js/<%= pkg.file %>.extras.min.js'
		},
		// JS混淆压缩
		uglify: {
			options: {
				banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			},
			build_base: {
				src: 'dest/js/<%= pkg.file %>.js',
				dest: 'dest/js/<%= pkg.file %>.min.js'
			},
			build_extras: {
				src: 'dest/js/<%= pkg.file %>.extras.js',
				dest: 'dest/js/<%= pkg.file %>.extras.min.js'
			}
		},
		// CSS压缩
		cssmin: {
			css_base: {
				src: ['app/css/*.css'],
				dest: 'dest/css/<%= pkg.file %>.min.css'
			},
			css_extras: {
				src: ['app/css/*.css'],
				dest: 'dest/css/<%= pkg.file %>.extras.min.css'
			}
		}
	}); // grunt.initConfig配置完毕

	/* 加载插件 开始 */

	// 自动化刷新页面插件
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// 合并文件插件
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	// 检测JS插件
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	// 压缩JS插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// 压缩CSS插件
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	/* 加载插件 结束 */

	/* 自定义任务 开始 */
	
	// 自动化刷新页面
	grunt.registerTask('live', ['connect', 'watch']);
	
	// 合并JS
	grunt.registerTask('jsm', ['concat:js_base', 'concat:js_extras']);
	// 合并&混淆压缩JS
	grunt.registerTask('jsmb', ['concat:js_base', 'concat:js_extras', 'uglify:build_base', 'uglify:build_extras']);
	// 检查/合并/混淆压缩JS
	grunt.registerTask('jscmb', ['jshint:pre_base', 'jshint:pre_extras', 'concat:js_base', 'concat:js_extras', 'jshint:concat_base', 'jshint:concat_extras', 'uglify:build_base', 'uglify:build_extras', 'jshint:build_base', 'jshint:build_extras']);
	
	// 合并CSS
	grunt.registerTask('cssm', ['concat:css_base', 'concat:css_extras']);
	// 合并/压缩CSS
	grunt.registerTask('cssmb', ['concat:css_base', 'concat:css_extras', 'cssmin:css_base', 'cssmin:css_extras']);
	
	/* 自定义任务 结束 */
};