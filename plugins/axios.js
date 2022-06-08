export default function ({ $axios, $config, $cookiz}, inject) {
  const authToken = $cookiz.get('auth._token.elma');
  // Create a custom axios instance
  const API = $axios.create({});

  if(authToken) {
    API.setHeader('Authorization', authToken)
  }

  // Set baseURL to something different
  API.setBaseURL(`${$config.api}/api`)

  // Inject to context as $api
  inject('api', API)
}
