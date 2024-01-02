'use client'
import axios from "axios";
import Image from "next/image"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader, GridLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import { FiEdit2 } from "react-icons/fi";
import Navbar from "../components/Navbar"
import { AppDispatch, RootState } from "../store/store";
import {updateUser2FaValue, updateUserImage, updateUserNameValue} from '../Slices/userSlice';


interface us {
    id: number;
    IsEnabled: boolean;
    TwoFASecret: string;
    username: string | null;
    email: string;
    avatar: string | null;
}

type formDataType = {
  username: string;
  checked_: boolean;
}

export default function setting() {

  const [tfaEnabled, setTfaEnabled] = useState<boolean>(false);
  const [loadingCode, setLoadingCode] = useState<boolean>(true);
  const [hide, setHide] = useState<boolean>(true);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [imageD, setImageD] = useState<File | null>(null);
  const [formData, setFormData] = useState<formDataType>({username: '', checked_: false,});

  const checkedTFA = useSelector((state: RootState) => state.user.entity?.userData?.IsEnabled);
  const avatar = useSelector((state: RootState) => state.user.entity?.userData?.avatar);
  const loading: boolean = useSelector((state: RootState) => state.user?.loading);
  const error: string | null = useSelector((state: RootState) => state.user?.error);
  const userName: string = useSelector((state: RootState) => state.user.entity?.userData?.username) ?? '';
  const isEnab = useSelector((state: RootState) => state.user.entity?.userData.IsEnabled);

  const dispatch = useDispatch<AppDispatch>();
  
  
  useEffect (() => {
    checkedTFA &&
    setFormData((prevData) => ({
      ...prevData,
      checked_: checkedTFA, 
    }));
    
  }, [checkedTFA])
  
  useEffect(() => {
    dispatch(updateUser2FaValue(formData.checked_));

  }, [formData.checked_])

  useEffect (() => {
    userName &&
    setFormData((prevData) => ({
      ...prevData,
      username: userName,
    }));
  }, [userName])

  const hideUserInput = () => {
    setHide(!hide);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, files } = e.target;

    if (type === 'file' && files) {
      setImageD(files[0]);
    } else {
        setFormData((prevData:formDataType) => {
          if (type === 'checkbox') {
            return {
              ...prevData,
              [name]: checked,
            };
          }
          return prevData;
      });
    }  
  }

  const handleImageUpload = async () => {
    setLoadingSubmit(false);
    

    if (imageD instanceof File) {
      const formData = new FormData();
      formData.append('file', imageD);
      formData.append('upload_preset', 'vzhhlhkm');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dlnhacgo2/image/upload',
          formData
        );
        
        if (response.data) {
          dispatch(updateUserImage(response.data.url));
          const url = response.data.url;
          const serverResponse = await axios.post('http://localhost:4000/Settings/image', {url : url}, { withCredentials: true });
        } 
      } catch (error) {

      }
    }
  }

  const handleFormDataSubmit = async (userName:string) => {
    try {
      const response = await axios.post('http://localhost:4000/Settings/username', {...formData, username:userName}, { withCredentials: true });
  
      if (response.status === 201) {
        dispatch(updateUserNameValue(userName));
        setHide(true);
        setLoadingSubmit(false);
        document.getElementById('notifySuccess')?.click();
        
        const updatedCode = response.data.code;
        
        setLoadingCode(false);
        setCode(updatedCode);
        
      } 
    } catch (error) {
        setLoadingCode(false);
        setErrorCode(error as string)
        setLoadingSubmit(false);
        document.getElementById('notifyError')?.click();
      
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData?.checked_){
      setTfaEnabled(true);
    }
    setLoadingSubmit(true);
    await handleImageUpload();
    const userNam = (document.getElementById('username') as HTMLInputElement).value;
    if(userNam.trim().length > 0){
      await handleFormDataSubmit(userNam.trim());
    }
    else{
      await handleFormDataSubmit(userName);
    }
  }

  const onCloseClick = () => {
    setTfaEnabled(false);
  }

  if (loading || error){
    return (
      <div className="text-white flex flex-col justify-center items-center w-full h-[70%] xMedium:h-screen">
        <div className="m-auto flex flex-col justify-center text-xl h-[30%]">
          <div className="absolute top-[45%] left-[42%] medium:left-[45%]">  LOADING . . .</div>
          <div className="absolute top-[50%] left-[48%]"><PropagateLoader color={"#E58E27"} loading={loading} size={20} aria-label="Loading Spinner"/></div>
        </div>
      </div>
    )
  }
  const notifySuccess = () => {
    toast.success('Profile updated successfuly.', {
      position:"top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const notifyError = () => {
    toast.error('Error to update profile', {
      position:"top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }

  return (
          <div className="flex flex-col justify-between text-slate-100 h-full min-h-screen min-w-screen w-full">
            <div className="h-16 xLarge:h-24"><Navbar pageName="setting" /></div>
            <div className="flex items-center w-full h-[100%] m-auto min-h-[750px]  medium:m-auto medium:justify-center">
              <div className="flex flex-col w-[100%] xMedium:w-[40%] Large:h-[63%] xMedium:h-[57%] min-h-[500px] h-[80%] justify-between">
                <form onSubmit={handleSubmit} className="flex flex-col w-[100%] gap-4 h-[40%] justify-between">
                  <div className="flex py-4 xMedium:min-w-[600px] justify-center w-[400px] mx-auto">
                    <Image className='rounded-full border-4 w-48 h-48 xMedium:w-[250px] xMedium:h-[250px] border-[#E58E27]' alt='' src={avatar ? avatar : "/noBadge.png"} height={250} width={250}/>
                    <label id="file-input-label" htmlFor="file-input" className="flex xMedium:mt-56 cursor-pointer text-[#E58E27] h-10">
                        <FiEdit2 className="text-2xl"/>
                        <div className="xMedium:text-2xl text-lg pl-1">Edit image</div>
                    </label>
                    <input name="image" type="file" id="file-input" onChange={handleChange} className="hidden"/>
                  </div>
                  <div className="relative flex py-4 justify-between xMedium:h-[5rem] xMedium:text-2xl Large:h-24 h-16 w-[400px] mx-auto  xMedium:min-w-[500px] rounded-3xl bg-[#323232]">
                      <div className="text-[#E58E27] text-xl xMedium:text-2xl m-auto">Username</div>
                      <div className="text-slate-400 text-xl xMedium:text-2xl m-auto w-[160px]">{userName}</div>
                      <div onClick={hideUserInput}><FiEdit2 className="text-xl absolute bg-[#E58E27] p-1 rounded-lg top-5 xMedium:top-8 right-5 cursor-pointer"/></div>
                  </div>
                  <div className={`${hide ? 'hidden' : 'flex'} py-4 justify-between xMedium:h-[5rem] xMedium:text-2xl Large:h-24 h-16 w-[400px] mx-auto  xMedium:min-w-[500px] rounded-3xl bg-[#323232]`}>
                      <div className="text-[#E58E27] text-xl xMedium:text-2xl m-auto">New one  </div>
                      <div className="m-auto bg-[#e28888]">
                        <input  id="username" name="username" type="text" className="border-none placeholder-slate-400 bg-[#323232] outline-0 w-[160px] text-xl xMedium:text-2xl" />
                      </div>
                  </div>
                  <div className="flex py-4 justify-between xMedium:h-[5rem] xMedium:text-2xl Large:h-24 h-16 w-[400px] mx-auto  xMedium:min-w-[500px] rounded-3xl bg-[#323232]">
                      <div className="text-[#E58E27] text-xl xMedium:text-2xl m-auto">Enable 2FA</div>
                      <div className="m-auto w-[160px] bg-[#323232]">
                        <button className="">
                          <label htmlFor="toggleCheck" data-modal-target="timeline-modal" data-modal-toggle="timeline-modal" className="w-[180px] h-20">
                          <input onChange={handleChange} type="checkbox" id="toogleCheck" name="checked_" checked={formData?.checked_} className="h-8 rounded-full appearance-none w-16 bg-slate-500 opacity-80 checked:bg-slate-200 transition duration-300 relative" />
                          </label>
                        </button>
                      </div>
                  </div>
                  {loadingSubmit ? (<button className="xMedium:h-[5rem] py-6 Large:h-24 h-16 w-[400px] mx-auto  xMedium:min-w-[500px] border-x-2 border-[#E58E27] rounded-3xl bg-[#323232]  text-xl xMedium:text-2xl hover:opacity-80 transition duration-700"><ClipLoader className="text-white" color={"#E58E27"} loading={loadingSubmit} size={30} aria-label="Loading Spinner" /></button>) : (<button type="submit" data-modal-target="timeline-modal" data-modal-toggle="timeline-modal" className="xMedium:h-[5rem] py-6 Large:h-24 h-16 w-[400px] mx-auto  xMedium:min-w-[500px] border-x-2 border-[#E58E27] rounded-3xl bg-[#323232] text-slate-100 text-xl xMedium:text-2xl hover:bg-[#E58E27] hover:opacity-80 transition duration-700">Validate</button>)}
                  {/* Pop-up */}
                  <div id="timeline-modal"  aria-hidden="true" className={` ${(tfaEnabled && isEnab && formData?.checked_) ? "" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
                      <div className="top-[25%] left-[10%] medium:left-[35%] relative p-4 w-full max-w-md max-h-full">
                          <div className="relative bg-[#131313] bg-opacity-60 text-white rounded-lg shadow">
                                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                      <h3 className="text-lg font-semibold text-slate-100">
                                          2FA Validation
                                      </h3>
                                      <button onClick={onCloseClick} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="timeline-modal">
                                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                              <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                          </svg>
                                          <span className="sr-only">Close modal</span>
                                      </button>
                                  </div>
                                  <div className="p-4 md:p-5">
                                      <div className="relative flex flex-col justify-center items-center gap-4 border-gray-200 ms-3.5 mb-4 md:mb-5">
                                        {code ?
                                          (
                                            loadingCode ? (<div><h3>LOADING ...</h3>
                                            <div><GridLoader color={"#E58E27"} loading={loadingCode} size={10} aria-label="Loading Spinner" /></div></div>) : (<img src={code} alt="Your Image" className=" w-52 h-52 rounded-lg border"/>)
                                          ) : (<h1 className="text-center">the QR code is already generated, click the button below to validate it</h1>)}
                                      </div>
                                      {
                                        code ? (<button className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        <Link href={'/2FaValidation'}> VERIFY </Link>
                                      </button>) : (<button className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        <Link href={'/2FaValidation'}> Validate </Link>
                                      </button>)
                                      }
                                      
                                  </div>
                              </div>
                      </div>
                  </div> 
                  {/* pop-Up */}
                </form>      
                <button className="hidden" id="notifySuccess" onClick={notifySuccess}>notify</button>
                <button className="hidden" id="notifyError" onClick={notifyError}>notify</button>
                <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"/>     
              </div>
              <div className=" xMedium:min-w-[500px] w-[600px] hidden medium:block">
                <Image className='' alt='' src={'/pingPaddles.png'} height={1200} width={1200} priority/>
                
              </div>
            </div>
          </div>

  )
}

