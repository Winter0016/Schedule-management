import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, loggedusername }) => {
  // Check if the loggedusername is null, undefined, or an empty string
  // console.log(`route protector`)
  console.log(`loggedusername: ${loggedusername}`)
  if(!loggedusername){
    console.log(`protected route couldnt find loggedusername ${loggedusername}`)
  }
  if (!loggedusername) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
