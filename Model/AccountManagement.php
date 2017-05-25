<?php
/**
 * Copyright © MageKey. All rights reserved.
 */
namespace MageKey\CustomerPassword\Model;

use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Customer\Model\CustomerRegistry;
use Magento\Framework\Encryption\EncryptorInterface as Encryptor;

class AccountManagement
{
    /**
     * @var CustomerRepositoryInterface
     */
    protected $customerRepository;
    
    /**
     * @var CustomerRegistry
     */
    protected $customerRegistry;
    
    /**
     * @var Encryptor
     */
    protected $encryptor;
    
    /**
     * @param CustomerRepositoryInterface $customerRepository
     * @param CustomerRegistry $customerRegistry
     * @param Encryptor $encryptor
     */
    public function __construct(
        CustomerRepositoryInterface $customerRepository,
        CustomerRegistry $customerRegistry,
        Encryptor $encryptor
    ) {
        $this->customerRepository = $customerRepository;
        $this->customerRegistry = $customerRegistry;
        $this->encryptor = $encryptor;
    }

    /**
     * Change customer password by id
     * 
     * @param int $customerId
     * @param string $password
     * @return void
     */
    public function changePasswordById($customerId, $password)
    {
        $customer = $this->customerRepository->getById($customerId);
        $customerSecure = $this->customerRegistry->retrieveSecureData($customer->getId());
        $customerSecure->setRpToken(null);
        $customerSecure->setRpTokenCreatedAt(null);
        $passwordHash = $this->encryptor->getHash($password, true);
        $customerSecure->setPasswordHash($passwordHash);
        $this->customerRepository->save($customer);
    }
}
