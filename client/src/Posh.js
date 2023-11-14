import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import Carousel from './Carousel';
import InputForm from './InputForm';
import {motion, AnimatePresence, filterProps} from 'framer-motion'
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
import Popup from './Popup';

const Posh = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  //  const location = useLocation()
  //  function getReferralToken() {
  //      const queryParams = new URLSearchParams(location.state);
  //      return queryParams.get('token');
  //  }
  //  useEffect(()=> {
  //      console.log(getReferralToken())
  //  }, [])
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    };
  
    // Apply overflow hidden when the component mounts
    if (windowWidth <= 480) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
   

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Revert back to the original style and remove resize listener when the component unmounts
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, []);
    return (

        <motion.div className='posh-content' initial={{x:window.innerWidth}} 
        animate={{x:0}} 
        transition={{
            type: "spring",
            stiffness:160,
            damping:40,
            duration:.25,
           
          }}
        style={{minHeight:(windowWidth>=480?"100vh":windowHeight)}}
       >
        {(screenWidth>=480)?
            <div className='posh-content-container'>
                <div className='posh-content-wrapper'>
                <>
                <iframe
                        src="https://embed.posh.vip/ticket-iframe/654acec46b783f693513aaac/"
                      //  height='740px'
                        width='100%'
                        style={{border: "none"}}
                    title="posh"
                    className='posh-embed'
                />
                </>
                </div>
          
                <motion.div 
                 initial={{opacity:0}}
                 animate={{opacity:1}}
                 transition={{
                     type: "spring",
                     stiffness:160,
                     damping:40,
                     delay:1,
                     duration:.5,
                 }}
                style={{position:"absolute", bottom:"40%", right:"-10%", zIndex:0}}> 
                  {  <motion.div 
                    initial={{filter:"hue-rotate(0deg)"}}
                    animate={{filter:"hue-rotate(15deg)"}}
                    transition={{
                        type: "tween",
          
                        duration:5,
                        repeat:Infinity,
                        delay:1.5,
                        repeatType:"mirror",
                    }}
                   
                    className='header-blur'/>
                    }
                    {/* 
                     <div className="header-blur"/>
                     */}
                </motion.div>
        
            </div>:
   

            <>
            <iframe
                    src="https://embed.posh.vip/ticket-iframe/654acec46b783f693513aaac/"
                    height={`${windowHeight}px`}
                    width='100%'
                    style={{border: "none", paddingTop:"1.5rem"}}
                title="posh"
                className='posh-embed'
            />
          </>


     

                    
      
            }

        </motion.div>

    );
}

export default Posh;
