var chai = require('chai');
var expect = chai.expect;
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

	    credentials = {
	    	clientId: "clientId", 
			clientSecret: "clientSecret", 
			redirectUrl: "redirectUrl", 
			scopes: "scopes",
			accessToken: "token",
			refreshToken: "token",
			expiresIn: 3600
	    };

	    urls = {
			base: 'urlBase',
			authorizate: 'auth',
			token: 'token'
		};
	  });

	it('authorizationUrl() should return Url of authorization', () => 
		expect(oauth2.authorizationUrl()).to.equal(`${urls.base}${urls.authorizate}?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.redirectUrl}&scope=${credentials.scopes}`)
	);

	it('connect() should connect to oauth2 and get accessToken with code', () => {	
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600
		};
		
		mock.onPost(urls.token).replyOnce(200, {access_token: 'token', refresh_token: 'token', expires_in: 3600});

		oauth2.connect('code').then(() => expect(JSON.stringify(oauth2.getCredentials())).to.equal(JSON.stringify(credentials)));
	});

	it('connect() should throw error with a message', () => {	
		mock.onPost(urls.token).replyOnce(500, {msg: 'error'});

		oauth2.connect('code').catch((err) => expect(500).to.equal(err.response.status));
	});

	it('reconnect() should reconnect to oauth2 and get accessToken with refreshToken', () => {	
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600
		};
		
		mock.onPost(urls.token).replyOnce(200, {access_token: 'token', refresh_token: 'token', expires_in: 3600});

		oauth2.reconnect('refreshToken').then(() => expect(JSON.stringify(oauth2.getCredentials())).to.equal(JSON.stringify(credentials)));
	});

	it('reconnect() should throw error with a message', () => {	
		mock.onPost(urls.token).replyOnce(500, {msg: 'error'});

		oauth2.reconnect('refreshToken').catch((err) => expect(500).to.equal(err.response.status));
	});

	it('getCredentials() should get credentials', () => {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600
		};

		var result = oauth2.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});

});