import React, {useState, useEffect, useRef} from 'react';
import './App.scss'
import {AnimatePresence, motion} from 'framer-motion'
import {GoArrowRight} from 'react-icons/go'
import {BiCopy} from 'react-icons/bi'
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
const InputForm = ({referralLink, count, isRegistered, onRegisterPhone, onHandleSubmit, onHandleClipboard}) => {
    const location = useLocation()
    const [phone, setPhone] = useState('')
    const [referralCount, setReferralCount] = useState(count?count:0)
  //  const [referral, setReferral] = useState(referralLink)
  //  const [accessLink, setAccessLink] = useState(uuidv4())
    const [validNumber, setValidNumber] = useState(false)
    const [hasAccess, setHasAccess] = useState(false)
    function handleTest() {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        console.log(token)
    }
    function getReferralToken() {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        return (token !== null && token.length > 0);
    }
    const validatePhone = (val) => {
        setPhone(val)
        const regex = /^\s*(?:\+?(\d{1,3})[-. (]*)?(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
        setValidNumber(regex.test(val.trim()))
    }
    useEffect(()=> {
        setReferralCount(count)
    }, [count])
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
                           // type="tel"
                            name="phone"
                          //  pattern="^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$"
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
                            <span 
                            onClick={() => onHandleClipboard("referral")}
                            className='copy-icon-container'>
                            <BiCopy 
                            className='copy-icon'
                            style={{color:!isRegistered?"#404040":"#ddd"}}/>
                            </span>
                       
                        </span>
                    </div>
                    <div className='input-container'>
                        <p className='input-header-text'>
                            {`Your Access Link ${isRegistered&&referralCount<2?`• ${2-referralCount} more referral${referralCount<1?'s':''}`
                            :""}`}
                        </p>
                        <span className='input-wrapper'>
                            <span className='input-content-access'
                            onClick={() => onHandleClipboard("access")}
                            name="symbol">
                                {`peakingduckgroup.com/snow-house`}
                            </span>
                            <span 
                            className='access-arrow-icon-container'>
                                <GoArrowRight 
                                 style={{color:!hasAccess?"#404040":"#ddd"}}
                                 className="access-arrow-icon"/>
                            </span>
                        </span>
                    </div>
                
                
                    <span className='submit-button' 
                    role='button'
                    type="submit"
                    onClick={()=>handleTest()}
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

