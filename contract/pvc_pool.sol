// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Referral system. Root = this contract (address(this)).
/// @dev Token must have 18 decimals and must NOT be fee-on-transfer.
///      Split per join (200,000): 50,000 direct + 10,000 level share
///      + 40,000 admin + 100,000 pool = 200,000.
///      Each existing upline (max 10) gets 100. Whatever remains of the
///      10,000 level share stays in the contract as adminReserve
///      (withdrawable by owner).
///      Airdrop (500 to joiner + 500 to referrer) is paid out of adminReserve.
contract PVCReferralSystem is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable pvcToken;

    uint256 private constant UNIT = 1e18;
    uint256 private constant JOIN_AMOUNT = 200_000 * UNIT;
    uint256 private constant DIRECT_REWARD = 50_000 * UNIT;
    uint256 private constant LEVEL_REWARD = 100 * UNIT; // paid per existing upline
    uint256 private constant LEVEL_SHARE = 10_000 * UNIT; // total 10-level share of a join
    uint256 private constant ADMIN_REWARD = 40_000 * UNIT;
    uint256 private constant POOL_REWARD = 100_000 * UNIT;
    uint256 private constant AIRDROP_REWARD = 500 * UNIT;
    uint256 private constant MAX_LEVELS = 10;

    // ============================================
    // STRUCTS
    // ============================================

    

    struct Earning {
        uint256 directEarnings;
        uint256 levelEarnings;
        uint256 airdropEarnings;
        uint256 pendingAirdropEarning;
    }

 struct UserInfo {
        string fullName;
        string email;
        string mobile;
        address sponsor;
        bool joined;
    }
    mapping (address => UserInfo) public userInfo;

    struct TokenConfig {
        uint256 joinAmount;
        uint256 directReward;
        uint256 levelReward;
        uint256 adminReward;
        uint256 poolReward;
        uint256 airdropReward;
    }

    // ============================================
    // STORAGE
    // ============================================

    mapping(address => address) public referrerOf;
    mapping(address => Earning) public earning;


    uint256 private totalJoined;

    bool public airdropPaused;

    // ============================================
    // EVENTS
    // ============================================

    event UserJoined(address indexed user, address indexed referrer);
    event DirectRewardPaid(
        address indexed user,
        address indexed referrer,
        uint256 amount
    );
    event LevelRewardPaid(
        address indexed user,
        address indexed upline,
        uint256 level,
        uint256 amount
    );
    event AirdropPaid(address indexed user, uint256 amount);
    event AirdropQueued(address indexed user, uint256 amount);
    event AirdropClaimed(address indexed user, uint256 amount);
    event AirdropStatusChanged(bool paused);
    event FundsWithdrawn(address indexed recipient, uint256 amount);

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor(address _pvcToken) Ownable(msg.sender) {
        require(_pvcToken != address(0), "Invalid token");
        pvcToken = IERC20(_pvcToken);
    }

    // ============================================
    // MEMBERSHIP
    // ============================================

    /// @dev Root (this contract) is always a member; everyone else is a
    ///      member only if they have a referrer.
    function _isMember(address user) private view returns (bool) {
        return user == address(this) || referrerOf[user] != address(0);
    }

    function hasJoined(address user) external view returns (bool) {
        return _isMember(user);
    }

    function isRoot(address user) public view returns (bool) {
        return user == address(this);
    }

    // ============================================
    // USER: JOIN
    // ============================================

    function join(UserInfo memory _user) external nonReentrant {
        require(!_isMember(msg.sender), "Already joined");
        // Also rules out address(0) and self-referral (sender is not a member yet).
        require(_isMember(_user.sponsor), "Invalid referrer");

        referrerOf[msg.sender] = _user.sponsor;

        pvcToken.safeTransferFrom(msg.sender, address(this), JOIN_AMOUNT);

        uint256 toAdmin = ADMIN_REWARD;

        // 1. Direct reward (root's share goes to admin reserve).
        if (_user.sponsor == address(this)) {
            toAdmin += DIRECT_REWARD;
        } else {
            pvcToken.safeTransfer(_user.sponsor, DIRECT_REWARD);
            earning[_user.sponsor].directEarnings += DIRECT_REWARD;
            emit DirectRewardPaid(msg.sender, _user.sponsor, DIRECT_REWARD);
        }

        // 2. Level rewards: 100 to each existing upline (max 10, root excluded).
        address upline = referrerOf[_user.sponsor];
        uint256 levelsPaid;

        while (levelsPaid < MAX_LEVELS && upline != address(0) && upline != address(this)) {
            pvcToken.safeTransfer(upline, LEVEL_REWARD);
            earning[upline].levelEarnings += LEVEL_REWARD;
            levelsPaid++;
            emit LevelRewardPaid(msg.sender, upline, levelsPaid, LEVEL_REWARD);
            upline = referrerOf[upline];
        }

        // Unpaid part of the level share stays in contract for admin.
        toAdmin += LEVEL_SHARE - levelsPaid * LEVEL_REWARD;


        totalJoined++;

        userInfo[msg.sender] = _user;

        emit UserJoined(msg.sender, _user.sponsor);
    }

    // ============================================
    // ADMIN
    // ============================================

    function toggleAirdrop(bool status) external onlyOwner {
        airdropPaused = status;
        emit AirdropStatusChanged(status);
    }


    // ============================================
    // VIEWS
    // ============================================

 

    /// @notice uplines[i] = level (i+1) upline, i.e. the addresses that
    ///         receive level rewards when `user` joins.
    function getUserUpline(address user)
        external
        view
        returns (address[10] memory uplines)
    {
        address current = referrerOf[referrerOf[user]];

        for (uint256 i = 0; i < MAX_LEVELS && current != address(0); i++) {
            uplines[i] = current;
            current = referrerOf[current];
        }
    }



    function getTokenConfiguration()
        external
        pure
        returns (TokenConfig memory config)
    {
        config.joinAmount = JOIN_AMOUNT;
        config.directReward = DIRECT_REWARD;
        config.levelReward = LEVEL_REWARD;
        config.adminReward = ADMIN_REWARD;
        config.poolReward = POOL_REWARD;
        config.airdropReward = AIRDROP_REWARD;
    }
}
