## Defects found

# Bug 1

**Title:** Several displayed top categories have no navigation target.

**Steps:** 
1. Open the home page 
2. Select `Shop by Category` menu
3. Select any of the links from - `Fashion and Accessories`, `Beauty and Saloon`, `Autoparts and Accessories`, `Washing machine`, `Gaming consoles`, `Air conditioner`.

**Actual:** The elements are links with an empty destination.  

**Expected:** Each displayed category navigates to a category page, or unavailable entries are not presented as links.  

**Severity:** Medium
**Priority:** Medium

# Bug 2

**Title:** Quantity input accepts invalid data types.

**Steps:** 
1. Navigate to any product detail page 
2. Locate quantity input field
3. Enter -1 (or 1.5, e etc)
4. Click `Add to Cart`
5. Open cart page

**Actual:** The system accepts invalid inputs, allowing requests to be dispatched. In the cart, it either defaults unpredictably, calculates negative totals, or fails silently without meaningful error messaging.  

**Expected:** The input field should restrict entry to positive integers. If invalid input is pasted or submitted, client-side validation should flag an error: "Please enter a valid quantity (minimum 1)", and the "Add to Cart" request should be blocked.  

**Severity:** Major
**Priority:** High

# Bug 3

**Title:** Quantity input accepts extremely large integers.

**Steps:** 
1. Navigate to any product detail page 
2. Locate quantity input field
3. Enter 99999999
4. Click `Add to Cart`
5. Open cart page

**Actual:** The system accepts arbitrary 9-digit integers. 

**Expected:** The quantity should be capped at either available inventory stock or a sensible platform maximum (e.g., max="100").  

**Severity:** Medium
**Priority:** Medium

# Bug 4

**Title:** Unsanitized special characters and HTML strings reflected raw in search breadcrumbs.

**Steps:** 
1. Navigate to the homepage header search bar. 
2. Enter the search term: `<h1>Test</h1>` or `Phone" <test> *`.
3. Click the Search button.
4. Observe the search results heading, breadcrumb title, and URL parameter.

**Actual:** The raw query is reflected unencoded in breadcrumb text elements, creating potential UI layout breakages and Cross-Site Scripting (XSS) / injection vectors. 

**Expected:** Special characters and HTML tags should be sanitized and safely escaped (e.g., encoded as &lt;h1&gt; or stripped) before being rendered in the DOM. Search results should clearly display: "Search - "Test"" as plain escaped text without parsing HTML.  

**Severity:** Major
**Priority:** High