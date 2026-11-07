# PEARLVINE INTERNATIONAL – Website & Smart Contract Integration Requirements

## 1. Project Objective

Update the existing Pearlvine International website according to the PVC Referral and AutoPool smart contract requirements.

**IMPORTANT: Keep the website simple. Do not create unnecessary pages, sections, routes or features.**

The website should have only the following:

1. Public Home Page
2. Login
3. Register
4. Authenticated User Dashboard

The existing website and its components must be reused wherever possible.

First inspect the existing project structure, UI components, routing, wallet integration, smart contract ABI and existing dashboard implementation.

Do not rebuild the complete website from scratch.

---

## 2. Website Structure & Authentication

The website must support two different UI states.

### A. Guest / Not Logged In

When the user is not authenticated, display the Public Home Page.

**Header Menu:**
- Pearlvine International Logo
- Login
- Register
- Hamburger Menu (if already part of the existing design)

The guest menu must contain only:
- Home
- Login
- Register

Do not display authenticated dashboard options to guest users.

### B. Authenticated User

When the user successfully logs in using their wallet's digital signature, redirect them to the User Dashboard.

Use the existing authenticated sidebar design shown in the provided first screenshot.

**Authenticated Sidebar Menu:**

1. Dashboard Overview
2. Auto Pool
3. Direct Referrals
4. Level Reward
5. Logout

These are dashboard navigation sections, not additional standalone website pages.

The sidebar design is already implemented. Reuse the existing sidebar and its styling.

Do not create a new sidebar design.

### Authentication Rules

- Use wallet-based digital signature authentication.
- Connect the user's wallet.
- Request a signature to verify wallet ownership.
- Use the existing authentication implementation if available.
- Do not ask users to create a traditional username/password unless already required by the existing authentication system.
- Preserve the authenticated session appropriately.
- On logout, clear the authenticated session and return to the public Home Page.
- If an unauthenticated user accesses a protected dashboard route, redirect them to Login.
- If an authenticated user opens Login or Register, redirect them to Dashboard Overview.

Never treat wallet connection alone as successful authentication. Verify the signature using the existing secure authentication flow.

---

## 3. Public Home Page

Use the provided second screenshot as the reference for the existing Home Page design.

Maintain its current visual appearance.

### Home Page Header

- Pearlvine International Logo
- Login button
- Register button
- Responsive navigation

### Hero Section

Maintain the existing hero section:

**Heading:**
PVC Global Auto Pool & 10-Level Referral Reward

**Description:**

A fully automated, on-chain referral distribution system built with PVC tokens, providing direct referral rewards, 10-level uplines, admin reserve allocation and FIFO-based global AutoPool distribution.

### Hero Buttons

1. Join Auto Pool
2. View Contract Structure

Button functionality:

- Join Auto Pool: Redirect to Register if the visitor is not authenticated. If already authenticated, open the joining interface in Dashboard Overview.
- View Contract Structure: Scroll to the existing contract distribution information on the Home Page. Do not create a separate page.

### Distribution Information

Show the current smart contract distribution:

| Distribution | Amount |
|---|---:|
| Join Amount | 5 PVC |
| Admin Reward | 1 PVC |
| Direct Reward | 1 PVC |
| Level Reward | 1 PVC |
| AutoPool Share | 2 PVC |
| Total | 5 PVC |

**Important:** The amounts shown above are the current configuration. Fetch the actual values from the smart contract instead of hardcoding them.

Remove all outdated static values such as:
- 200,000 PVC joining
- 50,000 PVC direct reward
- 100 PVC per level
- 100,000 PVC AutoPool

The Home Page must always display the configuration of the currently connected contract.

Do not add unnecessary marketing sections, extra landing pages or additional navigation options.

---

## 4. Login Page

Create or update the existing Login Page.

### Login Process

1. User opens Login.
2. User connects their wallet.
3. Website requests a digital signature.
4. Backend or existing authentication mechanism verifies the signature.
5. After successful authentication, redirect the user to Dashboard Overview.

Show:
- Wallet connection status
- Connected wallet address
- Sign Message button
- Authentication loading state
- Error and success notifications

Do not implement fake authentication using only frontend state.

