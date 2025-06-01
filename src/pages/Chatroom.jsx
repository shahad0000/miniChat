import React, { useRef, useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { TbBackground } from "react-icons/tb";
import { MdEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";

const Chatroom = () => {
  const navigate = useNavigate();
  const [bgImg, setBgImg] = useState("");
  const [showBgForm, setShowBgForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [editMsgId, setEditMsgId] = useState(null);
  const currentUser = localStorage.getItem("username");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState({
    sender: currentUser,
    content: "",
    time: "",
  });
  const chatBottom = useRef(null);
  const lastMsg = messages[messages.length - 1];
  const canEdit = lastMsg && lastMsg.sender === currentUser;
  const [editedMsg, setEditedMsg] = useState({ id: "", content: "" });
  const [NewBgImg, setNewBgImg] = useState("");
  const [bgClr, setBgClr] = useState("");
  const [newBgClr, setNewBgClr] = useState("");

  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const changeBg = (e) => {
    e.preventDefault();
    setShowBgForm(false);
    setBgImg(NewBgImg);
    setBgClr(newBgClr);
  };
  // Log out
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonText: "Log out",
      confirmButtonColor: "#a91d3a",
    });
    if (confirm.isConfirmed) {
      setIsLoggedIn(false);
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  };

  // Fetch messages
  const getMessage = async () => {
    try {
      const res = await axios.get(
        "https://6838634d2c55e01d184d1b0f.mockapi.io/message"
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Post messages
  const sendMessage = async () => {
    try {
      const res = await axios.post(
        "https://6838634d2c55e01d184d1b0f.mockapi.io/message",
        newMsg
      );
      setMessages((prev) => [...prev, newMsg]);
      setNewMsg((data) => ({
        ...data,
        content: "",
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Edit messages
  const editMessage = async (id) => {
    try {
      const res = await axios.put(
        `https://6838634d2c55e01d184d1b0f.mockapi.io/message/${id}`,
        { content: editedMsg.content }
      );
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? res.data : msg))
      );
      setEditedMsg((data) => ({
        ...data,
        content: "",
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete messages
  const deleteMessage = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure you want to delete this message?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#a91d3a",
    });
    if (confirmDelete.isConfirmed) {
      try {
        const res = await axios.delete(
          `https://6838634d2c55e01d184d1b0f.mockapi.io/message/${id}`
        );
        setMessages(messages.filter((msg) => msg.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getMessage();
    // For real time chat keep fetching every 3 seconds
    const interval = setInterval(() => {
      getMessage();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center ">
      {showBgForm && (
        <div
          id="modal"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0"></div>
          <form
            onSubmit={changeBg}
            className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Background
              </h3>
              <button
                id="closeModalButton"
                onClick={() => setShowBgForm(false)}
                className="text-gray-700 hover:text-black cursor-pointer "
              >
                <svg
                  className="h-4 w-4 inline-block ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="bg-color"
                  className="block text-sm font-medium text-gray-900"
                >
                  Background Color
                </label>
                <input
                  type="text"
                  value={newBgClr}
                  onChange={(e) => setNewBgClr(e.target.value)}
                  id="bg-color"
                  className="w-full mt-1 p-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white   "
                  placeholder="e. g. black, rgb(0, 0, 0) or #000"
                />
              </div>
              <div>Or</div>
              <div>
                <label
                  htmlFor="website_url"
                  className="block text-sm font-medium text-gray-900"
                >
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={NewBgImg}
                  onChange={(e) => setNewBgImg(e.target.value)}
                  id="website_url"
                  className="w-full mt-1 p-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white   "
                  placeholder="image url"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  id="cancelButton"
                  onClick={() => setShowBgForm(false)}
                  className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submitUrlButton"
                  className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600"
                >
                  Change
                  <svg
                    className="h-4 w-4 inline-block ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showEditForm && (
        <div
          id="modal"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0"></div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editMessage(editedMsg.id);
            }}
            className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Message
              </h3>
              <button
                id="closeModalButton"
                onClick={() => setShowEditForm(false)}
                className="text-gray-700 hover:text-black cursor-pointer "
              ></button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-msg"
                  className="block text-sm font-medium text-gray-900"
                >
                  Message:
                </label>
                <input
                  type="text"
                  value={editedMsg.content}
                  onChange={(e) =>
                    setEditedMsg((data) => ({
                      ...data,
                      content: e.target.value,
                    }))
                  }
                  id="edit-msg"
                  className="w-full mt-1 p-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white   "
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  id="cancelButton"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submitUrlButton"
                  className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600"
                >
                  Change
                  <svg
                    className="h-4 w-4 inline-block ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="w-full flex flex-col items-center h-screen">
        <nav className="p-3 px-5 shadow-sm flex fixed top-0 bg-white w-full justify-center">
          <div className="flex justify-between items-center text-4xl font-bold border-gray-400 w-full lg:w-[65vw]">
            <div className="flex gap-2 ">
              <div className="w-12 h-12 border-1 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`${
                    currentUser === "Amy" ? "/imgs/John.png" : "/imgs/Amy.png"
                  }`}
                  alt="Profile image"
                />
              </div>
              <div className="">{currentUser === "Amy" ? "John" : "Amy"}</div>
            </div>
            <div className="flex gap-5 ">
              <button
                onClick={() => setShowBgForm(true)}
                className="cursor-pointer"
              >
                <TbBackground />
              </button>
              <button
                onClick={handleLogout}
                className="text-red-700 cursor-pointer"
              >
                <LuLogOut />
              </button>
            </div>
          </div>
        </nav>
        <div
          style={{
            backgroundImage: bgImg ? `url('${bgImg}')` : "none",
            backgroundColor: `${bgClr}` || "#e0e7ff",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="flex-1 flex justify-center w-full pb-22 mt-18 p-4"
        >
          <div className="w-full lg:w-[65vw] ">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-center ${
                  msg.sender === currentUser ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender !== currentUser && (
                  <div className="w-12 h-12 border-1 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={`${
                        currentUser === "Amy"
                          ? "/imgs/John.png"
                          : "/imgs/Amy.png"
                      }`}
                      alt="Profile image"
                    />
                  </div>
                )}
                {canEdit && lastMsg.id === msg.id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setShowEditForm(true);
                        setEditedMsg({ id: msg.id, content: msg.content });
                      }}
                      className="cursor-pointer rounded-full h-fit p-1 bg-[#9c97973c]"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => {
                        deleteMessage(msg.id);
                      }}
                      className="cursor-pointer rounded-full h-fit p-1 text-red-700 bg-[#9c97973c]"
                    >
                      <GoTrash />
                    </button>
                  </div>
                )}
                <div
                  className={`m-2 shadow-sm rounded-md py-1 px-3 w-fit ${
                    msg.sender === currentUser ? "bg-green-200" : "bg-white"
                  }`}
                >
                  <div className="text-3xl">{msg.content}</div>
                  <div className="text-xl lg:text-xs text-end text-zinc-500">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div ref={chatBottom}></div>

        <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full">
          <div className="w-full flex justify-center gap-3 p-2 bg-white border-t border-gray-300">
            <div className="w-full lg:w-[65vw] flex items-center">
              <input
                type="text"
                value={newMsg.content}
                onChange={(e) =>
                  setNewMsg((data) => ({
                    ...data,
                    content: e.target.value,
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newMsg.content.trim()) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className=" bg-white p-3 w-[93%] rounded-md border-1 border-gray-200"
                placeholder="Write a message..."
              />
              <button
                disabled={!newMsg.content.trim()}
                onClick={sendMessage}
                className="bg-green-600 text-white border-1 border-gray-300 text-2xl p-3 rounded-full cursor-pointer"
              >
                <BsFillSendFill />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
