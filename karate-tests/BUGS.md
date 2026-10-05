# Bug 1

**Title:** OSM API v0.6 returns HTTP 406 Not Acceptable when receiving standard multi-value Accept-Encoding headers

**Severity:** Medium
**Priority:** High

Component: API v0.6 / HTTP Request Pipeline
Environment: https://master.apis.dev.openstreetmap.org 

**Summary:** When an HTTP client sends a standard Accept-Encoding header containing modern or multiple encodings (such as "gzip, deflate, br, zstd"), the API server rejects the request with HTTP 406 Not Acceptable ("No acceptable content encoding found. Only identity and gzip are supported.") instead of negotiating a supported encoding (gzip/identity) as required by the HTTP/1.1 specification (RFC 9110 § 12.5.3).

**Preconditions:**
1. Valid OAuth 2.0 access token with `write_api` scope.
2. An existing node ID on the server (e.g., node 4365581350).

**Steps to Reproduce:**
1. Send a GET request to:
   `https://master.apis.dev.openstreetmap.org/api/0.6/node/<node_id>.json`
2. Include the following headers:
   - Authorization: Bearer `<valid_token>`
   - Accept-Encoding: gzip, deflate, br

**Expected Result:** HTTP 200 OK. The server should inspect the list, select "gzip" (which it supports), compress the payload, and return Content-Encoding: gzip.

**Actual Result:** HTTP 406 Not Acceptable
Response Body:
"No acceptable content encoding found. Only identity and gzip are supported."

**Impact:**
Standard modern HTTP clients (e.g., Java 11+ HttpClient, Karate, Apache HttpClient, modern browser fetch) send default Accept-Encoding strings containing deflate/br/zstd alongside gzip. All these clients fail by default out of the box unless client-side workarounds are explicitly implemented to strip unsupported encoding tokens.

**Reference:**
RFC 9110 (HTTP Semantics) Section 12.5.3:
"If the Accept-Encoding field-value is not empty, then only the listed content-codings are acceptable. If a client includes multiple content-codings, the server should select any of the acceptable codings."