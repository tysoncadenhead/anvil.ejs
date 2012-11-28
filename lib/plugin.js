/*global require, console, module, global */

/*jslint evil: true */

// Require EJS. This task depends on ejs. If you don"t have it, run "npm install ejs" in your terminal.
var ejs = require("ejs");

var pluginFactory = function( _, anvil ) {

    "use strict";

    return anvil.plugin( {
        
        name: "anvil.ejs",
        
        // Activity list: "identify", "pull", "combine", "pre-process", "compile", "post-process", "push", "test"
        activity: "post-process",

        // The config data is used to pass into each of the ejs templates
        config: {
            outputHTML: true,
            data: {},
            formats: ["html", "ejs"]
        },

        // Tests to see if the file should be ejsd
        isEJS: function (file) {

            var self = this,
                isEJS = false;

            // Loop over all of the formats. If the file is in one of the ejs formats, return true
            _.each(self.config.formats, function (format) {
                if (file.name.indexOf("." + format) !== -1) {
                    isEJS = true;
                }
            });

            return isEJS;

        },

        // Compiles individual files
        compileFile: function ( file ) {

            var self = this;

            // If the file is an ejs file, process it
            if (self.isEJS(file)) {

                // This is the temp file
                file.workingFile = file.workingPath + "/" + file.name;

                // Read the temp file
                anvil.fs.read(file.workingFile, function ( html ) {

                    // Render the template with ejs
                    file.template = ejs.render(html, self.config.data);

                    // Make the file end with an html extension
                    if (self.config.outputHTML) {
                        file.outputfile = file.workingFile.replace("/.anvil/tmp/", self.config.output || "/htdocs/");
                        file.outputfile = file.outputfile.split(".");
                        file.outputfile[file.outputfile.length - 1] = "html";
                        file.outputfile = file.outputfile.join(".");
                    }

                    // Re-write the temp file
                    anvil.fs.write(file.outputfile, file.template, function () {

                        // Clean up .ejs files from the production build
                        if (self.config.outputHTML) {
                            _.each(self.config.formats, function (format) {
                                if (format !== "html") {
                                    anvil.fs.deleteFile(file.outputfile.replace(".html", "." + format));
                                }
                            });
                        }

                        // Report the compilation to the command line
                        console.log("        compiled EJS template for " + (file.relativePath + "/" + file.name).replace("//", "/"));

                    });

                });

            }

        },

        // Compiles individual partials
        compilePartial: function ( path, params ) {

            var html = anvil.fs.readSync(anvil.config.working + "/" + path) || "", template;

            // Loop over our supported file formats to try to get the partial HTML (if the format is not part of the path that is passed in)
            _.each(this.config.formats, function (format) {
                if (!html.length) {
                    html = anvil.fs.readSync(anvil.config.working + "/" + path + "." + format);
                }
            });

            // Render the template with EJS and return it
            return ejs.render(html, _.extend(this.config.data, params));

        },
        
        // Run all the things...
        run: function( done ) {

            // This is a global function that can be called from inside our EJS templates to render any partial
            global.partial = this.compilePartial;

            // Loop over all of the files
            _.each(anvil.project.files, this.compileFile);

            done();

        }

    } );
};

module.exports = pluginFactory;