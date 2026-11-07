
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PVCReferralSystem is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable pvcToken;

    uint256 private constant UNIT = 1e18;

    // =================================================
    // CONFIGURATION
    // Change these values before deploying a new contract
    // =================================================

    uint256 public constant JOIN_AMOUNT = 5 * UNIT;

    uint256 public constant ADMIN_REWARD = 1 * UNIT;

    uint256 public constant DIRECT_REWARD = 1 * UNIT;

    uint256 public constant LEVEL_SHARE = 1 * UNIT;

    uint256 public constant LEVEL_REWARD = 1e17; // 0.1 PVC

    uint256 public constant AUTOPOOL_CONTRIBUTION = 2 * UNIT;

    uint256 public constant AUTOPOOL_TARGET = 8 * UNIT;

    uint256 public constant MAX_LEVELS = 10;

    // =================================================
    // STRUCTS
    // =================================================

    struct UserInfo {
        string fullName;
        string email;
        string mobile;
        address sponsor;
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

    // =================================================
    // STORAGE
    // =================================================

    mapping(address => UserInfo) public userInfo;

    mapping(address => address) public referrerOf;

    mapping(address => Earning) public earning;

    // Admin funds retained inside contract
    uint256 public adminReserve;

    // Total registered members
    uint256 public totalJoined;

    // =================================================
    // AUTOPOOL STORAGE
    // =================================================

    // FIFO queue
    address[] private autoPoolQueue;

    // Current queue recipient index
    uint256 public autoPoolQueueHead;

    // AutoPool completion status
    mapping(address => bool) public autoPoolCompleted;

    // =================================================
    // EVENTS
    // =================================================

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

    // =================================================
    // CONSTRUCTOR
    // =================================================

    constructor(address _pvcToken)
        Ownable(msg.sender)
    {
        require(_pvcToken != address(0), "Invalid token");
        require(_pvcToken.code.length > 0, "Token is not contract");

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

    // =================================================
    // MEMBERSHIP
    // =================================================

    function _isMember(address user)
        private
        view
        returns (bool)
    {
        return (
            user == address(this) ||
            referrerOf[user] != address(0)
        );
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

    // =================================================
    // JOIN
    // =================================================

    function join(UserInfo calldata _user)
        external
        nonReentrant
    {
        require(!_isMember(msg.sender), "Already joined");

        require(
            _isMember(_user.sponsor),
            "Invalid referrer"
        );

        // Register user
        referrerOf[msg.sender] = _user.sponsor;

        userInfo[msg.sender] = UserInfo({
            fullName: _user.fullName,
            email: _user.email,
            mobile: _user.mobile,
            sponsor: _user.sponsor,
            joined: true
        });

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

        // =================================================
        // 1. DIRECT REFERRAL REWARD
        // =================================================

        if (_user.sponsor == address(this)) {

            // Root's direct reward stays in admin reserve
            toAdmin += DIRECT_REWARD;

        } else {

            pvcToken.safeTransfer(
                _user.sponsor,
                DIRECT_REWARD
            );

            earning[_user.sponsor].directEarnings +=
                DIRECT_REWARD;

            emit DirectRewardPaid(
                msg.sender,
                _user.sponsor,
                DIRECT_REWARD
            );
        }

        // =================================================
        // 2. LEVEL REWARDS
        // =================================================

        address upline = referrerOf[_user.sponsor];

        uint256 levelsPaid = 0;

        while (
            levelsPaid < MAX_LEVELS &&
            upline != address(0) &&
            upline != address(this)
        ) {
            pvcToken.safeTransfer(
                upline,
                LEVEL_REWARD
            );

            earning[upline].levelEarnings +=
                LEVEL_REWARD;

            levelsPaid++;

            emit LevelRewardPaid(
                msg.sender,
                upline,
                levelsPaid,
                LEVEL_REWARD
            );

            upline = referrerOf[upline];
        }

        // Unpaid level amount goes to admin reserve
        toAdmin += (
            LEVEL_SHARE -
            (levelsPaid * LEVEL_REWARD)
        );

        adminReserve += toAdmin;

        emit AdminReserveAccrued(
            toAdmin,
            adminReserve
        );

        // =================================================
        // 3. AUTOPOOL REWARD
        // =================================================

        _processAutoPool(msg.sender);
        
        emit UserJoined(
            msg.sender,
            _user.sponsor
        );
    }

    // =================================================
    // AUTOPOOL FIFO PROCESSING
    // =================================================

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

            uint256 needed =
                AUTOPOOL_TARGET - alreadyEarned;

            // Calculate payment
            uint256 payout = remaining < needed
                ? remaining
                : needed;

            // Update accounting before token transfer
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

            // Move to next user after completing target
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

    // =================================================
    // ADMIN WITHDRAWAL
    // =================================================

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

    // =================================================
    // USER VIEWS
    // =================================================

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
        Earning memory e = earning[user];

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

    // =================================================
    // AUTOPOOL QUEUE VIEWS
    // =================================================

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
        uint256 end = start + count;

        if (end > autoPoolQueue.length) {
            end = autoPoolQueue.length;
        }

        require(start <= end, "Invalid start");

        result = new address[](end - start);

        for (uint256 i = start; i < end; i++) {
            result[i - start] = autoPoolQueue[i];
        }
    }

    // =================================================
    // CONFIGURATION VIEW
    // =================================================

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
}
