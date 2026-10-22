// Deep Linking Utility for Direct Integration with Gojek and Grab Apps
// Facilitates seamless First-Mile & Last-Mile feeder dispatch in Banyumas

export interface FeederDispatchParams {
  provider: 'gojek' | 'grab';
  serviceType?: 'bike' | 'car';
  pickupName: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffName: string;
  dropoffLat?: number;
  dropoffLng?: number;
  estimatedFare?: number;
}

export interface LaunchResult {
  success: boolean;
  deepLinkUrl: string;
  fallbackUrl: string;
  message: string;
}

/**
 * Generates and triggers the official deep link to launch Gojek or Grab natively
 */
export function launchFeederApp(params: FeederDispatchParams): LaunchResult {
  const {
    provider,
    serviceType = 'bike',
    pickupName,
    pickupLat,
    pickupLng,
    dropoffName,
    dropoffLat,
    dropoffLng,
  } = params;

  let deepLinkUrl = '';
  let fallbackUrl = '';
  let message = '';

  const encodedPickup = encodeURIComponent(pickupName);
  const encodedDropoff = encodeURIComponent(dropoffName);

  if (provider === 'gojek') {
    const service = serviceType === 'car' ? 'gocar' : 'goride';
    // Official Gojek deep link scheme
    // gojek://goride?pickup_name=...&dropoff_name=...
    const coordsQuery =
      pickupLat && pickupLng && dropoffLat && dropoffLng
        ? `&pickup_lat=${pickupLat}&pickup_lng=${pickupLng}&dropoff_lat=${dropoffLat}&dropoff_lng=${dropoffLng}`
        : '';

    deepLinkUrl = `gojek://${service}?pickup_name=${encodedPickup}&dropoff_name=${encodedDropoff}${coordsQuery}`;
    // Universal / Web fallback link
    fallbackUrl = `https://gjk.mobi/${service}?pickup=${encodedPickup}&dropoff=${encodedDropoff}`;
    message = `Membuka aplikasi Gojek (${service === 'gocar' ? 'GoCar' : 'GoRide'})...`;
  } else {
    // Official Grab deep link scheme
    // grab://open?screenType=TRANSPORT&pickup_name=...&dropoff_name=...
    const coordsQuery =
      pickupLat && pickupLng && dropoffLat && dropoffLng
        ? `&pickup_latitude=${pickupLat}&pickup_longitude=${pickupLng}&dropoff_latitude=${dropoffLat}&dropoff_longitude=${dropoffLng}`
        : '';

    deepLinkUrl = `grab://open?screenType=TRANSPORT&source=TransBanyumasMaaS&pickup_name=${encodedPickup}&dropoff_name=${encodedDropoff}${coordsQuery}`;
    // Web / Store fallback link
    fallbackUrl = `https://r.grab.com/transport?pickup=${encodedPickup}&dropoff=${encodedDropoff}`;
    message = `Membuka aplikasi Grab (${serviceType === 'car' ? 'GrabCar' : 'GrabBike'})...`;
  }

  // Attempt to trigger native deep link in browser
  try {
    // Try launching via hidden iframe or direct location
    const start = Date.now();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = deepLinkUrl;

      // Fallback check: if user stays on page after 1800ms, redirect to web fallback
      setTimeout(() => {
        if (Date.now() - start < 2200) {
          window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        }
      }, 1500);
    } else {
      // On desktop browser, attempt app scheme via hidden frame, then offer web
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = deepLinkUrl;
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }
  } catch (err) {
    console.warn('Could not launch deep link directly, fallback available:', err);
  }

  return {
    success: true,
    deepLinkUrl,
    fallbackUrl,
    message,
  };
}
