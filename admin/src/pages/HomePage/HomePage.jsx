import { useEffect, useState } from 'react';
import axios from 'axios';
import { Widget } from '../../components/Widget/Widget';
import { Chart } from '../../components/Chart/Chart';
import { FeatureChart } from '../../components/FeatureChart/FeatureChart';
import { HomeTable } from '../../components/HomeTable/HomeTable';
import apiReq from '../../lib/apiReq';

const INCIDENT_CATEGORIES = ['Health-related incidents', 'Security-breaches'];

export const HomePage = () => {
  const [data, setData] = useState([]);
  const [incidentCounts, setIncidentCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiReq.get('/incidents');
        const incidents = response.data;
        setData(incidents);

        const counts = {};
        const currentDate = new Date();
        const lastMonth = new Date(currentDate);
        lastMonth.setMonth(currentDate.getMonth() - 1);

        // Initialize count object
        INCIDENT_CATEGORIES.forEach((type) => {
          counts[type] = { total: 0, previousMonth: 0 };
        });

        // Count
        incidents.forEach((incident) => {
          const { type, createdAt } = incident;
          const date = new Date(createdAt);

          if (!counts[type]) {
            counts[type] = { total: 0, previousMonth: 0 };
          }

          counts[type].total++;

          if (
            date.getMonth() === lastMonth.getMonth() &&
            date.getFullYear() === lastMonth.getFullYear()
          ) {
            counts[type].previousMonth++;
          }
        });

        setIncidentCounts(counts);
      } catch (err) {
        console.error('Failed to fetch incidents:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homePage scrollbar">
      <div className="widget-section">
        <span className="main-title">Incident Summary</span>
        <div className="widgets">
          {INCIDENT_CATEGORIES.map((type) => (
            <Widget
              key={type}
              type={type}
              totalCount={incidentCounts[type]?.total || 0}
              previousCount={incidentCounts[type]?.previousMonth || 0}
            />
          ))}
        </div>
      </div>

      <div className="chart-section">
        <span className="main-title">Charts</span>
        <div className="charts">
          <FeatureChart />
          <Chart />
        </div>
      </div>

      <div className="list-section">
        <span className="main-title">Recent Incidents</span>
        <div className="list">
          <div className="listTitle">Latest Reports</div>
          <HomeTable data={data} />
        </div>
      </div>
    </div>
  );
};
