import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, loggedusername }) => {
  // Check if the loggedusername is null, undefined, or an empty string
  if (!loggedusername) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
