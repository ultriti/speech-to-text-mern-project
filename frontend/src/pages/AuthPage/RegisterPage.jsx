import React from 'react'

const RegisterPage = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // API call here
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Username */}
          <div>
            <label className="block text-gray-300 mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg text-white font-semibold"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage
