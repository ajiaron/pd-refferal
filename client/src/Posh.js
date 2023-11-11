import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import Carousel from './Carousel';
import InputForm from './InputForm';
import {motion, AnimatePresence, filterProps} from 'framer-motion'
import axios from 'axios'
import Popup from './Popup';

const Posh = () => {
    return (
        <motion.div className='posh-content' initial={{x:window.innerWidth}} 
        animate={{x:0}} 
        transition={{
            type: "spring",
            stiffness:160,
            damping:40,
            duration:.25,
           
          }}
       >
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
          
           
            </div>
            
            {/*
            <>
                <iframe
                        src="https://embed.posh.vip/ticket-iframe/654acec46b783f693513aaac/"
                        height='100%'
                        width='100%'
                        style={{border: "none"}}
                    title="posh"
                    className='posh-embed'
                />
            </>
        */ }

        </motion.div>
    );
}

export default Posh;
