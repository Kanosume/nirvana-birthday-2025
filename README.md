# Project Name: Nirvana Birthday Wishes Website 

**License:** GPL

**Author:** Kanosume

## Project Setup

Follow these steps to set up the project:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Kanosume/nirvana-birthday-2025.git
   cd nirvana-birthday-2025
   ```

2. **Install Dependencies:**

   Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then, run:

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory of your project with the following content:

   ```env
   BUCKET=your_bucket_name
   BUCKET_URL=your_bucket_url
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
   CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id
   CLOUDFLARE_R2_BUCKET_NAME=your_r2_bucket_name
   VITE_API_URL=your_vite_api_url
   ```

   Replace the placeholder values (`your_*`) with your actual configuration details.

4. **Configure Wrangler:**

   Create a `wrangler.toml` file in the root directory with the following content:

   ```toml
   name = "your-worker-name"
   type = "javascript"
   account_id = "$CLOUDFLARE_ACCOUNT_ID"
   compatibility_date = "2025-02-12"

   [site]
   bucket = "$BUCKET"

   [[kv_namespaces]]
   binding = "YOUR_KV_BINDING"
   id = "$CLOUDFLARE_KV_NAMESPACE_ID"

   [vars]
   BUCKET_URL = "$BUCKET_URL"
   CLOUDFLARE_API_TOKEN = "$CLOUDFLARE_API_TOKEN"
   CLOUDFLARE_R2_BUCKET_NAME = "$CLOUDFLARE_R2_BUCKET_NAME"
   VITE_API_URL = "$VITE_API_URL"
   ```

   Ensure that the `account_id` matches your Cloudflare account ID and that the `kv_namespaces` binding corresponds to your KV namespace ID.

5. **Edit vite.config.js:**
   Make sure you edit project link there.

6. **Publish to Cloudflare Workers:**

   If you haven't already, authenticate Wrangler with your Cloudflare account:

   ```bash
   npx wrangler login
   ```

   Then, publish your Worker:

   ```bash
   npx wrangler publish
   ```

   This will deploy your Worker to Cloudflare's edge network.

7. **Start the Development Server:**

   This project didn't implement for local development. You can edit it if you want to test in local server.

## Notes

- Ensure that your Cloudflare API token has the necessary permissions to manage Workers and KV namespaces.
- The `compatibility_date` in `wrangler.toml` should be set to the current date or the date when your Worker was last tested for compatibility.
- For more detailed configuration options, refer to the [Wrangler documentation](https://developers.cloudflare.com/workers/wrangler/configuration/).

By following these steps, you should have your project set up and running successfully.
