"use client"

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function TwoFactorValidation() {
  const router = useRouter();
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [body, setBody] = useState({
    code: '',
  })
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = otpValues.map(() => React.createRef<HTMLInputElement>());

  const handleInputChange = (index: any, value: any) => {
    const newOtpValues = [...otpValues];
    const newbody = body
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setBody(newbody)

    if (value.length === 1) {
      // Get the next input field's reference
      const nextInputRef = inputRefs[index + 1];
   
      // If the next input field exists, set the focus on it
      if (nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
    if (value.length === 0) {
      // Get the previous input field's reference
      const prevInputRef = inputRefs[index - 1];
    
      // If the previous input field exists, set the focus on it
      if (prevInputRef && prevInputRef.current) {
        prevInputRef.current.focus();
      }
     }
  };

  const handleValidate = async () => {
  
    body.code = otpValues.join('');
    console.log("otp", body)
    
    await axios.post('http://localhost:4000/2FA/validation', body, {withCredentials: true})
    .then(response => {

      if (response.status === 200)
        router.push('/profile')
    })
   .catch(error => {

    if (error.response && error.response.status === 401) {
      setOtpValues(['', '', '', '', '', ''])
      setErrorMessage('Invalid OTP. Try again.')
    }
      
   })
  };

  return (
    <div className="h-screen bg-black-500 py-20 px-3">
      <div className="container mx-auto">
        <div className="max-w-sm mx-auto md:max-w-lg">
          <div className="w-full">
            <div className="bg-[#E58E27] h-64 py-3 rounded text-center">
              <h1 className="text-2xl font-bold text-black">OTP Verification</h1>
              <div className="flex flex-col mt-4 text-black">
                <span>Enter the OTP you received at</span>
                <span className="font-bold">Google Authenticator</span>
              </div>
              <div id="otp" className="flex flex-row justify-center text-center px-2 mt-5">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    className="m-2 border h-10 w-10 text-center form-control rounded text-black"
                    type="text"
                    value={value}
                    onChange={e => handleInputChange(index, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>
              <div className="flex justify-center text-center mt-5">
                <a className="flex items-center text-white-700 hover:text-black-900 cursor-pointer" onClick={handleValidate}>
                  <span className="font-bold">Validate</span><i className='bx bx-caret-right ml-1'></i>
                </a>
              </div>
                  {errorMessage && <p className="text-red">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}