---

## 5. Register Page

Create or update the existing Register Page.

### Registration Form

Fields:
- Full Name
- Email Address
- Mobile Number
- Sponsor / Referral Wallet Address
- Connected Wallet Address

### Referral Link Integration

Support referral links in this format:

https://yourwebsite.com/register?ref=WALLET_ADDRESS

When a user opens the registration link, automatically populate the Sponsor Address field.

The sponsor address should be validated against the smart contract.

### Registration Flow

1. Connect wallet.
2. Authenticate wallet using digital signature.
3. Check whether the wallet has already joined.
4. Validate sponsor address.
5. Check PVC token balance.
6. Check token allowance.
7. Request token approval if required.
8. Display joining amount and distribution.
9. User confirms joining.
10. Execute smart contract join() function.
11. Wait for blockchain transaction confirmation.
12. Redirect to Dashboard Overview.

If the wallet has already joined, do not allow another registration.

One wallet address can join only once.

---

# 6. Authenticated User Dashboard

Reuse the existing dashboard and sidebar shown in the first screenshot.

Do not create additional standalone pages.

The dashboard will contain only these four navigation sections:

### 6.1 Dashboard Overview

Display the user's main information:

- Connected Wallet Address
- Sponsor Address
- Total Joined Members
- Direct Referral Earnings
- Level Referral Earnings
- AutoPool Earnings
- Total Personal Earnings
- AutoPool Progress

Total Personal Earnings:

Direct Earnings + Level Earnings + AutoPool Earnings.

Do not include Admin Reserve in personal earnings.

Also display the user's referral link with a Copy button.

### Joining Information

If the connected wallet has not joined:
- Show joining form.
- Show joining amount.
- Show PVC balance.
- Show approval status.
- Show Join button.

If the wallet has already joined:
- Show membership status.
- Show joining details.
- Do not show the joining form again.

---

### 6.2 Auto Pool

Display AutoPool information inside the existing Auto Pool dashboard section.

Show:

- Current AutoPool Recipient
- Total Queue Members
- User AutoPool Earnings
- AutoPool Target
- Remaining Amount
- Completion Status
- User Queue Position, if available

### AutoPool Progress Example

Earned: 6 PVC

Target: 8 PVC

Remaining: 2 PVC

Status: In Progress

Use a progress bar.

### AutoPool Business Logic

- FIFO (First In, First Out).
- Each joining contributes 2 PVC.
- Each user has an 8 PVC AutoPool target.
- The user's own joining contribution counts toward their target.
- Once a user receives 8 PVC, the next user becomes eligible.
- Completed users cannot receive additional AutoPool rewards.

Fetch all values from smart contract data.

---

### 6.3 Direct Referrals

Display:

- Direct Referral Earnings
- Direct Referral Count
- Referral Link
- Copy Referral Link
- Direct Sponsor Information

Show the user's direct referrals in a simple table.

Table columns:
- Wallet Address
- Joining Status
- Joining Date, if available from events

Use actual blockchain data. Do not create dummy referral records.

---

### 6.4 Level Reward

Display the 10-level referral reward structure.

Show:
- Level 1 to Level 10
- Upline Wallet Address
- Level Reward Amount
- Total Earnings from Each Level

Current configuration:
- Maximum Levels: 10
- Reward Per Level: 0.1 PVC
- Total Level Allocation: 1 PVC

Show only available upline information.

Do not display fabricated users or referral relationships.

---

## 7. Smart Contract Integration

Use the existing PVCReferralSystem smart contract and its deployed ABI.

Important read functions:

- hasJoined(address user)
- isRoot(address user)
- userInfo(address user)
- referrerOf(address user)
- earning(address user)
- getUserEarnings(address user)
- getUserUpline(address user)
- getAutoPoolStatus(address user)
- getCurrentAutoPoolRecipient()
- getAutoPoolQueueLength()
- getAutoPoolQueue(uint256 start, uint256 count)
- getTokenConfiguration()
- adminReserve()
- totalJoined()

Write function:

- join(UserInfo)

ERC20 functions:

- balanceOf(address)
- allowance(address owner, address spender)
- approve(address spender, uint256 amount)
- decimals()

