# PVC Referral & AutoPool System – Complete Development Requirements

## 1. Project Overview

Update the existing PVC Referral System website and its smart contract integration according to the following business logic.

The platform consists of:
- User Registration / Referral System
- Direct Referral Rewards
- 10-Level Referral Rewards
- FIFO-Based AutoPool System
- User Earnings Dashboard
- Admin Reserve Management
- Transaction History

**Important:** First inspect the existing project structure, smart contract ABI, contract address, frontend components, wallet integration and current UI theme. Modify the existing application instead of creating a completely new application.

Do not unnecessarily change the existing design, theme, fonts, colors or layouts.

---

## 2. Joining System

Each wallet address can join the platform only ONCE.

Joining requires:
- Full Name
- Email Address
- Mobile Number
- Sponsor / Referral Address
- Connected Wallet

The user must have sufficient PVC tokens in their wallet.

Before joining:
1. Check the user's PVC token balance.
2. Check whether the user has already joined.
3. Validate the sponsor address.
4. Check the PVC token allowance.
5. If allowance is insufficient, call the ERC20 approve function.
6. After successful approval, enable the Join button.
7. Call the smart contract's join() function.
8. Wait for transaction confirmation.
9. Refresh user information, earnings, AutoPool status and transaction history.

The smart contract must remain the source of truth. Never show a successful joining status before the blockchain transaction is confirmed.

### Joining Amount

Current joining amount: 5 PVC.

---

## 3. Joining Amount Distribution

Every successful joining distributes exactly 5 PVC as follows:

| Distribution | Amount | Recipient |
|---|---:|---|
| Admin Reward | 1 PVC | Contract balance / Admin Reserve |
| Direct Referral | 1 PVC | Direct Sponsor |
| Level Rewards | 1 PVC | Maximum 10 uplines |
| AutoPool | 2 PVC | FIFO AutoPool recipient |
| Total | 5 PVC | |

All amounts must be fetched from the smart contract configuration wherever possible.

Do not hardcode financial calculations in the frontend.

---

## 4. Direct Referral Reward

Every successful joining generates 1 PVC as a direct referral reward.

Rules:
- The direct sponsor receives 1 PVC.
- If the sponsor is the root contract address, the 1 PVC remains in the Admin Reserve.
- Direct rewards are transferred immediately.
- Update the direct sponsor's earning information.
- Show direct reward transactions in the user's earning history.

---

## 5. Level Referral Reward

The platform supports a maximum of 10 referral levels.

Total level reward allocation per joining: 1 PVC.

Each existing upline receives 0.1 PVC.

Distribution examples:

| Available Levels | Total Distributed | Admin Reserve |
|---|---:|---:|
| 0 | 0 PVC | 1 PVC |
| 1 | 0.1 PVC | 0.9 PVC |
| 2 | 0.2 PVC | 0.8 PVC |
| 3 | 0.3 PVC | 0.7 PVC |
| 5 | 0.5 PVC | 0.5 PVC |
| 10 | 1 PVC | 0 PVC |

Rules:
- Start from the direct sponsor's upline.
- Direct sponsor reward is handled separately.
- Each existing upline receives 0.1 PVC.
- Maximum 10 levels.
- Root contract address does not receive level rewards.
- Missing or unavailable levels are allocated to Admin Reserve.
- Display level-wise earnings and referral information.

The frontend should show:
- Level 1 to Level 10.
- Upline wallet address.
- Number of members at each level, if available from contract data.
- Total earnings from each level.

Do not fabricate referral information if the contract does not expose it.

---

## 6. AutoPool System (FIFO)

AutoPool is the most important feature of this platform.

### Current AutoPool Configuration

- AutoPool contribution per joining: 2 PVC.
- AutoPool target per user: 8 PVC.
- Queue selection: FIFO (First In, First Out).

### AutoPool Working Logic

1. The first user who joins becomes the first AutoPool recipient.
2. Every successful joining adds 2 PVC to the AutoPool distribution.
3. The first user's own joining contribution is also counted.
4. The first user receives 2 PVC from their own joining.
5. Subsequent joining contributions continue going to the first user.
6. Once the first user receives 8 PVC in total, their AutoPool is marked completed.
7. The next eligible user in the FIFO queue becomes the active recipient.
8. The process continues in the same order.

