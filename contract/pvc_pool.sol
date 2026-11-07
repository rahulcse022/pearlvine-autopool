
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PVCReferralSystem is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable pvcToken;

    uint256 private constant UNIT = 1e18;

    // ============================================================
    // CONFIGURATION
    // Change these values before deploying a NEW contract.
    // ============================================================

    uint256 public constant JOIN_AMOUNT = 5 * UNIT;
    uint256 public constant ADMIN_REWARD = 1 * UNIT;
    uint256 public constant DIRECT_REWARD = 1 * UNIT;
    uint256 public constant LEVEL_SHARE = 1 * UNIT;
    uint256 public constant LEVEL_REWARD = 1e17; // 0.1 PVC
    uint256 public constant AUTOPOOL_CONTRIBUTION = 2 * UNIT;
    uint256 public constant AUTOPOOL_TARGET = 8 * UNIT;
    uint256 public constant MAX_LEVELS = 10;

    // ============================================================
    // STRUCTS
    // ============================================================

    struct JoinInput {
        string fullName;
        string email;
        string mobile;
        address sponsor;
    }

    struct UserInfo {
        string fullName;
        string email;
        string mobile;
        address sponsor;
        bool joined;
        uint256 joinedAt;
    }

    struct MemberDetails {
        address wallet;
        string fullName;
        string email;
        string mobile;
        uint256 joinedAt;
        bool joined;
    }

    struct Earning {
        uint256 directEarnings;
        uint256 levelEarnings;
        uint256 autoPoolEarnings;
    }

    struct TokenConfig {
        uint256 joinAmount;
        uint256 adminReward;
        uint256 directReward;
        uint256 levelShare;
        uint256 levelReward;
        uint256 maxLevels;
        uint256 autoPoolContribution;
        uint256 autoPoolTarget;
    }

    // ============================================================
    // STORAGE
    // ============================================================

    mapping(address => UserInfo) public userInfo;
    mapping(address => address) public referrerOf;
    mapping(address => Earning) public earning;

    // Direct referrals
    mapping(address => address[]) private directReferrals;

    // Members who generated level rewards for each upline
    mapping(address => mapping(uint256 => address[]))
        private levelMembers;

    // Individual level earnings
    mapping(address => mapping(uint256 => uint256))
        public levelEarningsByLevel;

    // Admin reserve
    uint256 public adminReserve;

    // Total registered members
    uint256 public totalJoined;

    // FIFO AutoPool queue
    address[] private autoPoolQueue;
    uint256 public autoPoolQueueHead;

    mapping(address => bool) public autoPoolCompleted;

    // ============================================================
    // EVENTS
    // ============================================================

    event UserJoined(
        address indexed user,
        address indexed sponsor
    );

    event DirectRewardPaid(
        address indexed user,
        address indexed sponsor,
        uint256 amount
    );

    event LevelRewardPaid(
        address indexed user,
        address indexed upline,
        uint256 level,
        uint256 amount
    );

    event AutoPoolQueued(
        address indexed user,
        uint256 queuePosition
    );

    event AutoPoolRewardPaid(
        address indexed joiningUser,
        address indexed recipient,
        uint256 amount,
        uint256 totalEarned,
        bool completed
    );

    event AutoPoolCompleted(
        address indexed user,
        uint256 totalReward
    );

    event AdminReserveAccrued(
        uint256 amount,
        uint256 totalReserve
    );

    event FundsWithdrawn(
        address indexed recipient,
        uint256 amount
    );

    // ============================================================
    // CONSTRUCTOR
    // OpenZeppelin Contracts 5.x
    // ============================================================

    constructor(address _pvcToken) Ownable(msg.sender) {
        require(_pvcToken != address(0), "Invalid token");
        require(_pvcToken.code.length > 0, "Token is not contract");

        require(
            IERC20Metadata(_pvcToken).decimals() == 18,
            "PVC token must have 18 decimals"
        );

        require(
            JOIN_AMOUNT ==
                ADMIN_REWARD +
                DIRECT_REWARD +
                LEVEL_SHARE +
                AUTOPOOL_CONTRIBUTION,
            "Invalid distribution"
        );

        require(
            MAX_LEVELS * LEVEL_REWARD <= LEVEL_SHARE,
            "Invalid level configuration"
        );

        require(
            AUTOPOOL_CONTRIBUTION <= AUTOPOOL_TARGET,
            "Invalid AutoPool configuration"
        );

        pvcToken = IERC20(_pvcToken);
    }

    // ============================================================
    // MEMBERSHIP
    // ============================================================

    function _isMember(address user)
        private
        view
        returns (bool)
    {
        return user == address(this) || userInfo[user].joined;
    }

    function hasJoined(address user)
        external
        view
        returns (bool)
    {
        return _isMember(user);
    }

    function isRoot(address user)
        public
        view
        returns (bool)
    {
        return user == address(this);
    }

    // ============================================================
    // JOIN
    // ============================================================

    function join(JoinInput calldata input)
        external
        nonReentrant
    {
        require(!_isMember(msg.sender), "Already joined");
        require(input.sponsor != address(0), "Invalid referrer");
        require(_isMember(input.sponsor), "Invalid referrer");
        require(input.sponsor != msg.sender, "Self referral");

        // Register user and permanently assign sponsor
        userInfo[msg.sender] = UserInfo({
            fullName: input.fullName,
            email: input.email,
            mobile: input.mobile,
            sponsor: input.sponsor,
            joined: true,
            joinedAt: block.timestamp
        });

        referrerOf[msg.sender] = input.sponsor;

        // Store direct referral
        directReferrals[input.sponsor].push(msg.sender);

        totalJoined++;

        // Add joining user to FIFO AutoPool queue
        autoPoolQueue.push(msg.sender);

        emit AutoPoolQueued(
            msg.sender,
            autoPoolQueue.length - 1
        );

        // Collect joining amount
        pvcToken.safeTransferFrom(
            msg.sender,
            address(this),
            JOIN_AMOUNT
        );

        uint256 toAdmin = ADMIN_REWARD;

        // ========================================================
        // 1. DIRECT REFERRAL REWARD
        // ========================================================

        if (input.sponsor == address(this)) {

            // Root direct reward goes to admin reserve
            toAdmin += DIRECT_REWARD;

        } else {

            pvcToken.safeTransfer(
                input.sponsor,
                DIRECT_REWARD
            );

            earning[input.sponsor].directEarnings +=
                DIRECT_REWARD;

            emit DirectRewardPaid(
                msg.sender,
                input.sponsor,
                DIRECT_REWARD
            );
        }

        // ========================================================
        // 2. LEVEL REWARDS
        // ========================================================

        address upline = referrerOf[input.sponsor];

        uint256 levelsPaid = 0;

        while (
            levelsPaid < MAX_LEVELS &&
            upline != address(0) &&
            upline != address(this)
        ) {
            uint256 currentLevel = levelsPaid + 1;

            pvcToken.safeTransfer(
                upline,
                LEVEL_REWARD
            );

            earning[upline].levelEarnings +=
                LEVEL_REWARD;

            levelEarningsByLevel[upline][currentLevel] +=
                LEVEL_REWARD;

            // Store member under this upline and level
            levelMembers[upline][currentLevel].push(
                msg.sender
            );

            levelsPaid++;

            emit LevelRewardPaid(
                msg.sender,
                upline,
                currentLevel,
                LEVEL_REWARD
            );

            upline = referrerOf[upline];
        }

        // Unpaid level share goes to admin reserve
        toAdmin += (
            LEVEL_SHARE -
            (levelsPaid * LEVEL_REWARD)
        );

        adminReserve += toAdmin;

        emit AdminReserveAccrued(
            toAdmin,
            adminReserve
        );

        // ========================================================
        // 3. AUTOPOOL REWARD
        // ========================================================

        _processAutoPool(msg.sender);

        emit UserJoined(
            msg.sender,
            input.sponsor
        );
    }

    // ============================================================
    // AUTOPOOL FIFO PROCESSING
    // ============================================================

    function _processAutoPool(address joiningUser)
        private
    {
        uint256 remaining = AUTOPOOL_CONTRIBUTION;

        while (remaining > 0) {

            require(
                autoPoolQueueHead < autoPoolQueue.length,
                "AutoPool queue empty"
            );

            address recipient =
                autoPoolQueue[autoPoolQueueHead];

            uint256 alreadyEarned =
                earning[recipient].autoPoolEarnings;

            // Skip already completed recipients
            if (alreadyEarned >= AUTOPOOL_TARGET) {
                autoPoolCompleted[recipient] = true;
                autoPoolQueueHead++;
                continue;
            }

            uint256 needed =
                AUTOPOOL_TARGET - alreadyEarned;

            uint256 payout = remaining < needed
                ? remaining
                : needed;

            // Update accounting
            earning[recipient].autoPoolEarnings += payout;

            remaining -= payout;

            bool completed =
                earning[recipient].autoPoolEarnings ==
                AUTOPOOL_TARGET;

            // Transfer AutoPool reward
            pvcToken.safeTransfer(
                recipient,
                payout
            );

            emit AutoPoolRewardPaid(
                joiningUser,
                recipient,
                payout,
                earning[recipient].autoPoolEarnings,
                completed
            );

            if (completed) {

                autoPoolCompleted[recipient] = true;

                emit AutoPoolCompleted(
                    recipient,
                    AUTOPOOL_TARGET
                );

                autoPoolQueueHead++;
            }
        }
    }

    // ============================================================
    // ADMIN WITHDRAWAL
    // ============================================================

    function withdrawAdminReserve(
        address recipient,
        uint256 amount
    )
        external
        onlyOwner
        nonReentrant
    {
        require(
            recipient != address(0),
            "Invalid recipient"
        );

        require(
            amount > 0,
            "Invalid amount"
        );

        require(
            amount <= adminReserve,
            "Insufficient admin reserve"
        );

        adminReserve -= amount;

        pvcToken.safeTransfer(
            recipient,
            amount
        );

        emit FundsWithdrawn(
            recipient,
            amount
        );
    }

    // ============================================================
    // USER VIEWS
    // ============================================================

    function getUserUpline(address user)
        external
        view
        returns (address[10] memory uplines)
    {
        address current =
            referrerOf[referrerOf[user]];

        for (
            uint256 i = 0;
            i < MAX_LEVELS &&
            current != address(0) &&
            current != address(this);
            i++
        ) {
            uplines[i] = current;
            current = referrerOf[current];
        }
    }

    function getUserEarnings(address user)
        external
        view
        returns (
            uint256 direct,
            uint256 level,
            uint256 autoPool
        )
    {
        Earning storage e = earning[user];

        return (
            e.directEarnings,
            e.levelEarnings,
            e.autoPoolEarnings
        );
    }

    function getAutoPoolStatus(address user)
        external
        view
        returns (
            uint256 earned,
            uint256 target,
            bool completed
        )
    {
        return (
            earning[user].autoPoolEarnings,
            AUTOPOOL_TARGET,
            autoPoolCompleted[user]
        );
    }

    // ============================================================
    // AUTOPOOL QUEUE VIEWS
    // ============================================================

    function getCurrentAutoPoolRecipient()
        external
        view
        returns (address)
    {
        if (autoPoolQueueHead >= autoPoolQueue.length) {
            return address(0);
        }

        return autoPoolQueue[autoPoolQueueHead];
    }

    function getAutoPoolQueueLength()
        external
        view
        returns (uint256)
    {
        return autoPoolQueue.length - autoPoolQueueHead;
    }

    function getAutoPoolQueue(
        uint256 start,
        uint256 count
    )
        external
        view
        returns (address[] memory result)
    {
        uint256 total = autoPoolQueue.length;

        if (start >= total || count == 0) {
            return new address[](0);
        }

        uint256 remaining = total - start;

        uint256 resultLength = count < remaining
            ? count
            : remaining;

        uint256 end = start + resultLength;

        result = new address[](resultLength);

        for (uint256 i = start; i < end; i++) {
            result[i - start] = autoPoolQueue[i];
        }
    }

    // ============================================================
    // CONFIGURATION VIEW
    // ============================================================

    function getTokenConfiguration()
        external
        pure
        returns (TokenConfig memory config)
    {
        config.joinAmount = JOIN_AMOUNT;
        config.adminReward = ADMIN_REWARD;
        config.directReward = DIRECT_REWARD;
        config.levelShare = LEVEL_SHARE;
        config.levelReward = LEVEL_REWARD;
        config.maxLevels = MAX_LEVELS;
        config.autoPoolContribution = AUTOPOOL_CONTRIBUTION;
        config.autoPoolTarget = AUTOPOOL_TARGET;
    }

    // ============================================================
    // DIRECT REFERRAL VIEWS
    // ============================================================

    function getDirectReferralCount(address user)
        external
        view
        returns (uint256)
    {
        return directReferrals[user].length;
    }

    function getDirectReferralAddresses(address user)
        external
        view
        returns (address[] memory)
    {
        return directReferrals[user];
    }

    function getDirectReferrals(
        address user,
        uint256 offset,
        uint256 limit
    )
        external
        view
        returns (MemberDetails[] memory result)
    {
        require(limit <= 100, "Limit too high");

        uint256 total = directReferrals[user].length;

        if (offset >= total || limit == 0) {
            return new MemberDetails[](0);
        }

        uint256 remaining = total - offset;

        uint256 resultLength = limit < remaining
            ? limit
            : remaining;

        uint256 end = offset + resultLength;

        result = new MemberDetails[](resultLength);

        for (uint256 i = offset; i < end; i++) {
            address member = directReferrals[user][i];

            UserInfo storage info = userInfo[member];

            result[i - offset] = MemberDetails({
                wallet: member,
                fullName: info.fullName,
                email: info.email,
                mobile: info.mobile,
                joinedAt: info.joinedAt,
                joined: info.joined
            });
        }
    }

    // ============================================================
    // LEVEL REWARD VIEWS
    // ============================================================

    function getLevelMemberCount(
        address user,
        uint256 level
    )
        external
        view
        returns (uint256)
    {
        require(
            level >= 1 && level <= MAX_LEVELS,
            "Invalid level"
        );

        return levelMembers[user][level].length;
    }

    function getLevelEarnings(
        address user,
        uint256 level
    )
        external
        view
        returns (uint256)
    {
        require(
            level >= 1 && level <= MAX_LEVELS,
            "Invalid level"
        );

        return levelEarningsByLevel[user][level];
    }

    function getLevelMembers(
        address user,
        uint256 level,
        uint256 offset,
        uint256 limit
    )
        external
        view
        returns (MemberDetails[] memory result)
    {
        require(
            level >= 1 && level <= MAX_LEVELS,
            "Invalid level"
        );

        require(limit <= 100, "Limit too high");

        uint256 total = levelMembers[user][level].length;

        if (offset >= total || limit == 0) {
            return new MemberDetails[](0);
        }

        uint256 remaining = total - offset;

        uint256 resultLength = limit < remaining
            ? limit
            : remaining;

        uint256 end = offset + resultLength;

        result = new MemberDetails[](resultLength);

        for (uint256 i = offset; i < end; i++) {
            address member = levelMembers[user][level][i];

            UserInfo storage info = userInfo[member];

            result[i - offset] = MemberDetails({
                wallet: member,
                fullName: info.fullName,
                email: info.email,
                mobile: info.mobile,
                joinedAt: info.joinedAt,
                joined: info.joined
            });
        }
    }

    function getLevelSummary(address user)
        external
        view
        returns (
            uint256[10] memory earnings,
            uint256[10] memory memberCounts
        )
    {
        for (uint256 i = 0; i < MAX_LEVELS; i++) {
            uint256 level = i + 1;

            earnings[i] = levelEarningsByLevel[user][level];

            memberCounts[i] = levelMembers[user][level].length;
        }
    }
}
