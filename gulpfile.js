var gulp                  = require('gulp');
var path                  = require('path');
var fs                    = require('fs');
var ip                    = require('ip');
var sass                  = require('gulp-sass');
var browserSync           = require('browser-sync');
var prefix                = require('gulp-autoprefixer');
/*var concat                = require('gulp-concat');
var rev                   = require('gulp-rev-append');*/
var uglify                = require('gulp-uglify');
var rename                = require("gulp-rename");
var imageop               = require('gulp-image-optimization');
var minifyCss             = require('gulp-minify-css');
var plumber               = require('gulp-plumber');
var gulpSequence          = require('gulp-sequence');
var template              = require('gulp-template');

var gutil                 = require("gulp-util");
var webpack               = require("webpack");
var WebpackDevServer      = require("webpack-dev-server");
var webpack_dev_config    = require('./webpack.dev.config.js');
var webpack_deploy_config = require('./webpack.deploy.config.js');

var config = {
  app_port: 8004,
  webpack_port: 3000,
  node_port: 3001,
  root: '/',  //资源路径
  src: 'src/',
  dest: './',
  IPv4: ip.address() //加入本机ip地址，是为了dev状态下，该网段下其他客户端也可访问本地测试服时，也能够正确获取到相关静态文件
};


var s = function(file_path){
  return path.join(config.src, file_path);
};
var d = function(file_path){
  return path.join(config.dest, file_path);
};

var srcWatchStyle = s('css/*.css');

gulp.task('browser-sync', function() {

  browserSync.init(['./src/css/*.css', './build/*.js', './index.html'], {
    // server: {
    //   baseDir: './',
    //   middleware: function(req, res, next){
    //     if(!(/\.(gif|png|jpg|js|css)$/ig.test(req._parsedUrl.pathname))){
    //       res.setHeader('content-type', 'text/html');
    //       res.write(fs.readFileSync('./index.html'));
    //       res.end(); 
    //     }else{
    //       next();
    //     }
    //   }
    // },
    proxy: "localhost:" + config.node_port,
    port: config.app_port,
    ui: {
      port: config.app_port + 1
    },
    reloadOnRestart: true,
    open: false
  });
});

gulp.task('template:dev', function(){
  var webpack_server = "http://" + config.IPv4 + ":" + config.app_port  +"/";
   
  return gulp.src(s('index.html'))
    .pipe(template({
      'root': config.root,
      'commons': webpack_server + 'commons.bundle.js',
      'index': webpack_server + 'index.bundle.js',
      'css': webpack_server + 'semantic-ui.styles.css'
     }))
    .pipe(gulp.dest('./'))
    /*.pipe(rename({extname: '.hbs'}))
    .pipe(gulp.dest(config.views));*/
});

gulp.task('template:deploy', function(){
  var webpack_assets = JSON.parse(fs.readFileSync('./build/webpack.assets.js').toString());
  return gulp.src(s('index.html'))
    .pipe(template({
      'root': config.root,
      'commons': webpack_assets.commons.js,
      'index': webpack_assets.index.js,
      'css': webpack_assets.index.css,
     }))
    .pipe(gulp.dest('./'))
});

gulp.task("webpack:react", function(callback) {
  webpack(webpack_deploy_config, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({}));
    callback();
  });
});

gulp.task('lib', function(){
  return gulp.src(s('js/lib/*.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min",
    }))
    .pipe(gulp.dest(d('lib')));
});

gulp.task('css', function(){
  gulp.src(s('css/*.css'))
  .pipe(minifyCss())
  .pipe(rename({
    suffix: ".min",
  }))
  .pipe(gulp.dest(d('css')));
});


gulp.task('sass', function() {
  gulp.src(s('sass/style.sass'))
  .pipe(plumber())
  //compressed
  .pipe(sass().on('error', sass.logError))
  .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
  .pipe(plumber())
  .pipe(minifyCss())
  .pipe(rename({
    suffix: ".min",
  }))
  .pipe(gulp.dest(d('css')));
});

//图像打包
gulp.task('images', function(cb) {
  return gulp.src(s('images/*'))
    .pipe(gulp.dest(d('images')));
});

//@1: 第一步操作
gulp.task("webpack-dev-server", function(callback) {

  var port = config.app_port;
  //去除hot-loader功能
  //http://«host»:«port»/webpack-dev-server/«path» 自动刷新模式 ： iframe模式 无需任何配置，只要前面的URL访问
  //webpack-dev-server/client?http://«path»:«port»/ 自动刷新模式：inline模式 访问的URL不会发生变化  资源服务器地址
  //webpack/hot/dev-server 代码热替换
  webpack_dev_config.entry.index.unshift("webpack-dev-server/client?http://" + config.IPv4 + ":" +  config.app_port + "/", "webpack/hot/dev-server");
  new WebpackDevServer(webpack(webpack_dev_config), {
      hot: false,
      stats: { colors: true },
  }).listen(port, config.IPv4, function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server]", "http://" + config.IPv4 + ":"+ port);
  });
});


//@2: 第二步操作
gulp.task('default',  [ 'images', 'sass', 'lib', 'template:dev' ], function () {
  //监控css
  gulp.watch(s('sass/**/*'), ['sass']);
  gulp.watch(s('js/*.js'), ['scripts']);
  gulp.watch(s('images/**/*'), ['images']);
  gulp.watch(s('css/*.css'), ['css']);
  gulp.watch(s('*.html'), ['template:dev']);
  gulp.watch(srcWatchStyle, ['css']);
});

gulp.task('deploy', gulpSequence('webpack:react', 'images', 'sass', 'lib', 'template:deploy'));