### Example

Assume users A, B, C, D and E join sequentially.

| Joining | AutoPool Recipient | Reward | User A Total |
|---|---|---:|---:|
| A joins | A | 2 PVC | 2 PVC |
| B joins | A | 2 PVC | 4 PVC |
| C joins | A | 2 PVC | 6 PVC |
| D joins | A | 2 PVC | 8 PVC |
| E joins | B | 2 PVC | Completed |

After User A completes 8 PVC, User B becomes the next recipient.

### Important AutoPool Rules

- Every joining creates a separate queue entry.
- Each wallet can join only once.
- A user's own 2 PVC contribution counts toward their 8 PVC AutoPool target.
- Completed users must not receive additional AutoPool rewards.
- FIFO order must always be maintained.
- AutoPool rewards are transferred directly to the recipient.
- AutoPool status must be fetched from blockchain data.

### AutoPool UI

Create an AutoPool section displaying:

- Current AutoPool recipient.
- Total AutoPool queue members.
- User's AutoPool earnings.
- AutoPool target.
- Remaining amount to complete AutoPool.
- AutoPool completion status.
- Queue position, if available from contract data.

Example:

User AutoPool Progress:

Earned: 6 PVC  
Target: 8 PVC  
Remaining: 2 PVC  
Status: In Progress

Show a progress bar representing the user's AutoPool completion.

---

## 7. Admin Reserve

Admin Reserve consists of:

1. Fixed Admin Reward: 1 PVC per joining.
2. Root Direct Referral Reward: 1 PVC when root is the sponsor.
3. Unallocated Level Rewards.

All these amounts must remain inside the smart contract.

Admin withdrawal functionality:
- Only contract owner can withdraw.
- Withdrawal must not exceed available Admin Reserve.
- Admin can specify the recipient address.
- Display available reserve balance.
- Display withdrawal transaction history.

Use the contract's withdrawAdminReserve() function.

---

## 8. User Dashboard UI

Update the existing user dashboard to show the following information.

### Dashboard Statistics

- Total Joined Members.
- Direct Referral Earnings.
- Level Referral Earnings.
- AutoPool Earnings.
- Total Personal Earnings.
- AutoPool Progress.
- Sponsor Address.
- Current AutoPool Queue Position, if available.

### Earnings Calculation

Total Personal Earnings:

Direct Earnings + Level Earnings + AutoPool Earnings.

Do not include Admin Reserve in personal earnings.

### Referral Section

Display:
- Referral link.
- Referral wallet address.
- Copy Referral Link button.
- Direct Referrals.
- Level-wise referral structure.
- Referral joining status.

Referral URL should contain the user's wallet address as the referral parameter.

Example:

https://yourwebsite.com/register?ref=WALLET_ADDRESS

When a visitor opens this link, automatically populate the sponsor address in the registration form.

---

## 9. Joining Page UI

Create or update the registration page with:

- Full Name input.
- Email input.
- Mobile Number input.
- Sponsor Address input.
- Connected Wallet Address.
- Joining Amount.
- PVC Wallet Balance.
- Approval Status.
- Join button.

Show a clear joining distribution preview:

| Reward Type | Amount |
|---|---:|
| Admin | 1 PVC |
| Direct Referral | 1 PVC |
| Level Rewards | 1 PVC |
| AutoPool | 2 PVC |
| Total | 5 PVC |

The amounts must be dynamically fetched from the contract.

Display appropriate loading states and transaction notifications:
- Approval Pending
- Approval Successful
- Joining Pending
- Joining Successful
- Transaction Failed

---

## 10. Transaction History

Create a transaction history section with the following categories:

- Joining Transactions
- Direct Referral Rewards
- Level Referral Rewards
- AutoPool Rewards
- Admin Withdrawals (admin only)

Display:
- Transaction Hash
- Transaction Type
- Amount
- Date and Time
- Status
- Wallet Address

Use blockchain events wherever possible.

Relevant events:
- UserJoined
- DirectRewardPaid
- LevelRewardPaid
- AutoPoolQueued
- AutoPoolRewardPaid
- AutoPoolCompleted
- AdminReserveAccrued
- FundsWithdrawn

