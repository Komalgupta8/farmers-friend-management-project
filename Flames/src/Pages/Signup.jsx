// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const otpflag = "Already Signed Up, Please Verify your Email."
    const [values, setValues] = useState({
        fullName:"",
        phone:"",
        email:"",
        password:"",

    });
    const navigate = useNavigate()
    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
          const response = await axios.post("http://localhost:7000/signup", {
            ...values,
          });
          console.log(response);
          console.log(response.data.id);
          const id = response.data.id;
          toast.success("Registration Successfull!")
          navigate("/verification", {state: {key : id}});
        } catch (error){
          console.log(error);
          toast.error(error.response.data.message);
          if(error.response.data.message == otpflag){
            navigate("/signin")
          }
        }
    }
  return (
    <section className="bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="/signup" className="flex items-center mb-6 text-2xl font-semibold text-white">
          <img className="w-8 h-8 mr-2" src="src/assets/icon.png" alt="logo"/>
          Flames@2024    
      </a>
      <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>
              <form onSubmit={(e)=>handleSubmit(e)} className="space-y-4 md:space-y-6" action="#">
              <div>
                      <label htmlFor="Name" className="block mb-2 text-sm font-medium text-white">Username</label>
                      <input type="Name" name="fullName" id="Name" className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white " placeholder="Full Name" required=""onChange={(e)=>setValues({...values, [e.target.name]:e.target.value})}/>
                  </div>
                  <div>
                      <label htmlFor="Name" className="block mb-2 text-sm font-medium text-white">Your Name</label>
                      <input type="Name" name="fullName" id="Name" className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white " placeholder="Full Name" required=""onChange={(e)=>setValues({...values, [e.target.name]:e.target.value})}/>
                  </div>
                  <div>
                      <label htmlFor="Phone" className="block mb-2 text-sm font-medium text-white">Phone No.</label>
                      <input type="Phone" name="phone" id="Phone" className=" border sm:text-sm rounded-lg   block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Phone no." required=""onChange={(e)=>setValues({...values, [e.target.name]:e.target.value})}/>
                  </div>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                      <input type="email" name="email" id="email" className=" border sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="name@company.com" required=""onChange={(e)=>setValues({...values, [e.target.name]:e.target.value})}/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className=" border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required=""onChange={(e)=>setValues({...values, [e.target.name]:e.target.value})}/>
                  </div>
                  <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border  rounded  focus:ring-3 focus:ring-primary-300 bg-gray-700 border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                      </div>
                  </div>
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <a href="/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                  </p>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Are you a farmer? <a href="/farmersignup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Apply as a Farmer</a>
                  </p>
                  <Toaster/>
              </form>
              
          </div>
      </div>
  </div>
</section>
  )
}

export default Signup