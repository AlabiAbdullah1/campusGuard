import apiReq from './apiReq';

export const IncidentPageLoader = async ({ params }) => {
  const res = await apiReq.get(`/incidents/${params.id}`);
  return res.data;
};

export const SendEmailPageLoader = async ({ params }) => {
  const incidentRes = await apiReq.get(`/incidents/${params.id}`);


  return {
    ...incidentRes.data,
  };
};
