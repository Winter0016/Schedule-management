import React, { useState, useContext, useEffect, act } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Testing = () =>{
    return(
        <div className='w-screen h-screen overflow-auto bg-customgray relative'>
            <div className=''></div>
        </div>
    )
}