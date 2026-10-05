function fn() {
  var env = karate.env; // e.g. 'dev', 'test'
  //karate.log('karate.env system property was:', env);

  var config = {
    baseUrl: karate.properties['baseUrl'] || 'https://master.apis.dev.openstreetmap.org',
    accessToken: karate.properties['accessToken'] || 'PASTE_OAUTH_ACCESS_TOKEN_HERE',
    // Generate a single test_run_id for the whole collection run
    testRunId: 'karate-' + java.lang.System.currentTimeMillis() + '-' + java.util.UUID.randomUUID().toString().substring(0, 8)
  };

  // Configure global headers across all tests
  karate.configure('headers', function(){
    return {
      Authorization: 'Bearer ' + config.accessToken,
      'Accept-Encoding': 'gzip'
    };
  });

  karate.configure('connectTimeout', 10000);
  karate.configure('readTimeout', 10000);

  return config;
}