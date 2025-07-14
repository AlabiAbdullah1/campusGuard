import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IncidentMap } from '../../components/Map/Map';
import UploadWidget from '../../components/UploadWidget/UploadWidget';
import apiReq from '../../lib/apiReq';
import { useNavigate } from 'react-router-dom';

export const IncidentReportPage = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePinChange = (newPosition) => {
    setFormData(prev => ({
      ...prev,
      latitude: newPosition.lat.toString(),
      longitude: newPosition.lng.toString()
    }));
  };

  const handleLocationNameChange = (name) => {
    setFormData(prev => ({ 
      ...prev, 
      locationName: name,
      locationDetail: prev.locationDetail || name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      const res = await apiReq.post('/incidents', {
        incidentData: {
          type: formData.type,
          title: formData.title,
          description: formData.description,
          locationName: formData.locationName,
          locationDetail: formData.locationDetail,
          latitude: formData.latitude,
          longitude: formData.longitude,
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
    } catch (error) {
      console.error('Error submitting incident:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="IncidentReportPage">
      <div className="formContainer scrollbar">
        <h1>Report New Incident</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="input-multi-custom">
              <div className="input-single">
                <label htmlFor="type">Incident Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Health-related incidents">Health-related incidents</option>
                  <option value="Security-breaches">Security breaches</option>
                  <option value="Infrastructure issues">Infrastructure issues</option>
                  <option value="Emergency services">Emergency services</option>
                  <option value="Environmental concerns">Environmental concerns</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-single">
                <label htmlFor="title">Title</label>
                <input 
                  id="title" 
                  name="title" 
                  type="text" 
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill 
                theme="snow" 
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                  ]
                }}
              />
            </div>

            <div className="input-group">
              <label>Incident Location</label>
              <IncidentMap 
                onPinChange={handlePinChange}
                onLocationNameChange={handleLocationNameChange}
                apiKey={GEOAPIFY_API_KEY}
                initialPosition={{
                  lat: parseFloat(formData.latitude),
                  lng: parseFloat(formData.longitude)
                }}
              />
              
              <div className="input-single">
                <label>Location Name (from map)</label>
                <input
                  type="text"
                  value={formData.locationName}
                  readOnly
                  className="location-name-input"
                  placeholder="Click on the map to select location"
                />
              </div>
              
              <div className="input-single">
                <label htmlFor="locationDetail">Additional Location Details</label>
                <input
                  name="locationDetail"
                  type="text"
                  value={formData.locationDetail}
                  onChange={handleInputChange}
                  placeholder="Building name, floor, room number, etc."
                />
              </div>

              <div className="input-multi">
                <div className="input-single">
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    name="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-single">
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    name="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-multi">
              <div className="input-single">
                <label htmlFor="deaths">Deaths</label>
                <input 
                  name="deaths" 
                  type="number" 
                  min="0"
                  value={formData.deaths}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-single">
                <label htmlFor="casualities">Casualties</label>
                <input
                  name="casualties"
                  type="number"
                  min="0"
                  value={formData.casualties}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="btn-sec">
              <button type="submit" className="sendButton" disabled={isLoading}>
                {isLoading ? 'Reporting...' : 'Report Incident'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="sideContainer">
        <div className="images">
          {images.map((image, index) => (
            <img src={image} key={index} alt="Incident evidence" />
          ))}
        </div>

        <UploadWidget
          uwConfig={{
            cloudName: 'dxpou46n9',
            uploadPreset: 'CampusGuard',
            multiple: true,
            folder: 'incidents',
            maxImageFileSize: 2000000,
            allowedFormats: ['jpg', 'png', 'jpeg']
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
};