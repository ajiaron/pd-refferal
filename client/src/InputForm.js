import React, {useState, useEffect, useRef} from 'react';
import './App.scss'
import {AnimatePresence, motion} from 'framer-motion'
import {GoArrowRight} from 'react-icons/go'
import { v4 as uuidv4 } from 'uuid';
const InputForm = ({referralLink, onRegisterPhone, onHandleSubmit, onHandleClipboard}) => {
    const [phone, setPhone] = useState('')
  //  const [referral, setReferral] = useState(referralLink)
  //  const [accessLink, setAccessLink] = useState(uuidv4())
    const [validNumber, setValidNumber] = useState(false)
    const validatePhone = (val) => {
        setPhone(val)
        const regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
        setValidNumber(regex.test(val.trim()))
      }
    return (
        <form id="phone-form">
            <div className='input-form-container '>
            <div className='form-content'>
                <div className='fields-container'> 
                    <div className='input-container'>
                        <p className='input-header-text'>
                            Phone Number
                        </p>
                        <div className='input-wrapper-alt'>
                            <input className='input-content'
                         //   type="tel"
                            name="phone"
                            pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
                            value={phone}
                            onChange={(e)=>validatePhone(e.target.value)}
                            placeholder='+ 1' required/>
                            <span type="submit" className={validNumber?'input-phone-button':'input-phone-button-alt'}
                            onClick={()=>validNumber?onRegisterPhone(phone):console.log(phone)}>
                                <p className='phone-submit-text'>
                                    Submit
                                </p>
                            </span>
                        </div>
                    </div>
                    <div className='input-container'>
                        <p className='input-header-text'>
                            Your Refferal Link
                        </p>
                        <span className='input-wrapper'>  
                            <span className='input-content-alt'
                            // replace this function with an add on that posts the link to db
                            onClick={() => onHandleClipboard("referral")}
                            name="symbol">
                                {`${"snowhouse.com/let-me-in"}`}
                            </span>
                        </span>
                    </div>
                    <div className='input-container'>
                        <p className='input-header-text'>
                            Your Access Link
                        </p>
                        <span className='input-wrapper'>
                            <span className='input-content-alt'
                            onClick={() => onHandleClipboard("access")}
                            name="symbol">
                                {`peakingduckgroup.com/snow-house`}
                            </span>
                        </span>
                    </div>
                
                
                    <span className='submit-button' 
                    role='button'
                    type="submit"
                    onClick={()=>(validNumber)?onHandleSubmit(phone):console.log("not valid")}
                    >
                        <p className='submit-text'>
                            Debug
                        </p>
                        <GoArrowRight className="button-icon"/>
                    </span>
                </div>
            </div>
        
        
            </div>
        </form>
    );
}

export default InputForm;

