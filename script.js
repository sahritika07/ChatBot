const chatInput =document.querySelector(".chat-input textarea")
const sendChatBtn =document.querySelector(".chat-input span")
const chatbox =document.querySelector(".chatbox")
const chatbotToggler =document.querySelector(".chatbot-toggler")
const chatbotCloseBtn =document.querySelector(".close-btn")

let userMessage;

const API_KEY = "sk-proj-3hcNYyYKZ1B6t4VTMxndT3BlbkFJJIVYBypMsQq5xuucADtk";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi=(message,className)=>{
    const chatLi = document.createElement("li")
    chatLi.classList.add("chat", className)
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="icon"><i class="fa-solid fa-robot"></i></span> <p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent= message
    return chatLi;
}


const generateResponse =(incomingChatLi)=>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLi.querySelector("p")
    const requestOptions={
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorisation": `Bearer ${API_KEY}` 
        },  
        body: JSON.stringify({
            "model": "gpt-3.5-turbo-0125",
            "messages": [{role:"user" , content : userMessage}]
        })
    }

    fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent =data.choices[0].messagecontent
    }).catch((error) => {
        messageElement.classList.add("error")
        messageElement.textContent = "Oops! Something went wrong. Please try again"
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight))
}

const handleChat=()=>{
    userMessage=chatInput.value.trim()
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage,"outgoing"))

    setTimeout(()=>{
        const incomingChatLi=createChatLi("Thinking..." , "incoming")
        chatbox.appendChild(incomingChatLi)
        scrollTo(0,chatbox.scrollHeight)
        generateResponse(incomingChatLi);
    }, 600)

}

chatInput.addEventListener("input" , () =>{
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chaInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown" , (e) =>{
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault()
    handleChat()
  }
})


chatbotCloseBtn.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"))
chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"))
sendChatBtn.addEventListener("click", handleChat)