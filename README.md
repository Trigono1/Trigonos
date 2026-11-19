# JustBarber Athens

[**Open the live JustBarber website**](https://trigono1.github.io/Trigonos/dist/)

A responsive Greek and English barbershop site with service prices, a photo gallery, visiting details, and booking through JustBarber's existing Setmore account.

## Run locally

To run a local copy, clone the repository and run this command from its root.

```sh
python3 -m http.server 8080 --directory dist
```

While the server is running, open `http://localhost:8080` on the same computer. The site uses plain HTML, CSS, and JavaScript with no dependencies or build step.

## Maintain the site

- Edit services, prices, photos, and contact details in `dist/index.html`. Keep the HTML's visible opening hours and structured data in sync with `closingHours` in `dist/script.js`.
- The general booking button leads to JustBarber's Setmore account. The price list uses Setmore's service-specific links. Availability and confirmations are managed by Setmore.
- Photos come from the existing JustBarber website. Barlow Condensed and Inter are distributed under their accompanying SIL Open Font Licenses.
- The `dist/` directory can be deployed to a static host. This GitHub repository holds the source. The private Sites deployment publishes through its own deployment workflow.
