module.exports = function(grunt) {

  grunt.initConfig({

    responsive_images: {
      options: {
        engine: "im"
      },
      process: {
        files: [{
          expand: true,
          cwd: 'contents',
          src: ['images/**.{jpg,gif,png,JPG}'],
          dest: 'contents/gen'
        }]
      },
    },

    wintersmith: {
      build: {
        options: {
          action: "build"
        }
      },
      preview: {
        options: {
          action: "preview"
        }
      }
    },

    aws_s3: {
      options: {
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        region: 'eu-west-1',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      deploy: {
        options: {
          bucket: process.env.TRAVIS_BRANCH + '.streethealingbromley.org',
          differential: true // Only uploads the files that have changed
        },
        files: [
          {expand: true, cwd: 'build/', src: ['**'], dest: '', action: 'upload'}
        ]
      },
    }

  });

  grunt.registerTask('preview', ['responsive_images:process', 'wintersmith:preview']);
  grunt.registerTask('build', ['responsive_images:process', 'wintersmith:build']);
  grunt.registerTask('deploy', ['aws_s3:deploy']); 

  // Load NPM Task
  grunt.loadNpmTasks('grunt-wintersmith');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-responsive-images');
};