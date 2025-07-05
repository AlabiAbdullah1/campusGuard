// pages/AnonymousReportPage.jsx
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IncidentMap } from '../../components/Map/Map';
import UploadWidget from '../../components/UploadWidget/UploadWidget';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiReq from '../../lib/apiReq';

export const AnonymousReportPage = () => {
  const [formData, setFormData] = useState({
    type: 'Health-related incidents',
    title: '',
    description: '',
    locationName: 'University Of Ilorin',
    locationDetail: '',
    latitude: '8.4799',
    longitude: '4.6716',
    deaths: 0,
    casualties: 0,
  });

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const GEOAPIFY_API_KEY = '3f0d82668d9540628eb00a89b76847d6';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiReq.post('/anonymous', {
        incidentData: {
          ...formData,
          images,
          createdAt: new Date().toISOString(),
        },
        incidentDetail: {
          deaths: parseInt(formData.deaths),
          casualties: parseInt(formData.casualties),
        },
      });

      if (res?.data?.id) {
        navigate(`/${res.data.id}`);
      }
    } catch (err) {
      console.error("Failed to submit anonymous report", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="IncidentReportPage">
      <div className="formContainer scrollbar">
        <div className="wrapper">
          <h1>Report Anonymously</h1>
          <form onSubmit={handleSubmit}>
            {/* Incident Type */}
            <div className="input-single">
              <label htmlFor="type">Incident Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Health-related incidents">Health-related incidents</option>
                <option value="Security-breaches">Security breaches</option>
                <option value="Infrastructure issues">Infrastructure issues</option>
                <option value="Emergency services">Emergency services</option>
                <option value="Environmental concerns">Environmental concerns</option>
              </select>
            </div>

            {/* Title */}
            <div className="input-single">
              <label htmlFor="title">Title</label>
              <input name="title" type="text" value={formData.title} onChange={handleChange} required />
            </div>

            {/* Description */}
            <div className="item description">
              <label htmlFor="description">Description</label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
              />
            </div>

            {/* Map */}
            <div className="input-single">
              <label>Map Location</label>
              <IncidentMap
                onPinChange={(pos) => setFormData(prev => ({
                  ...prev,
                  latitude: pos.lat.toString(),
                  longitude: pos.lng.toString(),
                }))}
                onLocationNameChange={(name) =>
                  setFormData(prev => ({ ...prev, locationName: name, locationDetail: name }))
                }
                apiKey={GEOAPIFY_API_KEY}
                initialPosition={{ lat: 8.4799, lng: 4.6716 }}
              />
            </div>

            {/* Location Detail */}
            <div className="input-single">
              <label htmlFor="locationDetail">Additional Location Detail</label>
              <input name="locationDetail" type="text" value={formData.locationDetail} onChange={handleChange} />
            </div>

            {/* Deaths and Casualties */}
            <div className="input-multi">
              <div className="input-single">
                <label htmlFor="deaths">Number of Deaths</label>
                <input name="deaths" type="number" min="0" value={formData.deaths} onChange={handleChange} />
              </div>
              <div className="input-single">
                <label htmlFor="casualties">Number of Casualties</label>
                <input name="casualties" type="number" min="0" value={formData.casualties} onChange={handleChange} />
              </div>
            </div>

            {/* Upload Widget */}
            <div className="input-single">
              <label>Upload Incident Images</label>
              <UploadWidget
                uwConfig={{
                  cloudName: 'WarmHands',
                  uploadPreset: 'WarmHands',
                  multiple: true,
                  folder: 'incidents',
                  maxImageFileSize: 2000000,
                  allowedFormats: ['jpg', 'png', 'jpeg'],
                }}
                setState={setImages}
              />
            </div>

            {/* Submit Button */}
            <div className="btn-sec">
              <button type="submit" className="sendButton" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Submit Anonymously'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
