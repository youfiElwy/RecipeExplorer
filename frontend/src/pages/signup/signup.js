import { Link, useNavigate } from 'react-router-dom';
import loginbg from '../../assets/images/loginbg.jpg';
import React, { useState } from 'react';

function SignupPage() {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleSignup = async () => {
		// Add your signup logic here
		async function singupUser() {
			const response = await fetch('http://localhost:5000/auth/signUp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userName: username, email: email, password: password }),
			});
			return response;
		}

		const signupSuccess = await singupUser();

		if (signupSuccess.status === 200) {
			navigate('/');
		}
		else {
			alert('Signup failed. Please try again.');
		}
	};

	return (
		<>
			<section class="mb-32">
				<div
					className="relative overflow-hidden bg-cover bg-no-repeat bg-[50%] h-[500px]"
					style={{ backgroundImage: `url(${loginbg})` }}
				></div>
				<div class="container mx-auto px-6 md:px-12 xl:px-32">
					<div class="text-center">
						<div class="mt-[-170px] block rounded-lg bg-[hsla(0,0%,100%,0.55)] bg-[hsla(0,0%,100%,0.7)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] backdrop-blur-[30px] dark:bg-[hsla(0,0%,5%,0.55)] dark:shadow-black/20 md:py-16 md:px-12">
							<div className="hero-content flex-col lg:flex-row-reverse">
								<div className="text-center lg:text-left">
									<h1 className="text-5xl font-bold text-white">Signup now!</h1>
									<p className="py-6 text-white">
										Discover the flavors of the world with our curated collection of
										mouthwatering recipes. From comforting classics to exotic delights,
										embark on a culinary journey like no other. SIGN UP NOW AND JOIN US!
									</p>
								</div>
								<div className="card shrink-0 w-full max-w-sm">
									<form className="card-body">
										<div className="form-control">
											{/* USERNAME INPUT */}
											<label className="label">
												<span className="label-text text-white">Username</span>
											</label>
											<label className="input input-bordered flex items-center gap-2">
												<input
													type="text"
													className="grow"
													placeholder="Username"
													value={username}
													onChange={handleUsernameChange}
													required
												/>
											</label>
											{/* EMAIL INPUT */}
											<label className="label">
												<span className="label-text text-white">Email</span>
											</label>
											<label className="input input-bordered flex items-center gap-2">
												<input
													type="text"
													className="grow"
													placeholder="Email"
													value={email}
													onChange={handleEmailChange}
													required
												/>
											</label>
										</div>
										<div className="form-control">
											{/* PASSWORD INPUT */}
											<label className="label">
												<span className="label-text text-white">Password</span>
											</label>
											<label className="input input-bordered flex items-center gap-2">
												<input
													type="password"
													className="grow"
													placeholder="Password"
													value={password}
													onChange={handlePasswordChange}
													required
												/>
											</label>
										</div>
										{/* SIGN UP BUTTON */}
										<div className="form-control mt-6">
											<button
												className="btn btn-accent text-white"
												onClick={handleSignup}
											>
												Signup
											</button>
										</div>
										<label className="label">
											<Link to="/" className="label-text-alt link text-accent">
												Already have an account? Login now!
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

export default SignupPage;
