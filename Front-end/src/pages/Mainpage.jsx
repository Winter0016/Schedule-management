import React, { useContext, useEffect } from 'react';
import { FaCalendarAlt, FaBook, FaClock, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Usercontext } from '../App';

export const Mainpage = () => {
  const {login,loggedusername,setActive} = useContext(Usercontext)

  useEffect(()=>{
    setActive("main");
    if(loggedusername && login){
      navigate("/dashboard/plan");
    }
  },[loggedusername,login])
  const navigate = useNavigate();
  const backgroundStyle = {
    backgroundImage: 'linear-gradient(to right, #070610, #070610)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 1rem',
  };

  const features = [
    { icon: FaCalendarAlt, text: 'Organize Your Schedule', color: 'text-blue-500' },
    { icon: FaBook, text: 'Track Your Courses', color: 'text-green-500' },
    { icon: FaClock, text: 'Manage Your Time', color: 'text-yellow-500' },
    { icon: FaBrain, text: 'Boost Your Productivity', color: 'text-purple-500' },
  ];


  return (
    <div style={backgroundStyle}>
      <div className="text-center text-white max-w-3xl relative">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl font-extrabold mb-6"
        >
          Master Your Studies
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-xl mb-8"
        >
          Empower your academic journey with our intelligent study management system
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-blue-700 transition duration-300 shadow-lg mb-12"
        >
          Get Started Now
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className="flex items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <feature.icon className={`text-4xl ${feature.color} mr-4`} />
              <h2 className="text-xl font-semibold">{feature.text}</h2>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
