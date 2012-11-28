var expect = require( "expect.js" ),
	_ = require( "underscore" ),
	api = require( "anvil.js" ),
	sinon = require( "sinon" );

describe( "When compiling a single mustache template", function() {
	var messages = [], harness, stub;

	before( function( done ) {
		harness = new api.PluginHarness( "anvil.mustache", "./" );
		stub = sinon.stub( harness.plugin, "log", function( message ) {
			messages.push( message );
		});
		harness.addFile( "./src/test/mustache.html",
			'Hello {{world!}}');

		harness.buildOnly( function() {
			done();
		});
	});

	it( "should log a success message to the log", function() {
		expect( messages ).to.have.length( 1 );
		expect( messages[ 0 ] ).to.be( "No issues Found." );
	});
});