import { useState } from "react"
import logo from "../assets/logo.png"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {

    const [roomId, setRoomId] = useState("");
    const [username, SetUserName] = useState("");
    const navigate = useNavigate();

    const joinRoom = () => {
        if (!roomId || roomId.length!=36) {
            toast.error("Please Enter the valid roomId");
            return;
        }
        if(!username || username.length<3){
            toast.error("Please Enter the valid username");
            return;
        }
        navigate(`/editor/${roomId}`, {
            state: username
        })
    }

    const handleKeyUp = (e)=>{
        if(e.key==='Enter') joinRoom();
    }

    const generateRoomId = ()=>{
        const id = uuidv4();
        setRoomId(id);
        toast.success("New room created")
    }

    return (
        <div className="home-page">
            <div className="home-page-form-parent">
                <div className="home-page-form">
                    <img src={logo} alt="logo" />
                    <p className="home-page-form-text">Paste invitation ROOM ID</p>
                    <input type="text" onKeyUp={handleKeyUp} value={roomId} onChange={(e) => {
                        setRoomId(e.target.value.trimStart())
                    }} placeholder="ROOM ID" required />
                    <input type="text" onKeyUp={handleKeyUp} value={username} onChange={(e) => {
                        SetUserName(e.target.value.trimStart())
                    }} placeholder="USERNAME" />
                    <button onClick={joinRoom}>JOIN ROOM</button>
                    <p className="home-page-new-room">create room <span onClick={generateRoomId}>click here</span></p>
                </div>
            </div>
        </div>
    )
}
