# OAuth 2.0

[![Build Status](https://travis-ci.org/tnovas/oauth2.svg?branch=master)](https://travis-ci.org/tnovas/oauth2)
[![Coverage Status](https://coveralls.io/repos/github/tnovas/oauth2/badge.svg)](https://coveralls.io/github/tnovas/oauth2)

You need nodejs version > 6x because this module was made with ES6.
```
node --version
```

## Installation:
Add the latest version of `oauth2` to your package.json:
```
npm install oauth2 --save
```

## Usage:
```js
let OAuth2 = require('oauth2');
```

Give the credentials of the OAuth to the constructor

| Params       | Description     | Optional | 
| --------     |:---------------| :-----:|
| **ClientId**     | *The Client Id* | **false** |
| **ClientSecret** | *The Client Secret* | **false** |
| **RedirectUrl**  | *The RedirectUrl with format 'http://yourdomain/youraction'* | **false** |
| **Scopes**       | *The scopes* | **false** |
| **UrlBase**       | *The url base of Authentication* | **false** |
| **UrlAuthorizate** | *The path of url Authorization* | **false** |
| **UrlToken**       | *The path of url Token* | **false** |

```js
let oauth2 = new OAuth2('clientId', 'clientSecret', 'http://yourdomain/youraction', 'socpes', 'https://domain/oauth/', 'auth', 'token');
```

### Authorization
To authenticate with OAuth you will call authorizationUrl()

```js
let urlAuthorization = oauth2.authorizationUrl();
```

You have to make a request on `urlAuthorization` with a browser and authorizate in OAuth. After that you will be redirect to `RedirectUrl` and you will get a `Code` on QueryString `?code='hjqweassxzass'` , then you have to call `connect` with `code`

| Params   | Description     | Optional | 
| -------- |:---------------| :-----:|
| **Code**  | *The code you got in the querystring* | **false** |
| **Success**  | *Callback on Success*| **true** |
| **Error**    | *Callback on Error*  | **true** |

```js
oauth.connect(code);
```

### Get Credentials:
If you need to save credentials, you have to call `getCredentials` and you will get an object

```js
{
  accessToken
  refreshToken
}
```