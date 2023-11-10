import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import Carousel from './Carousel';
import InputForm from './InputForm';
import {motion, AnimatePresence} from 'framer-motion'
import axios from 'axios'
import Popup from './Popup';

const Posh = () => {
    return (
        <div className='posh-content'>
            <Carousel/>
            <div className='posh-content-container'>
            {
                <>
                <iframe
                    src="https://embed.posh.vip/ticket-iframe/654acec46b783f693513aaac/"
                    height='600px'
                    width='100%'
                    style={{border: "none"}}
                    title="posh"
                />
                </>
            }
            </div>
        </div>
    );
}

export default Posh;
