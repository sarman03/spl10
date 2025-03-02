import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeniorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    mobilenumber: '',
    dob: '',
    email: '',
    passportpic: null,
    aadhaar: null,
    role: '',
    batting: '',
    bowling: '',
    battingOrder: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amount = 1; // Registration fee amount in INR (hardcoded)

  useEffect(() => {
    // Add the CSS link to the head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/styles.css';
    document.head.appendChild(link);

    // Set the title
    document.title = 'Senior Registration Form';

    // Load Razorpay script
    const razorpayScript = document.createElement('script');
    razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);

    // Cleanup function
    return () => {
      document.head.removeChild(link);
      if (document.body.contains(razorpayScript)) {
        document.body.removeChild(razorpayScript);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to initiate Razorpay payment
  const initiatePayment = async () => {
    try {
      // Get Razorpay key from backend

      const apiUrl = import.meta.env.VITE_API_URL
      const { data: { key } } = await axios.get(`${apiUrl}/api/getkey`);
      
      // Create order on backend
      const { data: { order } } = await axios.post(`${apiUrl}/api/checkout`, {
        amount
      });

      // Configure Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "SPL Cricket Tournament",
        description: "Senior Registration Fee",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            await axios.post('http://localhost:4000/api/paymentverification', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userData: formData, // Send user data along with payment verification
            });
            
            // Submit to Google Sheets
            await submitToGoogleSheets(response.razorpay_payment_id);
            
            // Redirect to home page with success message
            navigate('/', { 
              state: { 
                paymentSuccess: true, 
                paymentId: response.razorpay_payment_id 
              } 
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.fullname,
          email: formData.email,
          contact: formData.mobilenumber
        },
        notes: {
          address: "SPL Cricket Tournament Office"
        },
        theme: {
          color: "#3399cc"
        }
      };

      // Check if Razorpay is loaded
      if (window.Razorpay) {
        // Initialize Razorpay
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Error initiating payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to submit data to Google Sheets
  const submitToGoogleSheets = async (paymentId) => {
    // Create an object to store form data
    const dataForSheets = {};
    
    // Process form data including file uploads
    for (const key in formData) {
      if (formData[key] instanceof File && formData[key]) {
        // For file inputs, convert to base64
        try {
          const base64Data = await convertFileToBase64(formData[key]);
          dataForSheets[key] = base64Data.split(',')[1]; // Remove the data:image/jpeg;base64, part
        } catch (error) {
          console.error(`Error converting ${key} to base64:`, error);
        }
      } else {
        // For regular inputs
        dataForSheets[key] = formData[key];
      }
    }
    
    // Add payment ID to the data
    dataForSheets.paymentId = paymentId;
    
    try {
      // Submit to Google Sheets - Note: You might want to use a different Google Sheet for seniors
      const response = await fetch("https://script.google.com/macros/s/AKfycbwd146VzhI3nm-8nZc4XgSyHbCVKHPt7ViC0atC2BPgFKiTy4vAy8a2CUPaArX9etV0fg/exec", {
        method: "POST",
        body: new URLSearchParams(dataForSheets),
      });
      
      const result = await response.text();
      console.log('Google Sheets submission result:', result);
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data here if needed
      
      // Initiate payment
      await initiatePayment();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form: ' + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reg-container">
      <div className="logo-container">
        <img src="/res/backdrop/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="form-container">
        <h2>Senior Registration Form</h2>
        <form id="registrationForm" onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="fullname">Full Name:</label>
          <input 
            type="text" 
            id="fullname" 
            name="fullname" 
            value={formData.fullname}
            onChange={handleChange}
            required 
          />
          
          <label htmlFor="mobilenumber">Mobile Number:</label>
          <input 
            type="tel" 
            id="mobilenumber" 
            name="mobilenumber" 
            value={formData.mobilenumber}
            onChange={handleChange}
            required 
          />
          
          <label htmlFor="dob">Date of Birth:</label>
          <input 
            type="date" 
            id="dob" 
            name="dob" 
            value={formData.dob}
            onChange={handleChange}
            required 
          />

          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />

          <label htmlFor="passportpic">Passport Size Pic:</label>
          <input 
            type="file" 
            id="passportpic" 
            name="passportpic" 
            onChange={handleChange}
            accept="image/*" 
            required 
          />

          <label htmlFor="aadhaar">Aadhaar Card:</label>
          <input 
            type="file" 
            id="aadhaar" 
            name="aadhaar" 
            onChange={handleChange}
            accept="image/*,application/pdf" 
            required 
          />

          <label htmlFor="role">Playing Role:</label>
          <select 
            id="role" 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="bowler">Bowler</option>
            <option value="batsman">Batsman</option>
            <option value="wicketkeeper">Wicketkeeper</option>
            <option value="allrounder">Allrounder</option>
          </select>

          <label htmlFor="batting">Batting (L/R):</label>
          <select 
            id="batting" 
            name="batting" 
            value={formData.batting}
            onChange={handleChange}
            required
          >
            <option value="left">Left Handed</option>
            <option value="right">Right Handed</option>
          </select>

          <label htmlFor="bowling">Bowling Style:</label>
          <select 
            id="bowling" 
            name="bowling" 
            value={formData.bowling}
            onChange={handleChange}
            required
          >
            <option value="">Select Bowling Style</option>
            <option value="Left Arm Fast">Left Arm Fast</option>
            <option value="Right Arm Fast">Right Arm Fast</option>
            <option value="Left Arm Medium">Left Arm Medium</option>
            <option value="Right Arm Medium">Right Arm Medium</option>
            {/* <option value="Left Arm Spin">Left Arm Spin</option>
            <option value="Right Arm Spin">Right Arm Spin</option> */}
            <option value="None">None</option>
          </select>

          <label htmlFor="battingOrder">Preferred Batting Order:</label>
          <select 
            id="battingOrder" 
            name="battingOrder" 
            value={formData.battingOrder}
            onChange={handleChange}
            required
          >
            <option value="">Select Batting Position</option>
            <option value="opener">Opener</option>
            <option value="topOrder">Top Order (1-3)</option>
            <option value="middleOrder">Middle Order (4-6)</option>
            <option value="lowerOrder">Lower Order (7-11)</option>
          </select>
          
          <div className="button-container">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : <span>Pay & Register (₹999<span style={{ fontSize: '0.7em' }}>+GST</span>)</span>}
            </button>
            <Link to="/" className="cancel-btn">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeniorRegistration; 