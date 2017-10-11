let axios = require('axios');
let credentials = Symbol('credentials');
let urls = Symbol('urls');
let post = Symbol('post');
var querystring = require('querystring');

class OAuth2 {
	constructor(clientId, clientSecret, redirecturl, scopes, urlBase, urlAuthorizate, urlToken) {
		this[credentials] = {
			clientId: clientId,
			clientSecret: clientSecret,
			redirecturl: redirecturl,
			scopes: scopes,
			accessToken: '',
			refreshToken: '',
			expiresIn: ''
		};

		this[urls] = {
			base: urlBase,
			authorizate: urlAuthorizate,
			token: urlToken
		};

		axios = axios.create({
		  baseURL: urlBase
		});

		axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	}

	authorizationUrl() {
		return `${this[urls].base}${this[urls].authorizate}?response_type=code&client_id=${this[credentials].clientId}&redirect_uri=${this[credentials].redirecturl}&scope=${this[credentials].scopes}`;
	}

	getCredentials() {
		return {
			accessToken: this[credentials].accessToken,
			refreshToken: this[credentials].refreshToken,
			expiresIn: this[credentials].expiresIn
		};
	}

	connect(code) {
		let url = `${this[urls].token}`;
		let data = {
			grant_type: 'authorization_code',
			client_id: this[credentials].clientId,
			client_secret: this[credentials].clientSecret,
			redirect_uri: this[credentials].redirecturl,
			code: code
		};

		return this[post](url, data).then((result) => {
			this[credentials].accessToken = result.data.access_token;
			this[credentials].refreshToken = result.data.refresh_token;
			this[credentials].expiresIn = result.data.expires_in;

			return result;
		});
	}

	reconnect(refreshToken) {
		let url = `${this[urls].token}`;
		let data = {
			grant_type: 'refresh_token',
			client_id: this[credentials].clientId,
			client_secret: this[credentials].clientSecret,
			refresh_token: refreshToken
		};

		return this[post](url, data).then((result) => {
			this[credentials].accessToken = result.data.access_token;
			this[credentials].refreshToken = result.data.refresh_token;
			this[credentials].expiresIn = result.data.expires_in;

			return result;
		});
	}

	[post](url, data) {
		return axios.post(url, querystring.stringify(data))
		.catch((err) => {
			console.log(`status: ${err.response.status}, url: ${err.response.config.url}, data: ${err.response.config.data}, message: ${JSON.stringify(err.response.data)}`);
			return Promise.reject(err);
		});
	}
}

module.exports = OAuth2;