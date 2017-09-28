var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var Oauth2 = require('../app');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);

describe('OAuth2', () => {
	var oauth2, scope, urlApi, headers;

	before(() => {
	    oauth2 = new Oauth2(
			"clientId", 
			"clientSecret", 
			"redirectUrl", 
			"scopes",
			"urlBase",
			"auth",
			"token");
	  });


	it('constructor() should make credentials with params', () => {
		var credentials = {
			clientId: "clientId",
			clientSecret: "clientSecret",
			redirectUrl: "redirectUrl",
			scopes: "scopes",
			accessToken: '',
			refreshToken: ''
		};

		var url = {
			authorizate: 'auth',
			token: 'token'
		};
		
		expect(JSON.stringify(oauth2.__credentials)).to.equal(JSON.stringify(credentials));
		expect(JSON.stringify(oauth2.__url)).to.equal(JSON.stringify(url));
	});

	it('authorizationUrl() should return Url of authorization', () => 
		expect(oauth2.authorizationUrl()).to.equal(`${oauth2.__url.authorizate}?response_type=code&client_id=${oauth2.__credentials.clientId}&redirect_uri=${oauth2.__credentials.redirectUrl}&scope=${oauth2.__credentials.scopes}`)
	);

	it('connect() should connect to oauth2 and get accessToken with code', () => {	
		mock.onPost(oauth2.__url.token).replyOnce(200, {access_token: 'token', refresh_token: 'token'});

		oauth2.connect('code', () => expect('token').to.equal(oauth2.__credentials.accessToken), (err) => console.log(err));
	});

	it('connect() should throw error', () => {	
		mock.onPost(oauth2.__url.token).replyOnce(500);

		oauth2.connect('code', () => { }, (err) => expect(500).to.equal(err.response.status));
	});

	it('getCredentials() should get credentials', () => {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token'
		};

		var result = oauth2.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});

});