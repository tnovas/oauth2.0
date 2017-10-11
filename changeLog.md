# Changelog
All notable changes to this project will be documented in this file.

## [1.0.7] 
### 2017-10-10
#### Added
- create new instance of axios
#### Change
- reconnect implementation
- change content-type to application/x-www-form-urlencoded

### 2017-10-09
#### Added
- Reconnect with refreshToken
- time of expire of accessToken in getCredentials
#### Remove
- accessToken and refreshToken from params
#### Change
- tests
- documentation

## [1.0.6] - 2017-09-29
### Added
- Change connect implementation
- Add accessToken and refreshToken on params
- Promises
- Add documentation promises to Readme.rm
- Add msg of error in console when status code not is 200