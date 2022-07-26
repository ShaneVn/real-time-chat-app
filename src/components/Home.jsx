import { useCallback, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, app } from "../firebase";
import { Navigate } from "react-router-dom";
import ServerIcon from "./ServerIcon";
import {
  ChevronDownIcon,
  CogIcon,
  MicrophoneIcon,
  PhoneIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import Channel from "./Channel";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectServerId, setServerInfo } from "../features/serverSlice";
import { useNavigate } from "react-router-dom";
import { selectChannelId, setChannelInfo } from "../features/channelSlice";

function Home() {
  const [user] = useAuthState(auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [servers, setServers] = useState();
  const [channels, setChannels] = useState();

  const serverId = useSelector(selectServerId);
  const channelId = useSelector(selectChannelId);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "servers"), orderBy("timeStamp", "desc")),
        (snapshot) => {
          setServers(snapshot.docs);
          dispatch(
            setServerInfo({
              serverId: snapshot.docs[0].id,
              serverName: snapshot.docs[0].idserverName,
            })
          );
        }
      ),

    [db]
  );

  useEffect(() => {
    if (serverId) {
      onSnapshot(
        collection(db, "servers", serverId, "channels"),
        // orderBy("timeStamp", "desc"),
        (snapshot) => {
          setChannels(snapshot.docs);

          dispatch(
            setChannelInfo({
              channelId: snapshot?.docs[0]?.id,
              channelName: snapshot?.docs[0]?.data().channelName,
            })
          );

          navigate(`/channels/${serverId}/${snapshot?.docs[0]?.id}`);
        }
      );
    }
  }, [serverId]);

  console.log("this is serverId from home", channelId);

  const addServer = async () => {
    const name = prompt("Enter a name for the new server");

    const docRef = await addDoc(collection(db, "servers"), {
      serverName: name,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // add default channell
    if (docRef) {
      await addDoc(collection(db, "servers", docRef.id, "channels"), {
        channelName: "general",
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  // create channel to firebase
  const handleAddChannel = async () => {
    const channelName = prompt("Enter a new channel name");

    if (channelName) {
      try {
        await addDoc(collection(db, "servers", serverId, "channels"), {
          channelName: channelName,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        // console.log(error);
      }
    }
  };

  // setServer

  return (
    <>
      {user ? (
        <div className="flex h-screen">
          <div className="flex flex-col bg-discord_serverContainer overflow-scroll scrollbar-hide  items-center  space-y-3 p-3 min-w-max">
            <div className="server-default hover:bg-discord_purple flex items-center justify-center">
              <img src="../topicon.png" alt="" className="h-10 p-2" />
            </div>
            <hr className="border-gray-700 border w-8 mx-auto" />

            {servers?.map((server) => (
              <ServerIcon
                key={server.id}
                id={server.id}
                server={server.data()}
              />
            ))}

            <div className="server-default hover:bg-discord_green  p-3 group  ">
              <PlusIcon
                onClick={addServer}
                className="text-discord_green w-7 h-7 group-hover:text-white"
              />
            </div>
          </div>

          <div className="bg-discord_channelsBg flex flex-col min-w-max">
            <h2
              className="text-white font-bold text-sm flex items-center justify-between
          border-b border-gray-800 p-4 cursor-pointer
          hover:bg-discord_serverNameHoverBg"
            >
              Official Server
              <ChevronDownIcon className="h-5 ml-2" />
            </h2>

            <div className="text-discord_channel flex-grow overflow-y-scroll scrollbar-hide">
              <div className="flex items-center p-2 mb-2">
                <ChevronDownIcon className="h-3 mr-2" />
                <h4 className="font-semibold">channels</h4>
                <PlusIcon
                  className="h-6 ml-auto cursor-pointer hover:text-white"
                  onClick={handleAddChannel}
                />
              </div>

              <div className="flex flex-col space-y-2 px-2 mb-4">
                {channels?.map((doc) => {
                  return (
                    <Channel
                      id={doc.id}
                      key={doc.id}
                      channelName={doc.data().channelName}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex bg-[#292b2f] p-2 justify-between items-center space-x-8  cursor-pointer pr-4">
              <div className="flex items-center space-x-1 ">
                <img
                  src={user?.photoURL}
                  alt=""
                  className="h-10 rounded-full"
                />

                <h4 className="text-white text-xs font-medium">
                  {user?.displayName}
                  <span className="text-[#b9bbbe] block">
                    #{user?.uid.substring(0, 4)}
                  </span>
                </h4>
              </div>

              <div className="hover:bg-[#3a3c43] p-2 rounded-md mr-5">
                <h1
                  onClick={() => auth.signOut()}
                  className="font-bold text-white mx-auto "
                >
                  Logout
                </h1>
              </div>
            </div>
          </div>

          <div className="bg-[#36393f] flex-grow">
            <Chat />
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
}

export default Home;
