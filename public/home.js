let joining_link = document.getElementById("joining-link").name;
console.log(joining_link);
// let join_meeting = document.getElementById("join-meet");
// join_meeting.addEventListener("click",()=>{
//     console.log("Click Join Meeting");
//     window.location.assign(`${joining_link}`);
// })
let host_meeting = document.getElementById("host-meet");
host_meeting.addEventListener("click", ()=>{
    console.log("Clicked Host Meeting");
    window.location.href = "www.facebook.com";

})