import AddNote from "./AddNotes"
import UserLogin from "./UserLogin"

const Home = (props) => {
  const { showAlert } = props
  
  return (
    <div>
    {
      (localStorage.getItem('token'))?
      <AddNote />:
           <UserLogin/>
        }
      
    </div>
  )
}

export default Home