Use pagination for large transaction histories.

---

## 11. Smart Contract Integration

Use the existing PVCReferralSystem smart contract.

Important functions:

### Write Functions

- join(UserInfo)
- withdrawAdminReserve(address recipient, uint256 amount) — admin only

### Read Functions

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

### ERC20 Token Functions

- balanceOf(address)
- allowance(address owner, address spender)
- approve(address spender, uint256 amount)
- decimals()

Use the existing blockchain integration libraries and project architecture. Do not introduce unnecessary dependencies.

Use BigInt or ethers.js formatUnits/parseUnits for token calculations. Never convert large token amounts directly into JavaScript Number.

---

## 12. Dynamic Configuration

The smart contract values can change in future deployments.

Current configuration:

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

Future example:

| Variable | Future Value |
|---|---:|
| JOIN_AMOUNT | 500,000 PVC |
| ADMIN_REWARD | 100,000 PVC |
| DIRECT_REWARD | 100,000 PVC |
| LEVEL_SHARE | 100,000 PVC |
| LEVEL_REWARD | 10,000 PVC |
| MAX_LEVELS | 10 |
| AUTOPOOL_CONTRIBUTION | 200,000 PVC |
| AUTOPOOL_TARGET | 800,000 PVC |

The website must automatically display the correct values from the currently configured contract.

Do not hardcode 5 PVC, 1 PVC, 0.1 PVC, 2 PVC or 8 PVC in UI components.

Use the token decimals returned by the PVC token contract for formatting.

---

## 13. UI/UX Requirements

Maintain the existing website's design language.

Requirements:
- Fully responsive desktop, tablet and mobile layouts.
- Clean and professional dashboard.
- Modern cards for earnings.
- Clear AutoPool progress indicator.
- Referral tree visualization.
- Level-wise earnings table.
- Transaction history table.
- Wallet connection status.
- Loading skeletons.
- Success and error notifications.
- Proper empty states.
- Copy-to-clipboard functionality.
- Consistent spacing, typography and buttons.

Do not redesign the complete website unless required. Reuse existing components and styles wherever possible.

---

## 14. Important Business Rules

1. One wallet address can join only once.
2. A wallet's sponsor is permanently assigned during its first successful joining.
3. Direct rewards are distributed to the registered direct sponsor.
4. Level rewards go to existing uplines, excluding the direct sponsor and root contract.
5. Unallocated level rewards remain in Admin Reserve.
6. Root direct rewards remain in Admin Reserve.
7. Every joining creates one AutoPool queue entry.
8. AutoPool follows FIFO.
9. A user's own AutoPool contribution counts toward their target.
10. AutoPool target is 8 PVC.
11. Completed users cannot receive additional AutoPool rewards.
12. Total distribution per joining must always equal the configured joining amount.
13. The smart contract is the source of truth for all financial data.
14. Never show fake or locally calculated transaction success.
15. Do not allow users to change their registered sponsor.
16. Do not introduce multiple joining functionality.

---

## 15. Development Instructions for Cursor AI

Before making changes:

1. Analyze the complete existing project.
2. Identify the existing registration page, dashboard, referral page and transaction history.
3. Inspect smart contract ABI and integration code.
4. Identify existing wallet connection and token approval implementation.
5. Check the current UI theme and reusable components.

Then implement the requirements in the existing architecture.

### Important Instructions

- Do not create duplicate components.
- Do not remove existing working functionality.
- Do not modify smart contract business logic without explicit approval.
- Do not hardcode financial values in frontend components.
- Handle blockchain errors properly.
- Handle transaction pending and confirmation states.
- Ensure all displayed financial values match blockchain storage.
- Use the correct network and deployed contract addresses from environment configuration.
- Ensure mobile responsiveness.

### Expected Deliverables

1. Updated registration/joining page.
2. Updated user dashboard.
3. Updated referral system UI.
4. Updated AutoPool dashboard.
5. Updated earnings section.
6. Updated transaction history.
7. Updated admin reserve section.
8. Correct smart contract integration.
9. Responsive UI across all screen sizes.
10. No TypeScript, React or build errors.

After implementation, provide a summary of all modified files and explain the updated user flow.

Run the project's available lint, type-check and production build commands and fix any errors introduced by these changes.