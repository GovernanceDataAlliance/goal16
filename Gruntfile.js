var serveStatic = require('serve-static');
var stringify = require('stringify');

module.exports = function(grunt) {
  grunt.initConfig({
    jekyll: {
      options: {
        bundleExec: true,
        src : '<%= app %>',
        dest: '<%= dist %>',
        config: '_config.yml,_config_dev.yml'
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
      welcome: {
        src: ['js/src/welcome_main.js'],
        dest: 'js/welcome_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      countries: {
        src: ['js/src/countries_main.js'],
        dest: 'js/countries_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      compare: {
        src: ['js/src/compare_main.js'],
        dest: 'js/compare_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      map: {
        src: ['js/src/map_main.js'],
        dest: 'js/map_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      about: {
        src: ['js/src/about_main.js'],
        dest: 'js/about_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      indicators: {
        src: ['js/src/indicators_main.js'],
        dest: 'js/indicators_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      blog: {
        src: ['js/src/blog_main.js'],
        dest: 'js/blog_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      }
    },

    watch: {
      js: {
        files: ['js/src/**/*.js', '!_site/**/*'],
        tasks: ['browserify:countries', 'browserify:compare', 'browserify:map', 'browserify:about',
          'browserify:indicators', 'browserify:welcome', 'browserify:blog', 'jekyll:dist']
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
          'js/countries_bundle.js': 'js/countries_bundle.js',
          'js/compare_bundle.js': 'js/compare_bundle.js',
          'js/map_bundle.js': 'js/map_bundle.js',
          'js/about_bundle.js': 'js/about_bundle.js',
          'js/indicators_bundle.js': 'js/indicators_bundle.js',
          'js/welcome_bundle.js': 'js/welcome_bundle.js',
          'js/blog_bundle.js': 'js/blog_bundle.js'
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
      development: {}
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

  grunt.registerTask('envVar', function (env) {
      var baseUrl = env === 'dist' ? '/goal16' : '';
      grunt.file.write('_sass/_env.scss', '$baseUrl:"' + baseUrl + '";');
  });

  grunt.registerTask('styles', ['sass:dist', 'postcss:dist']);
  grunt.registerTask('build', ['browserify:countries', 'browserify:compare', 'browserify:map', 'browserify:about', 'browserify:indicators', 'browserify:welcome', 'browserify:blog', 'styles', 'jekyll:dist']);
  grunt.registerTask('dist', ['envVar:dist', 'build', 'uglify:dist']);
  grunt.registerTask('default', ['envVar:dev', 'build', 'connect:development', 'watch']);
};
