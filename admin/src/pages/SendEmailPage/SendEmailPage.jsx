import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminAuthContext } from '../../context/AuthContext';

export const SendEmailPage = () => {
  const incident = useLoaderData();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentAdmin } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const toastContainerId = 'sendEmail-toast';


  useEffect(() => {
    console.log("Incidents: ", incident);
  
  }, [currentAdmin]);
  

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage, {
        containerId: toastContainerId,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    setSubject(`New Incident Alert: ${incident.title} in ${incident.locationDetail}`);

    const sanitizedHtml = DOMPurify.sanitize(incident.description);
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedHtml, 'text/html');
    const plainTextDescription = doc.body.textContent || '';

    console.log(incident)

    const additionalInfo = `Incident Summary:
  - Location: ${incident.locationDetail}
  - Deaths: ${incident.incidentDetail.deaths || '0'}
  - Casualties: ${incident.incidentDetail.casualities || '0'}

Disaster Details:
  ${plainTextDescription}

View the full disaster report here: http://localhost:5174/${incident.id}`;

    setMessage(additionalInfo);
  }, [incident]);

  const handleUpdateSentEmail = async () => {
    try {
      await axios.put(`http://localhost:8800/api/incidents/${incident.id}/email-sent`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async () => {
    setIsLoading(true);

    if (!subject || !message) {
      toast.error('Please fill in all fields', {
        containerId: toastContainerId,
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending email with subject:', subject);
      console.log('Message:', message);
      console.log('Admin ID:', currentAdmin?.id);

      await axios.post(
        `http://localhost:8800/api/users/send-emails`,
        {
          subject,
          message,
        },
        { withCredentials: true }
      );

      await axios.post(
        `http://localhost:8800/api/emails/add`,
        {
          title: subject,
          location: incident.locationDetail,
          message,
          incidentId: incident.id,
        },
        { withCredentials: true }
      );

      toast.success('Emails sent successfully', {
        containerId: toastContainerId,
      });

      await handleUpdateSentEmail();
      console.log('Emails sent successfully');

      navigate(`/disasters`, {
        state: { toastMessage: 'Emails sent successfully!', refresh: true },
      });
    } catch (error) {
      // toast.error('Failed to send emails', { containerId: toastContainerId });
      toast.error(error.message, {containerId: toastContainerId})
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(`/${incident.id}`);
  };

  return (
    <div className="sendEmailPage">
      <span className="title">Compose Email</span>
      <div className="email">
        <div className="information">
          <p>
            <span>Location: </span>
            {incident.locationDetail}
          </p>
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            rows="15"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="email-btns">
          <span onClick={goBack}>Cancel</span>
          <button
            onClick={!isLoading ? handleSend : null}
            disabled={isLoading}
            className={isLoading ? 'disabled' : ''}
          >
            {incident.sentEmail ? 'Send Again' : 'Send'}
          </button>
        </div>
      </div>

      {incident.sentEmail && (
        <div className="email-sent-message">
          Emails for this incident have already been sent.
        </div>
      )}

      <ToastContainer containerId={toastContainerId} />
    </div>
  );
};
