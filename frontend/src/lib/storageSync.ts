import axios from 'axios';

export async function syncEntity<T extends { id: number }>(
  cacheKey: string,
  apiUrl: string
): Promise<T[]> {
  try {
    // 1. Fetch from backend
    const res = await axios.get(apiUrl);
    let backendData: T[] = res.data.data || [];

    // 2. Read local storage
    const localDataStr = localStorage.getItem(cacheKey);
    const localData: T[] = localDataStr ? JSON.parse(localDataStr) : [];

    // 3. Hydrate backend if it restarted and lost memory
    // (backend is empty, but local storage has data)
    if (backendData.length === 0 && localData.length > 0) {
      console.log(`Hydrating backend for ${cacheKey}...`);
      for (const item of localData) {
        try {
          await axios.post(apiUrl, item);
        } catch (e) {
          console.error(`Failed to hydrate item in ${cacheKey}:`, e);
        }
      }
      // Re-fetch from hydrated backend
      const hydratedRes = await axios.get(apiUrl);
      backendData = hydratedRes.data.data || [];
    }

    // 4. Save validated truth to local storage
    localStorage.setItem(cacheKey, JSON.stringify(backendData));
    return backendData;

  } catch (error) {
    console.error(`Error connecting to ${apiUrl}, falling back to local storage.`);
    const localDataStr = localStorage.getItem(cacheKey);
    return localDataStr ? JSON.parse(localDataStr) : [];
  }
}
