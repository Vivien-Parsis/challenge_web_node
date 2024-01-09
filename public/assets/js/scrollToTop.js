const scrollToTop = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}
const scrollVisibility = () => {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) 
    {document.getElementById("BackToTop").style.display = "block"} 
    else 
    {document.getElementById("BackToTop").style.display = "none"}
}
document.getElementById("BackToTop").onclick = scrollToTop
window.onscroll = () => {scrollVisibility()}