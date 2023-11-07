import React, {useState, useEffect, useRef} from 'react';
import './App.scss'
import {AnimatePresence, motion} from 'framer-motion'
import {GoArrowRight} from 'react-icons/go'
const InputForm = () => {
    return (
        <div className='input-form-container '>
        <div className='form-content'>
            <div className='fields-container'> 
                <div className='input-container'>
                    <p className='input-header-text'>
                        Phone Number
                    </p>
                    <div className='input-wrapper'>
                        <input className='input-content'
                        type="text"
                        name="symbol"
                        value={''}
                       // onChange={(e)=>handleInputChange(e)}
                        placeholder='+ 1'/>
                    </div>
                </div>
                <div className='input-container'>
                    <p className='input-header-text'>
                        Your Refferal Link
                    </p>
                    <div className='input-wrapper'>
                        <input className='input-content'
                        type="text"
                        name="symbol"
                        value={''}
                       // onChange={(e)=>handleInputChange(e)}
                        placeholder='peakingduck.com/your-refferal-link'/>
                    </div>
                </div>
                <div className='input-container'>
                    <p className='input-header-text'>
                        Your Access Link
                    </p>
                    <div className='input-wrapper'>
                        <input className='input-content'
                        type="text"
                        name="symbol"
                        value={''}
                       // onChange={(e)=>handleInputChange(e)}
                        placeholder='peakingduck.com/your-access-link'/>
                    </div>
                </div>
             
              
                <span className='submit-button' 
                role='button'
                tabIndex={'0'}
              //  onClick={()=>handleSubmit()}
                >
                    <p className='submit-text'>
                        Debug
                    </p>
                    <GoArrowRight className="button-icon"/>
                </span>
            </div>
        </div>
      
       
        </div>
    );
}

export default InputForm;

