
import { Navigate } from 'react-router-dom';

export const Loginsignup = ({ children, loggedusername }) => {
    // Check if the loggedusername is null, undefined, or an empty string
    if (loggedusername) {
      return <Navigate to="/404" replace />;
    }
  
    return children;
  };
  