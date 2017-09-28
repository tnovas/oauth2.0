let request = require('axios');

class OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, scopes, urlBase, urlAuthorizate, urlToken) {
		this.__credentials = {
			clientId: clientId,
			clientSecret: clientSecret,
			redirectUrl: redirectUrl,
			scopes: scopes,
			accessToken: '',
			refreshToken: ''
		};
		
		this.__url = {
			authorizate: urlAuthorizate,
			token: urlToken
		};

		request.defaults.baseURL = urlBase;
	}

	authorizationUrl() {
		return `${this.__url.authorizate}?response_type=code&client_id=${this.__credentials.clientId}&redirect_uri=${this.__credentials.redirectUrl}&scope=${this.__credentials.scopes}`;
	}

	getCredentials() {
		return {
			accessToken: this.__credentials.accessToken,
			refreshToken: this.__credentials.refreshToken
		};
	}

	connect(code, success, error) {
		let url = `${this.__url.token}`;
		let body = {
			grant_type: 'authorization_code',
			client_id: this.__credentials.clientId,
			client_secret: this.__credentials.clientSecret,
			redirect_uri: this.__credentials.redirectUrl,
			code: code
		};

		this.__post(url, body, (result) => {
			this.__credentials.accessToken = result.data.access_token;
			this.__credentials.refreshToken = result.data.refresh_token;
	    }, error);
	}

	__post(url, body, success, error) {
		request({
		    method: 'POST',
		    url: url,
		    body: body,
		    json: true
		})
		.then(success)
	    .catch(error);
	}
}

module.exports = OAuth2;