module.exports =
  root: '/'
  routes:
    '' : 'Index'
    'about' : 'About'
    'login' : 'Login'
    '.*' : 'Error'
  auth:
    Index:
      required: true
      renavigate: 'login'
    Login:
      required: false
      renavigate: ''
