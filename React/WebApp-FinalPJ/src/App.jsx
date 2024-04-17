import { useState, useEffect} from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'

function App() {
  
  const clientId = "123901642948-5m17kb51vt9o8c7spafbakfp636a2cug.apps.googleusercontent.com"
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      })
    }
    gapi.load("client:auth2", initClient)
  }, [])

  const onSuccess = (res) => {
    setProfile(res.profileObj)
    console.log('Successed', res)
  }
  
  const onFail = (res) => {
    console.log('Failed', res)
  }

  const logOut = () => {
    setProfile(null)
    console.log('Logout successed.')
  }


  return (
    <div>
      <h2>React Google Login</h2>
      <br /><br />
      {profile ? (
        <div>
          <img src={profile.imageUrl} alt="user img" />
          <br />
          <h3>Hello {profile.name}</h3>
          <p>Email: {profile.email}</p>
          <br />
          <GoogleLogout clientId={clientId} buttonText='Log Out' onLogoutSuccess={logOut} />
        </div>
      )
    : (
      <GoogleLogin 
        clientId= {clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFail}
        cookiePolicy="single_host_origin"
        isSignedIn={true}
      />
    )}
    </div>
  )
}

export default App
