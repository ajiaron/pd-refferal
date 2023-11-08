import React, {useState, useEffect, useRef} from 'react';
import { motion, useAnimation } from 'framer-motion';


const renderIcons = () => (
    <>
        <div className='carousel-icon-container noservice-icon'>
            PEAKING DUCK
        </div> 
        <div className='carousel-icon-container noservice-icon'>
             REFER • A • FREIND
        </div>
        <div className='carousel-icon-container noservice-icon'>
            PEAKING DUCK
        </div>
        <div className='carousel-icon-container noservice-icon'>
            REFER • A • FREIND
        </div>
        <div className='carousel-icon-container noservice-icon'>
            PEAKING DUCK
        </div>
        <div className='carousel-icon-container noservice-icon'>
            REFER • A • FREIND
        </div>


    </>
)

const Carousel = () => {
    const controls = useAnimation();
   // const iconsRef = useRef(null)

    useEffect(() => {
        const loopAnimation = async () => {
            // animate to half the width to show the second set
            await controls.start({ x: '-50%', transition: { duration: 30, ease: "linear" } });
            // instantly resets to the start
            controls.set({ x: '0%' });
            loopAnimation();
        };
        loopAnimation();
    }, [controls]);

    return (
        <div className='carousel-container'>
            <motion.div 
            initial={{ x: 0 }}
            animate={controls}
            className='carousel-content-container'>
              {renderIcons()}
              {renderIcons()}
            </motion.div>
        </div>
    );
}

export default Carousel;
