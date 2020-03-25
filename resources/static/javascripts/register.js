//회원가입 summit조건을 만족하는 정규식 로직

//회원가입폼에서 받을 데이터를 모아놓은 객체
const form = document.getElementById('register-form');//submit할때 값을 받아올 form 
const pw = document.getElementById('pw-put');//pw를 받는 input
const pw_span = document.getElementById('pw-span');//id 상태표시 span
const name = document.getElementById('name-put');//name을 받는 input
const name_span = document.getElementById('name-span');//id 상태표시 span
const email = document.getElementById('email-put');//email을 받는 input
const email_span = document.getElementById('email-span');//id 상태표시 span
const register_btn = document.getElementById('register-btn');//데이터를 전송할 button

// 아이디가 적합한지 검사할 정규식
const type1 = /^[a-zA-Z0-9]{4,}$/;
// 비밀번호가 적합한지 검사할 정규식
const type2 = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
//이름이 적합한지 검사할 정규식
const type3 = /^[가-힣a-zA-Z]{2,10}$/;
// 이메일이 적합한지 검사할 정규식
const type4 = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

//pw의 값을 확인하고 조건을 만족하면 true를 넘겨주는 함수
function check_pw(){
    if(!pw.value){//pw에 값이 없을때
        pw_span.style.color = "tomato";
        pw_span.innerText = "비밀번호를 입력해주세요.";
        pw.focus();
        return false;
    }else if(!type2.test(pw.value)){//비밀번호가 정규식1번의 조건을 만족하지 않을때
        pw_span.style.color = "tomato";
        pw_span.innerText = "비밀번호 정규식을 맞춰주세요!";
        pw.focus();
        return false;
    }else{//값이 정상적으로 들어오고 정규식을 만족했다면
        pw_span.style.color = "green";
        pw_span.innerText = "정상적인 입력입니다!";
        return true;
    }
}


//name의 값을 확인하고 조건을 만족하면 true를 넘겨주는 함수
function check_name(){
    if(!name.value){//이름에에 값이 없을때
        name_span.style.color = "tomato";
        name_span.innerText = "이름을 입력해주세요.";
        name.focus();
        return false;
    }else if(!type3.test(name.value)){//이름 정규식을 만족하지 않을경우
        name_span.style.color = "tomato";
        name_span.innerText = "한글, 또는 영문이름만 입력해주세요.(2글자이상)";
        name.focus();
        return false;
    }else{//값이 있고, 정규식을 만족하면
        name_span.style.color = "green";
        name_span.innerText = "정상적인 입력입니다!";
        return true;
    }
}

//email의 값을 확인하고 조건을 만족하면 true를 넘겨주는 함수
function check_email(){
    if(!email.value){//이름에에 값이 없을때
        email_span.style.color = "tomato";
        email_span.innerText = "이메일을 입력해주세요.";
        email.focus();
        return false;
    }else if(!type4.test(email.value)){//이메일 정규식을 만족하지 않을경우
        email_span.style.color = "tomato";
        email_span.innerText = "이메일형식이 아닙니다.";
        email.focus();
        return false;
    }else{//값이 정상적으로 들어오고 정규식을 만족하면
        email_span.style.color = "green";
        email_span.innerText = "정상적인 입력입니다!";
        return true;
    }
}

//submit을 했을때 전체조건을 만족해야 data를 넘기는 함수
form.addEventListener('submit',function(event){
    //check_ex() 표현은 -> check_ex === true 와 같다. 모든 조건이 참일때 submit이 될것이다.
    if(check_pw() && check_name() && check_email()){
        alert('회원가입이 완료되었습니다.');
    }else{
        console.log("거짓입니다.");
        event.preventDefault();
    }
});

//사용자의 시각적인 편의를 위해 버튼을 누르고 뭐가 틀렸는지 보기 이전에
//잘못된 양식을 기입하고 input을 빠져나왔을때 바로바로 보여주는 이벤트모음
pw.onblur = check_pw;//id 인풋박스에서 나왔을때
name.onblur = check_name;//id 인풋박스에서 나왔을때
email.onblur = check_email;//email 인풋박스에서 나왔을때







