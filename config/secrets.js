module.exports = {
  db: 'mongodb://localhost/d2g',

  sessionSecret: 'Your Session Secret goes here',

  githubAuth: true,
  github: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitterAuth: true,
  twitter: {
    consumerKey: 'Your Consumer Key',
    consumerSecret: 'Your Consumer Secret',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  // https://www.dropbox.com/developers/apps/info/y33ly9lynuwc4v5
  dropbox: {
    appKey: 'y33ly9lynuwc4v5'
  },

  amazon: {
    key: 'AKIAIXT7KCJGLPUHWOZQ',
    secret: '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',
    bucket: 'd2g-apps'
  }

};
