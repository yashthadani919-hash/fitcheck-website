// Keeps the Fit-Check app server awake.
// The app runs on Render's free tier, which goes to sleep after about 15 minutes
// without visitors and then takes around 20 seconds to wake up. This function is
// run by Netlify on a schedule and makes one tiny request so the server stays up.
export default async () => {
  try {
    const res = await fetch('https://fit-check-ukc9.onrender.com/api/household/status', { cache: 'no-store' });
    return new Response(`app responded ${res.status}`);
  } catch (err) {
    return new Response(`app did not respond: ${err.message}`, { status: 200 });
  }
};

export const config = { schedule: '*/10 * * * *' };
