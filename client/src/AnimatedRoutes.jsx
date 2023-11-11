import React, {useState, useEffect, useContext} from 'react'
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {AnimatePresence } from 'framer-motion'
import Home from './Home'
import './App.scss'
import Posh from './Posh';
import Referral from './Referral';
import { Oval } from 'react-loader-spinner'
import axios from 'axios';
import Carousel from './Carousel';

const validateReferral = async(token, callback) => {
    const connection = process.env.REACT_APP_API_URL
    let validated = false;
    try {
        const res = await axios.get(`${connection}/api/checkreferral`, {
        params:{
          referralToken:token
        }})
        console.log(res.data[0].isValid?"referral exists":"referral doesnt exist")
        if (res.data && res.data[0].isValid) {
            validated = res.data[0].isValid
        } 
      } catch(e) {
        console.log(e)
        return false
      }
      callback(validated)
      return validated
};
const validateAccess = (token) => {
    // Replace with actual validation logic
    return token === "expectedTokenValue"; // Replace with the actual expected token value
};

function ProtectedRoute({ children, type }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token'); 

        let tokenIsValid = false;

        if (type === "referral") {
            tokenIsValid = validateReferral(token, (valid) => {
                setIsValid(valid)
                setIsLoading(false)
            });
        } else if (type === "access") {
            tokenIsValid = true;
            setIsLoading(false)
           // tokenIsValid = validateAccess(token);
        }
        setIsValid(tokenIsValid); // 2nd check for redundancy
       // setIsLoading(false);
    }, [location, type]);

    if (isLoading) {
        return (
        <div className='main-content-alt'>
            <div className="loading-container">
                <Oval
                    color="#959595"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#454545"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
                <p className="loading-text" style={{paddingTop:"1.25em", paddingLeft:".3em", textAlign:"center"}}>
                    {`${(isLoading)?'Please wait a moment...':`Viewing all matching results`}`}
                </p>
            </div>
        </div>
   ); // Or some loading indicator
    } else {

        return isValid ? children : <Navigate to='/' replace />;
    }

}

function AnimatedRoutes() {
    const location = useLocation()
    return (
        <AnimatePresence>
            <Carousel/>
            <Routes location={location} key={location.pathname}>
                <Route path='/' element={<Home />} />
             
                <Route path='/access' element={
                    <ProtectedRoute type="access">
                        <Posh/>
                    </ProtectedRoute>
                }/>
                 <Route path='/referral' element={
                    <ProtectedRoute type="referral">
                        <Referral/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </AnimatePresence>
    )
}
export default AnimatedRoutes