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
        let isMounted = true; // flag to track component's mount state
        const loopAnimation = async () => {
            // animate to half the width to show the second set
            if (isMounted) {
                await controls.start({ x: '-50%', transition: { duration: 30, ease: "linear" } });
                // instantly resets to the start
                if (isMounted) {
                    // instantly resets to the start
                    await controls.set({ x: '0%' });
                    loopAnimation();
                }
            }
        };
        loopAnimation();
        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted = false;
        };
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
