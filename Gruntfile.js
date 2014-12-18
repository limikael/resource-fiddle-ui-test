module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');

	grunt.initConfig({
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				}
			},

			"test/fiddleui.bundle.js": ["src/fiddleui.js"]
		},

		pkg: grunt.file.readJSON('package.json')
	});
}