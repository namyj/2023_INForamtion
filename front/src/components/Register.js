import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Register() {
    const navigate = useNavigate();
    const [hidePassword, setHidePassword] = useState(true);
    
    const [inputs, setInputs] = useState({  
        name: '',
        email: '',
        password: '',
        cpassword: ''
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const cpassword = e.target.cpassword.value;

        // 마지막 입력만 inputs 에 남음 
        // console.log(inputs);
        // const name = inputs.name;
        // const email = inputs.email;
        // const password = inputs.password;
        // const cpassword = inputs.cpassword;

        await axios.post("http://localhost:4000/api/register", {
            "name": name,
            "email": email,
            "password": password,
            "cpassword": cpassword
        }).then((res) => {
            console.log(res.data);
            // 회원가입 성공
            if (res.data.success) {
                alert("회원가입이 완료되었습니다.");
                return navigate("/login");
            } else {
                alert(res.data.msg);
                return navigate("/register")
            }
        }).catch((err) => {
            console.error(err);
            alert(err);
        });
    };

    const onCahngeHandler = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    }

    const onReset = () => {
        const resetInputs = {       
            name: '',
            email: '',
            password: '',
            cpassword: ''
        };
        setInputs(resetInputs);      
    };


    return (
        <section className="register">
            <div className="signup">
                <h2 className="signup_title">회원가입</h2>
                <div className="signup_main">
                    <form className="signup_form" onSubmit={onSubmitHandler}>
                        <div className="form_block">
                            <label for="name" className="form_label">이름</label><br />
                            <input
                                name="name"
                                placeholder="이름"
                                type="text"
                                className="form_input"
                                // value={inputs.name}
                                // onChange={onCahngeHandler}
                            /><br />
                        </div>
                        <div className="form_block">
                            <label for="email" className="form_label">이메일</label><br />
                            <input
                                name="email"
                                placeholder="example@gmail.com"
                                type="text"
                                className="form_input"
                                // value={inputs.email}
                                // onChange={onCahngeHandler}
                            /><br />
                        </div>
                        <div className="form_block">
                            <label for="password" className="form_label">비밀번호</label><br />
                            <input
                                name="password"
                                placeholder="비밀번호"
                                type={hidePassword ? "password":"text"}
                                className="form_input"
                                // value={inputs.password}
                                // onChange={onCahngeHandler}
                            /><br />
                        </div>
                        <div className="form_block">
                            <label for="cpassword" className="form_label">비밀번호 확인</label><br />
                            <input
                                name="cpassword"  //위에서 nickname의 값을 가져와 타겟을 가져온다.
                                placeholder="비밀번호 확인"
                                type={hidePassword ? "password":"text"}
                                className="form_input"
                                // value={inputs.cpassword}
                                // onChange={onCahngeHandler}
                            /><br />
                        </div>
                        <input value="회원가입" type="submit" className="signup_btn form_button " />
                    </form>
                </div>

            </div>
        </section>
    )
}