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

	connect(code, success, error) {
		let url = `${this[urls].token}`;
		let data = {
			grant_type: 'authorization_code',
			client_id: this[credentials].clientId,
			client_secret: this[credentials].clientSecret,
			redirect_uri: this[credentials].redirecturl,
			code: code
		};

		this[post](url, data, (result) => {
			this[credentials].accessToken = result.data.access_token;
			this[credentials].refreshToken = result.data.refresh_token;
			success();
	    }, error);
	}

	[post](url, data, success, error) {
		axios({
		    method: 'POST',
		    url: url,
		    data: data
		})
		.then(success)
	    .catch(error);
	}
}

module.exports = OAuth2;