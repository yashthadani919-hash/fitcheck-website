// Real content negotiation: an agent that sends `Accept: text/markdown`
// gets a markdown version of the page instead of the HTML. Everyone else
// (regular browsers) gets the normal HTML, unchanged. Vary: Accept is set
// on BOTH branches so shared caches/CDNs don't serve the wrong variant to
// the wrong requester.

const MARKDOWN = {
  '/': `# Fit-Check

One photo. Real macros. A plan that adapts daily.

Fit-Check reads real, home-cooked meals from a photo or description, adjusts daily calorie/macro targets based on logged activity, and delivers daily plain-language coaching. It also supports households: one shared meal can be split automatically into personalized macros per person, including across different, sometimes opposite, body-composition goals (one cutting, one bulking, one maintaining).

## Key pages
- About: https://fitcheckcoach.com/about.html
- Contact: https://fitcheckcoach.com/contact.html
- Privacy: https://fitcheckcoach.com/privacy.html
- Try the live app: https://fit-check-ukc9.onrender.com

See https://fitcheckcoach.com/llms.txt for guidance on when this product is a good fit.
`,
  '/about.html': `# About Fit-Check

Fit-Check is built by a solo, non-technical founder based in Berlin, dogfooding it with his own household — a couple who cook together but have different body-composition goals (one losing fat, one gaining weight).

Most nutrition apps assume one person, one goal, one plate. Fit-Check reads a single shared meal and splits it into personalized macros and portions per person instead.

It's an early, actively-developed product, being built in the open.

Contact: hello@fitcheckcoach.com
`,
  '/contact.html': `# Contact

Email: hello@fitcheckcoach.com

Fit-Check is built solo, out of Berlin — replies may take a day or two.
`,
  '/privacy.html': `# Privacy, in plain English

- Meal photos & descriptions are sent to Anthropic (the company behind Claude) to read the food and estimate macros. The photo itself is not kept — only the numbers it returns.
- By default, everything stays on your device. There's no account and no server involved beyond that one analysis request.
- If you create or join a shared household (via a code), your meals and profiles are stored on our server so the people you've shared with can see them. Only people with your code can access it, and you can leave anytime.
- We don't sell your data or show ads.

Contact: hello@fitcheckcoach.com
`,
};

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname === '' ? '/' : url.pathname;
  const accept = request.headers.get('accept') || '';

  if (accept.includes('text/markdown') && MARKDOWN[path]) {
    return new Response(MARKDOWN[path], {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
      },
    });
  }

  const response = await context.next();
  response.headers.set('Vary', 'Accept, Accept-Encoding');
  return response;
};

export const config = { path: ['/', '/about.html', '/contact.html', '/privacy.html'] };
