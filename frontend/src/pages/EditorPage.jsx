import Editor from '@monaco-editor/react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function EditorPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);
  const currentUserName = location.state;
  const [participants, setParticipants] = useState([]);
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`);
  const isRemoteUpdate = useRef(false);
  const [someoneTyping, setSomeoneTyping] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const copyRoomID = async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID Copied");
  };

  useEffect(() => {
    socket.emit("join-room", { currentUserName, roomId });

    socket.on("new-user-join", (data) => {
      if (data.roomId === roomId) {
        toast.success(`${data.currentUserName} joined the room`);
      }
    });

    socket.on("output-updated", ({ output }) => {
      setOutput(output);
    });

    socket.on("participants-updated", (updatedList) => {
      setParticipants(updatedList);
    });

    socket.on("user-left", (data) => {
      toast.error(`${data.username} left the room`);
    });

    socket.on("code-update", ({ code: incomingCode }) => {
      if (incomingCode !== code) {
        isRemoteUpdate.current = true;
        setCode(incomingCode);
      }
    });

    socket.on("user-typing", ({ username }) => {
      setSomeoneTyping(`${username} is typing...`);
    });

    socket.on("user-stop-typing", () => {
      setSomeoneTyping("");
    });

  }, [roomId, currentUserName]);

  const leaveRoom = () => {
    socket.emit("leave-room", { roomId, currentUserName });
    navigate("/");
  };

  const typingTimeout = useRef(null);

  const handleEditorChange = (value) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(value);
    socket.emit("code-change", { roomId, code: value });

    socket.emit("typing", { roomId, username: currentUserName });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId });
    }, 1000);
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          language: "cpp",
          version: "10.2.0",
          files: [
            {
              name: "main.cpp",
              content: code
            }
          ]
        })
      });

      const result = await response.json();
      const finalOutput = result.run?.stdout || result.run?.stderr || "Unknown error occurred";

      setOutput(finalOutput);

      socket.emit("output-changed", { roomId, output: finalOutput });

    } catch (err) {
      setOutput("Error: " + err.message);
    }

    setIsRunning(false);
  };

  return (
    <div className='editor-page'>
      <div className='editor-menu'>
        <button onClick={copyRoomID} className='copy-room-id'>Copy Room ID</button>
        <p className="typing-indicator">{someoneTyping}</p>
        <div className='participants-conatiner'>
          <p>Participants</p>
          <div className="participants-list">
            {participants.map((p, i) => (
              <div key={i} className="avatar-bubble">
                {p.username.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
        <button className='leave-but' onClick={leaveRoom}>Leave Room</button>
      </div>
      <div className="editor-output">
        <Editor
          height="70vh"
          width="80vw"
          language="cpp"
          theme="vs-dark"
          options={{
            fontSize: 16,
            fontFamily: "Fira Code",
            fontLigatures: true,
            lineHeight: 22,
            letterSpacing: 0.5,
            tabSize: 4,
            insertSpaces: true,
            detectIndentation: false
          }}
          value={code}
          onMount={handleEditorMount}
          onChange={handleEditorChange}
          defaultValue={
            `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`
          }
        />
        <div className='output-box'>
          <button onClick={handleRunCode} disabled={isRunning} className="run-button">
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <div className="output-container">
            <strong>Output:</strong>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}