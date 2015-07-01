define([
  'angular', 'underscore', 'async', 'forge/forge', 'jsonld',
  'jsonld-signatures'],
  function(angular, _, async, forge, jsonld, jsigjs) {

'use strict';

var module = angular.module('authio.credentials', ['bedrock.alert', 'ipCookie']);

// TODO: move to separate file, use @ngInject
module.controller(
  'CredentialsController', function($scope, config, $location, ipCookie) {

  var self = this;
  self.callback = sessionStorage.getItem($location.search().id);
  self.identity = config.data.authio.identity;
  self.transmitDisabled = true;

  // setup custom document loader for identity JSON-LD context
  jsonld = jsonld();
  var _oldLoader = jsonld.documentLoader;
  jsonld.documentLoader = function(url) {
    if(url in config.data.CONTEXTS) {
      return Promise.resolve({
        contextUrl: null,
        document: config.data.CONTEXTS[url],
        documentUrl: url
      });
    }
    return _oldLoader(url);
  };

  // initialize jsig using the AMD-loaded helper libraries
  var jsig = jsigjs({inject: {
    async: async,
    forge: forge,
    jsonld: jsonld,
    _: _
  }});

  // refresh the session cookie
  var session = ipCookie('session');
    // refresh session
  ipCookie('session', session, {
    expires: 120,
    expirationUnit: 'minutes'
  });

  // extract the keyInfo if it exists in the session
  self.keyInfo = session.publicKey;

  // sign the identity
  var signer = {
    privateKeyPem: self.keyInfo.privateKeyPem
  };
  if(self.keyInfo.id) {
    signer.creator = self.keyInfo.id;
  } else {
    // FIXME: Implement ephemeral key support
    signer.creator = 'urn:sha256:PUBLIC_KEY_FINGERPRINT_IMPLEMENT_ME'
  }
  jsig.sign(self.identity, signer, function(err, signedIdentity) {
    if(err) {
      console.log('Error: Signature on identity failed:', err);
    }
    self.identity.signature = signedIdentity.signature;
    self.transmitDisabled = false;
    $scope.$apply();
  });

  self.transmitCredentials = function() {
    navigator.credentials.transmit(self.identity, {
      responseUrl: self.callback
    });
  };
});

});
