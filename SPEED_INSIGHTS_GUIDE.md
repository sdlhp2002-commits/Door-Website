# Getting Started with Vercel Speed Insights

This guide will help you get started with using Vercel Speed Insights on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

```bash
npm i vercel
# or
yarn i vercel
# or
pnpm i vercel
# or
bun i vercel
```

## Step 1: Enable Speed Insights in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project followed by the **Speed Insights** tab. You can also select the button below to be taken there. Then, select **Enable** from the dialog.

> **💡 Note:** Enabling Speed Insights will add new routes (scoped at `/_vercel/speed-insights/*`) after your next deployment.

## Step 2: Add `@vercel/speed-insights` to your project

Using the package manager of your choice, add the `@vercel/speed-insights` package to your project:

```bash
npm i @vercel/speed-insights
# or
yarn i @vercel/speed-insights
# or
pnpm i @vercel/speed-insights
# or
bun i @vercel/speed-insights
```

## Step 3: Add the Speed Insights Script to Your Site

For HTML sites, add the following scripts before the closing tag of the `<body>`:

```html
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

This is already configured in the `index.html` file.

### For JavaScript Frameworks

If you're using a JavaScript framework like Next.js, React, Vue, etc., refer to the [Speed Insights documentation](https://vercel.com/docs/speed-insights) for framework-specific integration instructions.

## Step 4: Deploy Your App to Vercel

You can deploy your app to Vercel's global CDN by running the following command from your terminal:

```bash
vercel deploy
```

Alternatively, you can [connect your project's git repository](https://vercel.com/docs/git), which will enable Vercel to deploy your latest pushes and merges to main.

Once your app is deployed, it's ready to begin tracking performance metrics.

> **💡 Note:** If everything is set up correctly, you should be able to find the `/_vercel/speed-insights/script.js` script inside the body tag of your page.

## Step 5: View Your Data in the Dashboard

Once your app is deployed, and users have visited your site, you can view the data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Speed Insights** tab.

After a few days of visitors, you'll be able to start exploring your metrics. For more information on how to use Speed Insights, see [Using Speed Insights](https://vercel.com/docs/speed-insights/using-speed-insights).

## Learn More

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/speed-insights/privacy-policy) with Vercel Speed Insights.

## Next Steps

Now that you have Vercel Speed Insights set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/speed-insights` package](https://vercel.com/docs/speed-insights/package)
- [Learn about metrics](https://vercel.com/docs/speed-insights/metrics)
- [Read about privacy and compliance](https://vercel.com/docs/speed-insights/privacy-policy)
- [Explore pricing](https://vercel.com/docs/speed-insights/limits-and-pricing)
- [Troubleshooting](https://vercel.com/docs/speed-insights/troubleshooting)
