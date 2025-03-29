import { useState } from 'react'
import reactLogo from './assets/react.svg'
import APIForm from './components/APIForm';
import Gallery from './components/Gallery';
import './App.css'


function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  const [inputs, setInputs] = useState({
    url: "",
    format:"",
    no_ads: "",
    no_cokkie_banners:"",
    width: "",
    height: "",
});

const submitForm = () => {

  let defaultValues = {
    format: "jpeg",
    no_ads: "true",
    no_cookie_banners: "true",
    width:"1920",
    height:"1920"
  } 

  if(inputs.url.trim()== "" || inputs.url.trim()== " "){
    alert("you forgot to submit an url")
  }else {
    for (const [key,value] of Object.entries(inputs)){
      if(value == ""){
        inputs[key] = defaultValues[key]
      }
    }
  }
  const query = makeQuery();
  callAPI(query).catch(console.error);
}

const makeQuery = () =>{
  let wait_until = "network_idle";
  let response_type = "json";
  let fail_on_status = "400%2C404%2C500-511"
  let url_starter= "https://"
  let fullURL = url_starter+ inputs.url
  let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
  return query;
}

const reset = ()=>{
  setInputs({
    url: "",
    format: "",
    no_ads: "",
    no_cokkie_banners: "",
    width: "",
    height: "",

  })
}

const callAPI = async(query) => {
  const response = await fetch(query);
  const json = await response.json();
  if(json.url == null){
    alert("Oops! Something went wrong with that query, let's try again!")
  }else{
    setCurrentImage(json.url);
    setPrevImages((images) =>[...images, json.url]);
    reset()
  }
}
  return (
   <div className= "whole-page"> 
    <h1>Build Your Own Screenshot!📸</h1>
      
    <APIForm
      inputs = {inputs}
      handleChange ={(e) => setInputs((prevState)=> ({
        ...prevState,[e.target.name]: e.target.value.trim()
      }))
    }
    onSubmit={submitForm}
    />

{currentImage ? (
    <img
      className="screenshot"
      src={currentImage}
      alt="Screenshot returned"
    />
    ) : (
    <div> </div>
  )}

  <div className="container">
    <h3> Current Query Status: </h3>
    <p>
      https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
      <br></br>
      &url={inputs.url} <br></br>
      &format={inputs.format} <br></br>
      &width={inputs.width}
      <br></br>
      &height={inputs.height}
      <br></br>
      &no_cookie_banners={inputs.no_cookie_banners}
      <br></br>
      &no_ads={inputs.no_ads}
      <br></br>
    </p>
  </div>
  <div className="container">
  <Gallery images={prevImages} />
  </div>

  <div className="image-container">
        {prevImages.length > 0 ? (
          prevImages.map((img, index) => (
            <img key={index} src={img} alt={`Screenshot ${index + 1}`} />
          ))
        ) : (
          <div>
            <h3>You haven't made a screenshot yet!</h3>
          </div>
        )}
      </div>  
    <br></br>
   </div>  

  )

}

export default App
