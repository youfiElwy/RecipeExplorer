import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginbg from '../../assets/images/loginbg.jpg';
import axios from 'axios';
import ip from '../../not_dot_env';
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		// Perform login action here (e.g., call backend API)

		async function loginUser() {
			setIsLoading(true);
			try {
				const response = await axios
					.post(
						`${ip}auth/signIn`,
						{
							email: email,
							password: password,
						},
						{ withCredentials: true }
					)
					.then((response) => {
						if (response.status === 200) {
							// save cookie from res data token
							console.log('response.data.token', response.data.token);
							console.log('response.data.id', response.data.id);
							// saving to session storage
							sessionStorage.setItem('token', response.data.token);
							sessionStorage.setItem('userId', response.data.id);
							navigate('/home');
						} else {
							alert('Login failed. Please try again.');
						}
					});
			} catch (err) {
				// alert('Login failed. Please try again.' + err.response.data.error);
				// alert(`${ip}auth/signIn`);
				// console.log('DAMN BRUH, ERROR', err.response.data.error);
			}
			setIsLoading(false);
		}
		loginUser();
	};

	return (
		<>
			<section className="mb-32">
				<div
					className="relative overflow-hidden bg-cover bg-no-repeat bg-[50%] h-[500px]"
					style={{ backgroundImage: `url(${loginbg})` }}
				></div>
				<div className="container mx-auto px-6 md:px-12 xl:px-32">
					<div className="text-center">
						<div className="mt-[-170px] block rounded-lg bg-[hsla(0,0%,100%,0.55)] bg-[hsla(0,0%,100%,0.7)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] backdrop-blur-[30px] dark:bg-[hsla(0,0%,5%,0.55)] dark:shadow-black/20 md:py-16 md:px-12">
							<div className="hero-content flex-col lg:flex-row-reverse">
								<div className="text-center lg:text-left">
									<h1 className="text-5xl font-bold text-white">Login now!</h1>
									<p className="py-6 text-white">
										Discover the flavors of the world with our curated collection of
										mouthwatering recipes. From comforting classics to exotic delights,
										embark on a culinary journey like no other.
									</p>
								</div>
								<div className="card shrink-0 w-full max-w-sm">
									<form className="card-body">
										{/* EMAIL INPUT */}
										<div className="form-control">
											<label className="label">
												<span className="label-text text-white">Email</span>
											</label>
											<label className="input input-bordered flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 16 16"
													fill="currentColor"
													className="w-4 h-4 opacity-70"
												>
													<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
													<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
												</svg>
												<input
													type="text"
													className="grow"
													placeholder="Email"
													required
													value={email}
													onChange={handleEmailChange}
												/>
											</label>
										</div>
										{/* PASSWORD INPUT */}
										<div className="form-control">
											<label className="label">
												<span className="label-text text-white">Password</span>
											</label>
											<label className="input input-bordered flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 16 16"
													fill="currentColor"
													className="w-4 h-4 opacity-70"
												>
													<path
														fillRule="evenodd"
														d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
														clipRule="evenodd"
													/>
												</svg>
												<input
													type="password"
													className="grow"
													placeholder="Password"
													required
													value={password}
													onChange={handlePasswordChange}
												/>
											</label>
										</div>
										{/* LOGIN BUTTON */}
										<div className="form-control mt-6">
											<button
												className="btn btn-accent text-white"
												onClick={(e) => handleLogin(e)}
												disabled={isLoading}
											>
												{isLoading ? 'Logging' : 'Login'}
												{isLoading && <span className="loading loading-spinner"></span>}
											</button>
										</div>
										<label className="label">
											<Link to="/signup" className="label-text-alt link text-accent">
												Don't have an account? Register now!
											</Link>
										</label>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default LoginPage;
