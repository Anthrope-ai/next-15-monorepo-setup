import {ManagementClient} from "auth0";

const url = new URL(process.env.AUTH0_DOMAIN!);

// NOTE: If invalid token Grant type is not selected in APIs tab inside application, dropdown to management Auth0 Management Api
export const managementClientFactory = () => new ManagementClient({
    domain: url.host,
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
})