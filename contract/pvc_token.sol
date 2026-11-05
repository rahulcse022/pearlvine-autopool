// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.7.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PVC is ERC20, Ownable {
    constructor() ERC20("PVC", "PVC") Ownable(msg.sender) {}

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
