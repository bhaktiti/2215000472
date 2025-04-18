import React, { useState } from 'react';
function App() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        mobileNo: '',
        githubUsername: '',
        rollNo: '',
        collegeName: '',
        accessCode: ''
    });

    const [authToken, setAuthToken] = useState('');
    const [numbersData, setNumbersData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          
            const registrationResponse = await fetch('http://20.244.56.144/evaluation-service/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!registrationResponse.ok) {
                alert('Registration failed. Please try again.');
                return;
            }

            const registrationData = await registrationResponse.json();
            alert('Registration successful! Saving credentials...');

           
            const { clientID, clientSecret } = registrationData;

            const authResponse = await fetch('http://20.244.56.144/evaluation-service/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    rollNo: formData.rollNo,
                    accessCode: formData.accessCode,
                    clientID: clientID,
                    clientSecret: clientSecret
                })
            });

            if (!authResponse.ok) {
                alert('Failed to fetch authorization token. Please try again.');
                return;
            }

            const authData = await authResponse.json();
            setAuthToken(authData.token);
            alert(`Authorization Token: ${authData.token}`);
            console.log('Authorization Token:', authData.token);

            const numbersResponse = await fetch('http://localhost:9876/numbers/e', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!numbersResponse.ok) {
                alert('Failed to fetch numbers. Please try again.');
                return;
            }

            const numbersData = await numbersResponse.json();
            setNumbersData(numbersData);
            console.log('Numbers Data:', numbersData);

            alert(`Numbers fetched successfully! Average: ${numbersData.avg}`);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container">
            <h2>Registration Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mobile Number:</label>
                    <input
                        type="text"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>GitHub Username:</label>
                    <input
                        type="text"
                        name="githubUsername"
                        value={formData.githubUsername}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Roll Number:</label>
                    <input
                        type="text"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>College Name:</label>
                    <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Access Code:</label>
                    <input
                        type="text"
                        name="accessCode"
                        value={formData.accessCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>

            {authToken && (
                <div>
                    <h3>Authorization Token</h3>
                    <p>{authToken}</p>
                </div>
            )}

            {numbersData && (
                <div>
                    <h3>Numbers Data</h3>
                    <p>Window Previous State: {JSON.stringify(numbersData.windowPrevState)}</p>
                    <p>Window Current State: {JSON.stringify(numbersData.windowCurrState)}</p>
                    <p>Numbers: {JSON.stringify(numbersData.numbers)}</p>
                    <p>Average: {numbersData.avg}</p>
                </div>
            )}
        </div>
    );
}

export default App;
