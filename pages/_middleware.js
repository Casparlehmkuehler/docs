export default function handler(req, res) {
  const basicAuth = req.headers.authorization
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':')
    
    if (user === 'lyceum' && pwd === 'supersecretpassword') {
      return res.status(200).end()
    }
  }
  
  res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"')
  res.status(401).send('Authentication required')
}