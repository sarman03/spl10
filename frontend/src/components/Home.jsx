import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const paymentSuccess = location.state?.paymentSuccess;
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    // Add the script and CSS links to the head
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.media = 'screen and (min-width: 768px)';
    link1.href = '/styles/main.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.media = 'screen and (max-width: 768px)';
    link2.href = '/styles/main-m.css';
    document.head.appendChild(link2);

    // Add Font Awesome
    const script = document.createElement('script');
    script.src = 'https://kit.fontawesome.com/78929323b4.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Add favicon
    const favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.href = '/res/brandkit/favicon-logo.jpeg';
    favicon.type = 'image/x-icon';
    document.head.appendChild(favicon);

    // Set the title
    document.title = 'SAGAR CRICKET TOURNAMENT SAGAR';

    // Add the main-app.js script
    const mainScript = document.createElement('script');
    mainScript.src = '/scripts/main-app.js';
    mainScript.defer = true;
    document.body.appendChild(mainScript);

    // Cleanup function
    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(script);
      document.head.removeChild(favicon);
      document.body.removeChild(mainScript);
    };
  }, []);

  // const scrollToView = (id) => {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  return (
    <div className="main-container">
      {/* Header section */}
      <header>
        {/* <div className="indev-info">We are working hard to bring you the best experience.</div>

        <div className="nav-bar">
          <div className="nav-bar-blinds"></div>
          <div className="nav-bar-logo"></div>
          <div className="nav-bar-items">
            <div className="item-link"><a onClick={() => scrollToView('events')}>Events</a></div>
            <div className="item-link"><a onClick={() => scrollToView('partners')}>Partners</a></div>
            <div className="item-link"><a onClick={() => scrollToView('faqs')}>FAQs </a></div>
            <div className="item-link"><a onClick={() => scrollToView('community')}>Community</a></div>
          </div>
          <div className="nav-bar-hamburger">
            <i className="fa-solid fa-bars-staggered"></i>
          </div>
        </div> */}

        <div className="main-body" id="home">
          <video autoPlay muted loop preload="none">
            <source src="/res/backdrop/Grunge Cricket Intro Premier Pro Template (online-video-cutter.com).mp4" />
          </video>
          <div className="main-body-objective">
            <div className="objective-title"> SAGAR PREMIER LEAGUE </div>
            <div className="objective-subtitle highlight-text-dark">
              THE BIGGEST NIGHT TOURNAMENT
            </div>
            <div className="objective-description">
              SPL SEASON 3
            </div>
          </div>
        </div>

        {/* section-divider */}
        <div className="section-divider">
          <marquee behavior="scroll" direction="left" scrollAmount="10" onMouseOver={(e) => e.target.stop()} onMouseOut={(e) => e.target.start()}>
            <span className="scroll-item"><i className="fa-solid fa-code"></i>IPL NAHI SPL DEKHO !!</span>
            <span className="scroll-item"><i className="fa-solid fa-globe"></i>SELECTION VIA AUCTION </span>
            <span className="scroll-item"><i className="fa-solid fa-hand-peace"></i>REGISTER NOW!</span>
            <span className="scroll-item"><i className="fa-solid fa-life-ring"></i>APPLICATION IS LIVE </span>
          </marquee>
        </div>
      </header>
      
      {/* Payment success message */}
      {paymentSuccess && (
        <div className="payment-success-message" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: 'white'
        }}>
          <div className="success-content" style={{
            backgroundColor: '#000',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            maxWidth: '500px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <i className="fa-solid fa-circle-check" style={{
              fontSize: '4rem',
              color: '#4CAF50',
              marginBottom: '1rem'
            }}></i>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Registration Successful!</h3>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your payment has been processed successfully.</p>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Payment ID: <span style={{ fontWeight: 'bold' }}>{paymentId}</span></p>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Thank you for registering for the SPL Cricket Tournament!</p>
            
            {/* WhatsApp Group Join Button */}
            <a 
              href="https://chat.whatsapp.com/D6cTv6CCK5R1KFBJoSZX7k" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => {
                window.history.replaceState({}, document.title);
              }}
              style={{
                display: 'block',
                backgroundColor: '#25D366', // WhatsApp green color
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '5px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#128C7E'} 
              onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
            >
              <i className="fab fa-whatsapp" style={{ marginRight: '8px' }}></i>
              Join SPL WhatsApp Group
            </a>
          </div>
        </div>
      )}
      
      {/* Events Section */}
      <div className="events-container" id="events">
        <div className="events-title highlight-text-dark">Events</div>
        <div className="slider-container">
          <div className="slider-prev"><i className="fa-solid fa-chevron-left"></i></div>
          <div className="slider-view">
            <div className="view-event-cards">
              <div className="event-card event-card-4">
                <div className="event-thumbnail">
                  <img src="/res/backdrop/logo.png" alt="Event 1" />
                </div>
                <div className="event-details">
                  <h3>SPL SEASON 3 : BIGGEST NIGHT CRICKET TOURNAMENT</h3>
                  <p>Rules:</p>
                  <div className="event-details-desc">
                    <p>खिलाड़ियों का चयन नीलामी प्रक्रिया द्वारा किया जाएगा </p>
                    <p>अपनी प्लेइंग 11 में दो जूनियर खिलाड़ियों का चयन करना अनिवार्य है </p>
                    <p>एसपीएल में किसी भी खिलाड़ी को मैच फीस नहीं दी जाएगी </p>
                    <p>जो भी खिलाड़ी मैच फीस चाहते है,कृपया वह खिलाड़ी फॉर्म न भरे</p>
                    <p>जो भी खिलाड़ी मैच में उपलप्ध नही हो पाएगा वो फॉर्म ना भरे</p>
                  </div>
                  <div className="event-btns">
                    {/* <Link to="/junior-registration" className="register-button">Junior<i className="fa-solid fa-up-right-from-square"></i></Link> */}
                    <Link to="/senior-registration" className="register-button">Senior<i className="fa-solid fa-up-right-from-square"></i></Link>
                    {/* <Link to="/team-registration" className="register-button">Team<i className="fa-solid fa-up-right-from-square"></i></Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="slider-next"><i className="fa-solid fa-chevron-right"></i></div>
        </div>
      </div>

      {/* ORGANISERS */}
      <div className="partners-container" id="partners">
        <h2 className="partners-title highlight-text-dark">Our Organisers</h2>
        <div className="organizers-grid">
          <div className="organizer-card">
            <a href="https://www.instagram.com/adityapandey9126?igsh=MXMyc3o4dHBoZW9tOQ==" target="_blank" className="organizer-link">
              <div className="organizer-image-container">
                <img src="/res/images/partners/aditya pandey.jpg" alt="Aditya Pandey" className="organizer-image" />
                <div className="organizer-overlay">
                  <h3 className="organizer-name">ADITYA PANDEY</h3>
                  <p className="organizer-phone">9074111184</p>
                  <div className="instagram-icon">
                    <i className="fab fa-instagram"></i>
                  </div>
                </div>
              </div>
            </a>
          </div>
          
          
          
          <div className="organizer-card">
            <a href="https://www.instagram.com/anwarkhan224679?igsh=MTM2Z3h1ZzBla256aw==" target="_blank" className="organizer-link">
              <div className="organizer-image-container">
                <img src="/res/images/partners/WhatsApp Image 2024-04-13 at 12.57.59_ea3b1001.jpg" alt="Anwar Khan" className="organizer-image" />
                <div className="organizer-overlay">
                  <h3 className="organizer-name">ANWAR KHAN</h3>
                  <p className="organizer-phone">8770176369</p>
                  <div className="instagram-icon">
                    <i className="fab fa-instagram"></i>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="organizer-card">
            <a href="https://www.instagram.com/milesmaker_?__pwa=1" target="_blank" className="organizer-link">
              <div className="organizer-image-container">
                <img src="/res/images/partners/org4.jpg" alt="Piyush Pandey" className="organizer-image" />
                <div className="organizer-overlay">
                  <h3 className="organizer-name">PIYUSH PANDEY</h3>
                  <p className="organizer-phone">7047786666</p>
                  <div className="instagram-icon">
                    <i className="fab fa-instagram"></i>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="organizer-card">
            <a href="https://www.instagram.com/abhi_sagar_17/?igsh=Z203d2g3dTgzcGwx" target="_blank" className="organizer-link">
              <div className="organizer-image-container">
                <img src="/res/images/partners/WhatsApp Image 2024-04-13 at 13.48.53_7b16daa9.jpg" alt="Abhi Sagar" className="organizer-image" />
                <div className="organizer-overlay">
                  <h3 className="organizer-name">ABHI SAGAR</h3>
                  <p className="organizer-phone">9074111184</p>
                  <div className="instagram-icon">
                    <i className="fab fa-instagram"></i>
                  </div>
                </div>
              </div>
            </a>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Home; 