import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeamRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    teamOwner: '',
    ownerMobile: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amount = 1798; // Registration fee amount in INR (hardcoded)

  useEffect(() => {
    // Add the CSS link to the head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/styles.css';
    document.head.appendChild(link);

    // Set the title
    document.title = 'Team Registration Form';

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
      // Replace all instances of http://localhost:4000 with:
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // For example:
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
        description: "Team Registration Fee",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            await axios.post(`${apiUrl}/api/paymentverification`, {
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
          name: formData.teamOwner,
          contact: formData.ownerMobile
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
    const dataForSheets = {
      teamName: formData.teamName,
      teamOwner: formData.teamOwner,
      ownerMobile: formData.ownerMobile,
      paymentId: paymentId
    };
    
    try {
      // Submit to Google Sheets - Replace with your new Web App URL
      const response = await fetch("https://script.google.com/macros/s/AKfycbwIlBCp-Py93EV2jLLzwrq5ZiTI7gERh54-mZYUHE_9DgQ6-z0BAiwlOCjHJXIRH9b6/exec", {
        method: "POST",
        body: new URLSearchParams(dataForSheets),
        mode: 'no-cors' // Important for cross-origin requests
      });
      
      console.log('Google Sheets submission completed');
      return true;
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
        <h2>Team Registration Form</h2>
        <form id="registrationForm" onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="teamName">Team Name:</label>
          <input 
            type="text" 
            id="teamName" 
            name="teamName" 
            value={formData.teamName}
            onChange={handleChange}
            required 
          />
          
          <label htmlFor="teamOwner">Team Owner:</label>
          <input 
            type="text" 
            id="teamOwner" 
            name="teamOwner" 
            value={formData.teamOwner}
            onChange={handleChange}
            required 
          />
          
          <label htmlFor="ownerMobile">Owner Mobile Number:</label>
          <input 
            type="tel" 
            id="ownerMobile" 
            name="ownerMobile" 
            value={formData.ownerMobile}
            onChange={handleChange}
            required 
          />
          
          <div className="button-container">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : <span>Pay & Register (₹1499<span style={{ fontSize: '0.7em' }}>+GST</span>)</span>}
            </button>
            <Link to="/" className="cancel-btn">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamRegistration; 