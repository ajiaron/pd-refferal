import React, {useState, useEffect, useRef} from 'react';
import { motion, useAnimation } from 'framer-motion';


const renderIcons = (screenWidth) => (
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
        {(screenWidth>767)&&
        <div className='carousel-icon-container noservice-icon'>
            PEAKING DUCK
        </div>
        }
        {(screenWidth>767)&&
        <div className='carousel-icon-container noservice-icon'>
            REFER • A • FREIND
        </div>
        }
    </>
)

const Carousel = () => {
    const controls = useAnimation();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
   // const iconsRef = useRef(null)
   useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

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
              {renderIcons(screenWidth)}
              {renderIcons(screenWidth)}
            </motion.div>
        </div>
    );
}

export default Carousel;
