import { useState } from 'react';
import './ContactForm.scss';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';

export default function ContactForm() {
  const [result, setResult] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);
    formData.append("access_key", "9fcb156c-95ce-4d92-b3dd-5fdf7f8088cf");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="contactForm">
      <form onSubmit={onSubmit}>
        <h2>Contact Us</h2>
        <label>Name</label>
        <div className="input">
          <PersonIcon className="icon" />
          <input type="text" name="name" placeholder="Enter Your Name" required />
        </div>

        <label>Email</label>
        <div className="input">
          <MailIcon className="icon" />
          <input type="email" name="email" placeholder="Enter Your Email" required />
        </div>

        <label>Message</label>
        <div className="input">
          <textarea name="message" placeholder="Your message..." required />
        </div>

        <button type="submit">Send Message</button>
      </form>

      {result && (
        <span
          className={`submit-msg ${
            result === 'Sending...'
              ? 'sending'
              : result === 'Form Submitted Successfully'
              ? 'sent'
              : ''
          }`}
        >
          {result}
        </span>
      )}
    </div>
  );
}
