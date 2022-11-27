import axios from "axios"

const baseUrl = "https://stash.akif.kr/stash";

export const getStash = async (stashId: string) => {
  try {
    // Get response from API
    const response = await axios.get(`${baseUrl}/${stashId}`);
    // Return data or null
    return response.data ?? null;
  } catch (err) {
    // Return null on error
    return null;
  }
}

export const createNewStash = async (data: Record<string, unknown>) => {
  // Send JSON data to API
  const response = await axios.post(
    baseUrl,
    data
  );

  // Return ID from response
  return response?.data?.id;
}

export const deleteStash = async (stashId: string) => {
  await axios.delete(`${baseUrl}/${stashId}`);
}