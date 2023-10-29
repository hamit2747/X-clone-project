import { useEffect, useState } from "react"
import Aside from "../components/Aside"
import Main from "../components/Main"
import Nav from "../components/Nav"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config"


const Feed = () => {
  const [user ,setUser] = useState()

  useEffect(()=>{
    onAuthStateChanged(auth,(res)=>{
      setUser(res)
    })
  },[])

  return (
    <div className="grid grid-cols-5 xl:grid-cols-3 h-screen bg-black overflow-hidden">
     <Nav user={user}/>
     <Main user={user} />
  {/*    <Aside/> */}
     
    </div>
  )
}

export default Feed
