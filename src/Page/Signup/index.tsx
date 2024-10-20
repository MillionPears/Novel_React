import React, { useState } from "react";

function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập - có thể gọi API để kiểm tra thông tin đăng nhập
    console.log("Email:", email);
    // Đặt logic xử lý đăng nhập 
  };

  return (
    <div className="mt-40 sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="mb-4">
        <a href="/">
          <img
            className="mx-auto h-20 w-auto"
            src="https://auth.spiderum.com/assets-auth/images/spiderum-logo.png"
            alt="Workflow"
          />
        </a>
      </div>
      <div >
        <p>Đăng ký bằng email</p>
        <form action="" method="post">
          <input
            type="text"
            className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none'
            placeholder="Email@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none'
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none'
            placeholder="Nhập lại mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-sky_blue_light text-center text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >Send</button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
