const token = localStorage.getItem('token')

if (!token){
    window.location.href="index.html"
}

function logoutProf(){
    localStorage.clear()
    window.location.reload()
}