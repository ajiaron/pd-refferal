import React, {useState, useEffect, useRef} from 'react';
import './App.scss'
import {AnimatePresence, motion} from 'framer-motion'
import {GoArrowRight} from 'react-icons/go'
import { BiCheck } from 'react-icons/bi';
import {BiCopy} from 'react-icons/bi'
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
const InputForm = ({referralLink, count, isRegistered, hasShared, onRegisterPhone, onHandleSubmit, onHandleClipboard, onHandleNavigate, onHandleTest, onConfirmCode}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const env = process.env.REACT_APP_ENV;
    const [phone, setPhone] = useState('')

    const [confirmationCode, setConfirmationCode] = useState("")
    const [referralCount, setReferralCount] = useState(count?count:0)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  //  const [referral, setReferral] = useState(referralLink)
  //  const [accessLink, setAccessLink] = useState(uuidv4())
    const [validNumber, setValidNumber] = useState(false)
    // for stripped down version, hasAccess if user clicked link button
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
    function handleNavigate() {
        navigate(`/access`, {state: {token:uuidv4()}})

    }
    const validatePhone = (val) => {
        setPhone(val)
        const regex = /^\s*(?:\+?(\d{1,3})[-. (]*)?(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
        setValidNumber(regex.test(val.trim()))
    }
    useEffect(()=> {
        setReferralCount(count)
    }, [count])
    useEffect(()=> {
        setHasAccess(hasShared)
    }, [hasShared])
    useEffect(() => {
        const updateDimensions = () => {
          setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', updateDimensions);
        return () => {
          window.removeEventListener('resize', updateDimensions);
        };
      }, []);
    return (
        <form id="phone-form">
            <motion.div 
            initial={{y:16, opacity:0}}
            animate={{y:0, opacity:1}}
            transition={{
                type: "spring",
                stiffness:160,
                damping:30,
                duration:.2,
            }}
            className='input-form-container '>
            <div className='form-content'>
                <div className='fields-container'> 
                    <div className='input-container-phone phone-container'>
                        <p className='input-header-text'>
                        Enter in your phone number:
                        </p>
                        <div className='input-wrapper-alt'>
                            <input className='input-content'
                           // type="tel"
                            name="phone"
                          //  pattern="^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$"
                            value={phone}
                            onChange={(e)=>validatePhone(e.target.value)}
                            placeholder='000-000-0000' required/>
                            <span type="submit" className={validNumber?'input-phone-button':'input-phone-button-alt'}
                            onClick={()=>validNumber?onRegisterPhone(phone):console.log(phone)}>
                                <p className='phone-submit-text'>
                                    Submit
                                </p>
                            </span>
                        </div>
                    </div>
                    <div className='input-container' style={{transform:"translateY(-1.25rem)"}}>
                      {(screenWidth>=480)?
                        <p className='input-header-text' style={{paddingBottom:".125rem", lineHeight:(screenWidth>=480)?"26px":"22px"}}>
                        Copy this link and send to TWO friends. When your friends click the link = 1 referral. Get 2 referrals, and gain access to 36.5% off tickets.
                        </p>:
                        <div style={{display:"flex",paddingLeft:".325rem"}}>
                        <p className='input-header-alt' style={{paddingBottom:".125rem", lineHeight:(screenWidth>=480)?"26px":"40px", marginBottom:".375rem", fontWeight:"700"}}>
                            1.&nbsp;&nbsp;&nbsp;
                        </p>
          
                        <p className='input-header-alt' style={{paddingBottom:".125rem", lineHeight:(screenWidth>=480)?"26px":"40px", marginBottom:".375rem"}}>
                            Share this link with 2 friends
                        </p>
                        </div>
                        }
                        <span className='input-wrapper'>  
                            <span className='input-content-alt referral-input'
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
                            style={{color:"#ddd"}}
                            //style={{color:!isRegistered?"#404040":"#ddd"}}
                            />
                            </span>
                       
                        </span>
                    </div>
                    <div className='input-container' style={{transform:"translateY(-.5rem)"}}>
                        <div style={{ minWidth:"100%",display:"flex", width:"fit-content", alignItems:"center"}}>
                      {  (screenWidth>=480)?
                      <p className='input-header-text' style={{paddingBottom:".125rem", lineHeight:(screenWidth>=480)?"26px":"22px"}}>
                        Resubmit your number, and we’ll text you a confirmation code once<br/> you’re done. Enter it below and enjoy. {`${(isRegistered&&referralCount>=2)?'• Ready to go ':
                                isRegistered&&referralCount<2?`• ${2-referralCount} more referral${referralCount<1?'s':''}`
                            :""}`
                            }
                        {(referralCount>=2)&&
                        <BiCheck style={{ position:"absolute",color:"#fff", width:"1.35rem", height:"1.35rem", transform:"translateY(.1rem) translateX(.3rem)"}}/>
                        }
                            
                        </p>:
                         <div style={{display:"flex", paddingLeft:".75rem"}}>
                          <p className='input-header-alt' style={{paddingBottom:".125rem", lineHeight:(screenWidth>=480)?"26px":"40px", marginBottom:".375rem", fontWeight:"700"}}>
                            2.&nbsp;&nbsp;&nbsp;
                          </p>

                         <p className='input-header-alt' style={{paddingBottom:".125rem", lineHeight:(screenWidth>=480)?"26px":"40px", marginBottom:".375rem"}}>
                          Enjoy your tickets. Cheers!
                         {(referralCount>=2)&&
                         <BiCheck style={{ position:"absolute",color:"#fff", width:"1.35rem", height:"1.35rem", transform:"translateY(.1rem) translateX(.3rem)"}}/>
                         }
                             
                         </p>
                         </div>
                        }
                   
                        </div>
                       
                        <span className={`${(screenWidth>=480)?"input-wrapper":"input-wrapper-mobile"}`} >
                   
                            <span className={`input-content-access ${!hasAccess?"inactive":""}`}
                            //style={{color:!hasAccess?"#757575":"#eee"}}
                           // value={confirmationCode}
                           onClick={()=>(hasAccess)?onHandleNavigate():console.log("haven't pressed share")}
                            //placeholder='Enter your 6-digit code'
                            >
                                {(screenWidth>480)?
                                "ENJOY YOUR TICKETS":

                                "TICKETS"
                                }
                            </span>
                            <span 
                            onClick={()=>(hasAccess)?onHandleNavigate():console.log("haven't pressed share")}
                           // onClick={() =>onConfirmCode(phone, confirmationCode)}
                            className='access-arrow-icon-container'>
                                <GoArrowRight 
                                 style={{color:!hasAccess?"#fff":"#fff"}}
                                 className="access-arrow-icon"/>
                                {/*
                                <GoArrowRight 
                                 style={{color:referralCount<2?"#404040":"#eee"}}
                                 className="access-arrow-icon"/>
                                */ }
                            </span>
                        </span>
                    </div>
                
                {/*(env==="development")&&
                    <span className='submit-button' 
                    role='button'
                    type="submit"
                    style={{position:"absolute", bottom:24}}
                    onClick={()=>onHandleSubmit(phone)}
                   //onClick={()=>onHandleTest()}
                    >
                        <p className='submit-text'>
                            Debug
                        </p>
                        <GoArrowRight className="button-icon"/>
                    </span>
                    */}
                </div>
            </div>
        
        
            </motion.div>
        </form>
    );
}

export default InputForm;

