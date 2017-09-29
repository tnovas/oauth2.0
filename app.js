let axios = require('axios');
let credentials = Symbol('credentials');
let urls = Symbol('urls');
let post = Symbol('post');

class OAuth2 {
	constructor(clientId, clientSecret, redirecturl, scopes, urlBase, urlAuthorizate, urlToken) {
		this[credentials] = {
			clientId: clientId,
			clientSecret: clientSecret,
			redirecturl: redirecturl,
			scopes: scopes,
			accessToken: '',
			refreshToken: ''
		};

		this[urls] = {
			base: urlBase,
			authorizate: urlAuthorizate,
			token: urlToken
		};

		axios.defaults.baseurl = urlBase;
	}

	authorizationUrl() {
		return `${this[urls].base}${this[urls].authorizate}?response_type=code&client_id=${this[credentials].clientId}&redirect_uri=${this[credentials].redirecturl}&scope=${this[credentials].scopes}`;
	}

	getCredentials() {
		return {
			accessToken: this[credentials].accessToken,
			refreshToken: this[credentials].refreshToken
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

		let request = this[post](url, data);

		request.then((result) => {
			this[credentials].accessToken = result.data.access_token;
			this[credentials].refreshToken = result.data.refresh_token;
		}).catch((err) => {
			console.log(`status: ${err.response.status}, url: ${err.response.config.url}, data: ${err.response.config.data}, message: ${JSON.stringify(err.response.data)}`);
		});

		return request;
	}

	[post](url, data) {
		return axios({
		    method: 'POST',
		    url: url,
		    data: data
		});
	}
}

module.exports = OAuth2;