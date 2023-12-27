import Image  from "next/image"
import { Button } from "@mui/material"

export default function login() {

    return (
        <div className="flex items-end justify-center w-full h-full">
              <div className="w-1/3 flex justify-end mb-20 ml-20">
                <Button className="bg-[#E58E27] mb-20 -mr-20 w-1/2 h-24">
                    <a className="text-white"  href="http://localhost:4000/auth/42">connect<br></br>with</a>
                </Button>
              </div>
              <div className=" xMedium:min-w-[600px] hidden medium:block aligin-self-end mr-40">
                <Image className='' alt='' src={'/pingPaddles.png'} height={800} width={800}/>
              </div>
        </div>
    )
}
