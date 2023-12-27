'use client';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { joinChannel } from "../Slices/channelMessagesSlice";
import { useAppDispatch } from "../store/store";



export type channelSearchType = {
  name : string;
  isProtected: boolean;
};


const ChannelSearch = () => {
    const dispatch = useAppDispatch();
    const [channelToJoin, SetChannelToJoin] = useState<channelSearchType>({
      name : "",
      isProtected : false,
    })
    const [password, setPassword] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [showButton, setShowButton] = useState<boolean>(false);
    const [searchData, setSearchData] = useState<channelSearchType[]>([]);
   
   
    useEffect(() => {
      if (channelToJoin?.name !== "") {
        dispatch(joinChannel({data: channelToJoin, password: password}));
        setPassword("");
        setShowModal(false);
        setSearchData([]);
      }
     }, [channelToJoin, dispatch]);
     



    // handle change
    const handleChange = async (event: any) => {
      setMessage(event.target.value);
      await getSearchData();
      console.log('value is:', event.target.value);
    };

    const handlePasswordChange = async (event: any) => {
      setPassword(event.target.value);
      console.log('value is:', event.target.value);
    };

    let alert : string = "";

    // handle click function ....
    async function getSearchData() {
      let bodyData;
      let response = await fetch(`http://localhost:4000/Chat/channelSearch`, {  // Enter your IP address here
        method: 'POST', 
        mode: 'cors',
        credentials : 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"message" : message}) // body data type must match "Content-Type" header
    })
    let data: channelSearchType[] = await response.json() as channelSearchType[];
    setSearchData(data);
    }

  // code to display
  return (
    <>
      {showButton && (
        <button className="w-full h-full" onClick={() => setShowButton(false)}>
          {alert}
        </button>
      )}
      <button
        className="m-2 p-2 border border-[#E58E27] text-white active:bg-[#30313E]
      font-bold px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <p className="truncate">JOIN CHANNEL</p>
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
                    <label>Search</label>
                    <input type="text" className="gb-gray-500 bg-[#E58E27] text-white w-full" onChange={handleChange} value={message} autoComplete="off"/>
                    {searchData && <div className="w-full h-full">
                        {searchData.map((name, index)=> {
                            return (
                                <div key={index} className="flex flex-row w-full justify-between text-white p-1 border border-[#E58E27] m-1">
                                    <p>{name.name}</p>
                                    <input className={(name.isProtected === true ? "border border-black rounded bg-[#E58E27]" : "invisible")} onChange={handlePasswordChange}/>
                                    <button className="bg-[#E58E27] text-white rounded p-1" onClick={() => {
                                      SetChannelToJoin({...name, name: name.name, isProtected: name.isProtected});
                                      console.log('Button clicked');}}>
                                      JOIN
                                      </button>
                                    {/* <button className="bg-[#E58E27] text-white rounded p-1" onClick={() => SendJoin(name)}>JOIN</button> */}
                                </div>
                            )
                        })}
                        </div>
                    }
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ChannelSearch;
