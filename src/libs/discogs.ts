import type { VinylInformation } from "../type";

export async function getDiscogsInformation(barcode: string, artist: string, release_title: string, discogs_key: string, discogs_secret: string, owner: string) {

  const myHeaders = new Headers();
    myHeaders.append("User-Agent", "PostmanRuntime/7.37.3");
    myHeaders.append("Cookie", "__cf_bm=GQu1uy.oOhPqp3yX7ZTMsxbAls9Ud07RjOu4zR95U_o-1736521883-1.0.1.1-NYdMJpGoh1KUy8AC8Qu5icIQFD0nhyltYCnK2SOdH51Vjspuf7WbVel1sPY1RZCDIBpoPzVZTfVqJrFFq57RPA");

  const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

  let url = 'https://api.discogs.com/database/search?';
  const params = new URLSearchParams();

  // Only add parameters if they are non-empty strings
  if (barcode) {
    params.append('barcode', barcode);
  } else if (artist && release_title) {
    params.append('artist', artist);
    params.append('release_title', release_title);
  }

  params.append('format', 'vinyl');
  params.append('per_page', '5');
  params.append('page', '1');
  params.append('key', discogs_key);
  params.append('secret', discogs_secret);

    url += params.toString();
    console.log('URL:', url);

    try {
      const response = await fetch(url, requestOptions);
      console.log(`Status Code: ${response.status}`);
      const result = await response.text();
      if (!result) {
        return { error: "Empty response" };
      }

      const parsedResult = JSON.parse(result);
      
      // Check if we have results
      if (!parsedResult.results || parsedResult.results.length === 0) {
        return { error: "No results found in Discogs" };
      }

      // Check if we have a master_url
      const firstEntry = parsedResult.results[0];
      if (!firstEntry.master_url) {
        return { error: "No master URL found for this release" };
      }

      const firstEntryMasterURL = firstEntry.master_url;
      const vinylInformationRequest = await fetch(firstEntryMasterURL, requestOptions);
      console.log(`Status Code: ${vinylInformationRequest.status}`);
      const vinylInformationResult = await vinylInformationRequest.text();
      const vinylInformationJson = JSON.parse(vinylInformationResult);
      console.log(vinylInformationJson);
      
      // Fetch the main release to get the label information
      const mainReleaseRequest = await fetch(vinylInformationJson.main_release_url, requestOptions);
      const mainReleaseResult = await mainReleaseRequest.text();
      const mainReleaseJson = JSON.parse(mainReleaseResult);
      
      const {title, artists, year, tracklist, genres, styles} = vinylInformationJson;
      const labels = mainReleaseJson.labels ? mainReleaseJson.labels.map((l: any) => l.name).join(', ') : null;

      const artistNames = artists.map((artist: { name: string }) => artist.name);
      
      // Format tracklist to match our interface
      const formattedTracklist = tracklist.map((track: any) => ({
        title: track.title,
        duration: track.duration || ''
      }));

      // Get the first available image URL from the main release
      const imageUrl = mainReleaseJson.images && mainReleaseJson.images.length > 0 ? 
        mainReleaseJson.images[0].uri || mainReleaseJson.images[0].resource_url : null;

      console.log('Image URL:', imageUrl); // Debug log

      const vinylInformation: VinylInformation = {
        title: title,
        artists: artistNames,
        label: labels,
        year: year,
        tracklist: formattedTracklist,
        genre: genres,
        style: styles,
        owner: owner,
        imageUrl: imageUrl
      };

      return vinylInformation;

    } catch (error) {
      console.error('Fetch error:', error);
      //return { error: error.message } as unknown as VinylInformation;
    }
  }
