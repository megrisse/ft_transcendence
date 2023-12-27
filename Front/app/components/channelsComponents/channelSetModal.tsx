import React, { useState } from "react";
import { useAppDispatch } from "./channelData";
import { BanUserFromChannel, addAdminToChannel, addUserFromChannel, muteFromChannel } from "@/app/Slices/channelSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";

type ModalType = {
    content : string;
    title : string;
    channelName : string;
};

const Modal = (props: ModalType) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showButton, setShowButton] = useState(false);
  const dispatch = useDispatch<AppDispatch>()

    const handleChange = (event: any) => {
      setMessage(event.target.value);
  
      console.log('value is:', event.target.value);
    };
    let alert : string = "";
    async function handleClick(endpoint: string | undefined) {
      setShowModal(false);
      if (!endpoint)
        return
      if(props.title == 'ban')
        dispatch(BanUserFromChannel({ username: message ,channelName: props.channelName }));
      else if (props.title == 'add')
        dispatch(addUserFromChannel({ username: message ,channelName: props.channelName }));
      else if (props.title == 'admin')
        dispatch(addAdminToChannel({ username: message ,channelName: props.channelName }));
      else if (props.title == 'mute')
        dispatch(muteFromChannel({ username: message ,channelName: props.channelName }));

      const bodyData  = {
          username : message // use message state variable as username
      }
      // console.log(`http://localhost:4000/Chat/${endpoint}`);
      
      // let response = await fetch(`http://localhost:4000/Chat/${endpoint}`, {  // Enter your IP address here
      //   method: 'POST', 
      //   mode: 'cors',
      //   credentials : 'include',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(bodyData) // body data type must match "Content-Type" header
      // })
    //   if (response.status == 200 || response.status == 400) {
    //       setShowButton(true); // Show the button when the response status is 200 or 400
    //       alert = (response.status == 200) ? "Success ..." : "Failed !...";
    //   }
    }
  let myMap = new Map<string, string>();
      myMap.set("ban","BanUserFromChannel");
      myMap.set("add","AddUserToChannel");
      myMap.set("admin","addAdminToChannel");
      myMap.set("mute","mute");
      // myMap.set("Invitations","invite");
  return (
    <>
      {showButton && (
        <button className="w-full h-full" onClick={() => setShowButton(false)}>
          {alert}
        </button>
      )}
      <button
        className="bg-orange-500 text-white active:bg-[#30313E]
      font-bold px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {props.content}
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#30313E] outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="flex flex-col items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <label>Username</label>
                    <input type="text" className="gb-gray-500 text-black" onChange={handleChange}value={message} autoComplete="off"/>
                    <button
                      className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-2"
                      type="button"
                      onClick={() => {
                        handleClick(myMap.get(props.title));
                      }}>
                      Submit
                    </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {setShowModal(false)
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;