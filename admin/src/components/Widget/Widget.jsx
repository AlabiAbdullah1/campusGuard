import './Widget.scss';
import ReportIcon from '@mui/icons-material/Report';
import SecurityIcon from '@mui/icons-material/Security';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EmergencyIcon from '@mui/icons-material/Emergency';
// import EcoIcon from '@mui/icons-material/Eco';


export const Widget = ({ type, totalCount, previousCount }) => {
  let data;

  switch (type) {
    case 'Health-related incidents':
      data = {
        title: 'HEALTH INCIDENTS',
        // link: 'View all',
        icon: (
          <HealthAndSafetyIcon
            className="icon"
            style={{ color: 'green', backgroundColor: 'rgba(0,255,0,0.1)' }}
          />
        ),
      };
      break;
    case 'Security-breaches':
      data = {
        title: 'SECURITY BREACHES',
        // link: '/incidents',
        icon: (
          <SecurityIcon
            className="icon"
            style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.1)' }}
          />
        ),
      };
      break;
       case 'Infrastructure issues':
      data = {
        title: 'INFRASTRUCTURE ISSUES',
        // link: 'View all',
        icon: (
          <EngineeringIcon
            className="icon"
            style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.1)' }}
          />
        ),
      };
      break;
      case 'Emergency services':
      data = {
        title: 'EMERGENCY SERVICES',
        // link: 'View all',
        icon: (
          <EmergencyIcon
            className="icon"
            style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.1)' }}
          />
        ),
      };
      break;
      case 'Environmental concerns':
      data = {
        title: 'ENVIRONMENTAL CONCERNS',
        // link: 'View all',
        icon: (
          <HealthAndSafetyIcon
            className="icon"
            style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.1)' }}
          />
        ),
      };
      break;
      case 'Other':
      data = {
        title: 'OTHER INCIDENTS',
        // link: 'View all',
        icon: (
          <ReportIcon
            className="icon"
            style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.1)' }}
          />
        ),
      };
      break;
    default:
      data = {
        title: 'UNKNOWN INCIDENTS',
        // link: 'View all',
        icon: (
          <ReportIcon
            className="icon"
            style={{ color: 'gray', backgroundColor: 'rgba(0,0,0,0.1)' }}
          />
        ),
      };
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{totalCount}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        {data.icon}
        <div className="stat">
          Last Month: <strong>{previousCount}</strong>
        </div>
      </div>
    </div>
  );
};
