var serveStatic = require('serve-static');
var stringify = require('stringify');

module.exports = function(grunt) {
  grunt.initConfig({
    jekyll: {
      options: {
        bundleExec: true,
        // src : '<%= app %>',
        // dest: '<%= dist %>',
        config: '_config.yml'
      },
      dist: { options: {} },
      dev: {
        options: {
          watch: true,
          incremental: true
        }
      }
    },

    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'css/main.css' : '_sass/main.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'css/',
          src:['main.css'],
          dest:'css/'
        }]
      }
    },

    browserify: {
      main: {
        src: ['js/src/main.js'],
        dest: 'js/main_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      }
    },

    watch: {
      js: {
        files: ['js/src/**/*.js', 'js/src/**/*.hbs', '!_site/**/*'],
        tasks: ['browserify:main', 'jekyll:dist']
      },
      sass: {
          files: ['css/**/*', '_sass/**/*', '!_site/**/*'],
          tasks: ['sass:dist', 'postcss:dist', 'jekyll:dist']
      },
      jekyll: {
          files: ['**/*.{html,yml,md,mkd,markdown}', '!_site/**/*'],
          tasks: ['jekyll:dist']
      },
    },

    uglify: {
      dist: {
        files: {
          'js/main_bundle.js': 'js/main_bundle.js'
        }
      }
    },

    connect: {
      options: {
        debug: true,
        port: 4000,
        base: '_site',
      },
      rules: [
        {from: '(^((?!css|html|js|img|fonts|\/$).)*$)', to: "$1.html"}
      ],
      development: {
        options: {
          open: {
            target: 'http://localhost:4000'
          }
        }
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks1: ['browserify:main', 'styles', 'jekyll:dist']
    }
  });

  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-connect-rewrite");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('envVar', function (env) {
      // This task will add the base url to css files when needed.
      // Attenction, this var is ONLY to deploy in github pages. If ussing custom domain,
      // set it to ''.
      var baseUrl = env === 'dist' ? '/goal16' : '';
      // var baseUrl = '';
      grunt.file.write('_sass/_env.scss', '$baseUrl:"' + baseUrl + '";');
  });

  grunt.registerTask('styles', ['sass:dist', 'postcss:dist']);
  grunt.registerTask('build', ['concurrent:tasks1']);
  grunt.registerTask('dist', ['envVar:dist', 'build', 'uglify:dist']);
  grunt.registerTask('default', ['envVar:dev', 'build', 'connect:development', 'watch']);
};
