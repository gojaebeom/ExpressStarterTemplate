const form = document.getElementById('login-form');
const login_btn = document.getElementById('login-btn');



login_btn.onclick = () =>{
    console.log($("#login-form").serialize());
    $.ajax({
        type:"POST",
        url:"/api/user/login",
        data:$("#login-form").serialize(),
        success: function(json){
            console.log(json);
        },
        error: function(xhr, status, error) {
            alert(error);
        }  
    });
}

$.ajax({
    type:"GET",
    url:"/api/user/auth",
    success: function(json){
        console.log(json);
    },
    error: function(xhr, status, error) {
        alert(error);
    }  
});




