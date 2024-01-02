import Image  from "next/image"
import { Button } from "@mui/material"

export default function login() {

    return (
        <div className="flex items-end justify-center w-full h-full">
              <div className="flex justify-end w-40 h-20 mb-20 ml-20">
                <Button className="bg-[#E58E27] flex h-full w-full mb-20 mr-20">
                    <a className="text-white w-full h-full m-auto"  href="http://localhost:4000/auth/42">connect<br></br>with</a>
                </Button>
              </div>
              <div className=" xMedium:min-w-[600px] hidden medium:block aligin-self-end mr-40">
                <Image className='' alt='' src={'/pingPaddles.png'} height={800} width={800} priority/>
              </div>
        </div>
    )
}
