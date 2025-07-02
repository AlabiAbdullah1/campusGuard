import apiReq from "./apiReq"

export const singlePageLoader = async ({request, params}) => {
    const res = await apiReq("/incidents/"+params.id)
    return res.data;
}
// const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);



// export const singlePageLoader = async ({ request, params }) => {
//   console.log(params.id)
//   if (!isValidObjectId(params.id)) {
    
//     throw new Response("Invalid incident ID", { status: 400 });
//   }

//   try {
//     const res = await apiReq("/incidents/" + params.id);
//     return res.data;
//   } catch (err) {
//     throw new Response("Incident not found", { status: 404 });
//   }
// };