Use smart contract events to retrieve relevant transaction information.

Do not change the existing smart contract business logic as part of frontend development.

If an existing ABI or contract function does not support a requested UI field, report the limitation instead of displaying invented information.

---

## 8. Current Smart Contract Distribution

| Variable | Current Value |
|---|---:|
| JOIN_AMOUNT | 5 PVC |
| ADMIN_REWARD | 1 PVC |
| DIRECT_REWARD | 1 PVC |
| LEVEL_SHARE | 1 PVC |
| LEVEL_REWARD | 0.1 PVC |
| MAX_LEVELS | 10 |
| AUTOPOOL_CONTRIBUTION | 2 PVC |
| AUTOPOOL_TARGET | 8 PVC |

All amounts must be fetched dynamically using getTokenConfiguration().

Use token decimals and ethers.js formatting utilities or equivalent BigInt-safe calculations.

Do not use JavaScript Number for large token amounts.

---

## 9. UI/UX Design Requirements

### Public Website

Follow the second screenshot:
- Dark navy background.
- Existing Pearlvine International logo.
- Blue and cyan gradient buttons.
- Existing hero section layout.
- Existing typography.
- Existing responsive design.

### Authenticated Dashboard

Follow the first screenshot:
- Dark navy sidebar.
- Existing logo placement.
- Blue active menu background.
- Existing icons and menu labels.
- Existing spacing and typography.
- Existing mobile sidebar behavior.

Do not introduce a different design theme.

### Responsive Design

Ensure:
- Desktop compatibility.
- Tablet compatibility.
- Mobile compatibility.
- Existing sidebar opens and closes properly.
- Dashboard sections render correctly on mobile.

---

## 10. Strict Scope – Pages Allowed

**Only implement and maintain these website pages:**

| Page | Access |
|---|---|
| Home | Public |
| Login | Public |
| Register | Public |
| Dashboard | Authenticated |

Dashboard contains four navigation sections:
1. Dashboard Overview
2. Auto Pool
3. Direct Referrals
4. Level Reward

These sections must reuse the existing dashboard layout and sidebar.

### Do NOT Create

- Separate AutoPool website page.
- Separate Direct Referral website page.
- Separate Level Reward website page.
- Admin Dashboard.
- Admin Management Portal.
- Separate Transaction History Page.
- Profile Management Page.
- Settings Page.
- Notifications Page.
- Support Page.
- Any other unnecessary pages.

Do not add features outside the defined scope.

---

## 11. Cursor AI Development Instructions

Before making changes:

1. Analyze the existing project.
2. Inspect existing routing.
3. Inspect the current Home Page.
4. Inspect the existing Login and Register components.
5. Inspect the existing authenticated sidebar and dashboard.
6. Inspect wallet connection and digital signature authentication.
7. Inspect the deployed smart contract ABI and address.
8. Identify reusable components.

### Implementation Rules

- Reuse existing components.
- Preserve existing UI designs shown in the screenshots.
- Keep only the specified pages.
- Do not create unnecessary routes.
- Do not duplicate existing functionality.
- Do not change smart contract business logic.
- Do not hardcode financial values.
- Maintain wallet authentication security.
- Ensure all blockchain transactions are handled correctly.
- Keep all financial information synchronized with on-chain data.
- Maintain mobile responsiveness.

### Final Expected Result

The final website should work as follows:

**Guest User:**

Home → Login / Register → Wallet Authentication → Dashboard

**New User:**

Home → Register → Connect Wallet → Digital Signature → Enter Registration Details → Approve PVC → Join → Dashboard

**Existing User:**

Home → Login → Connect Wallet → Digital Signature → Dashboard

**Authenticated User Menu:**

Dashboard Overview | Auto Pool | Direct Referrals | Level Reward | Logout

Logout → Public Home Page

After implementation:
- Provide a list of modified files.
- Explain the authentication flow.
- Explain the joining flow.
- Verify dashboard navigation.
- Run lint, type-check and production build.
- Fix any errors introduced by the changes.

**Final instruction: Keep the website minimal, clean and limited to the specified pages and dashboard sections. Do not overcomplicate the application.**