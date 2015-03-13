"use strict";

// ##UnexpectedDataFormatError
// Returned when the data returned by the Coinbase API is an unexpected format
// - - -
var UnexpectedDataFormatError = 'UnexpectedDataFormatError';

// ## AuthenticationError 
// Returned when there was an authentication error.
// - - -
var AuthenticationError = 'AuthenticationError';

// ## InvalidAccessToken 
// Returned when the current access token is no longer valid.
// - - -
var InvalidAccessToken = 'InvalidAccessToken';

// ## ExpiredAccessToken 
// Returned when the current access token is expired.
// - - -
var ExpiredAccessToken = 'ExpiredAccessToken';

// ## TokenRefreshError 
// Returned when there is a failure refreshing the access token.
// - - -
var TokenRefreshError = 'TokenRefreshError';

// ## TwoFactorTokenRequired 
// Returned when a user's Two Factor Auth token needs to be included in the request.
// - - -
var TwoFactorTokenRequired = 'TwoFactorTokenRequired';

// ## APIError
// Returned for errors related to interacting with the Coinbase API server.
// - - -
var APIError = 'APIError';

// ## Exports
// - - -
module.exports.UnexpectedDataFormatError = UnexpectedDataFormatError;
module.exports.AuthenticationError       = AuthenticationError;
module.exports.InvalidAccessToken        = InvalidAccessToken;
module.exports.ExpiredAccessToken        = ExpiredAccessToken;
module.exports.TokenRefreshError         = TokenRefreshError;
module.exports.TwoFactorTokenRequired    = TwoFactorTokenRequired;
module.exports.APIError                  = APIError;

