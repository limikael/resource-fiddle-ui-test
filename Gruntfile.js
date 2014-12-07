module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');

	grunt.initConfig({
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				}
			},

			"test/viewtest.bundle.js": ["test/viewtest.js"]
		},

		pkg: grunt.file.readJSON('package.json')
	});
}