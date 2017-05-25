/**
 * Copyright © MageKey. All rights reserved.
 */
define([
    'jquery',
    'underscore',
    'Magento_Ui/js/modal/modal',
    'Magento_Ui/js/modal/alert',
    'mage/translate'
], function ($, _, modal, alert) {
    'use strict';
    
    var changePasswordModal;

    $.widget('mage.MageKey_CustomerPassword__changepassword', $.mage.modal, {
        options: {
            title: $.mage.__('Please enter new password'),
            modalClass: 'magekey-customerpassword-modal',
            passwordField: '[data-role="passwordField"]',
            buttons: [{
                text: $.mage.__('Cancel'),
                class: 'action-secondary action-dismiss',
                click: function () {
                    this.closeModal();
                }
            }, {
                text: $.mage.__('OK'),
                class: 'action-primary action-accept',
                click: function () {
                    var self = this;
                    $.ajax({
                        url: self.options.saveUrl,
                        type: 'POST',
                        dataType: 'JSON',
                        showLoader: true,
                        data: {password: self.modal.find(self.options.passwordField).val()},
                        success: function (response) {
                            self.closeModal();
                            alert({
                                modalClass: 'confirm',
                                title: response.error ? $.mage.__('Error') : $.mage.__('Success'),
                                content: response.message
                            });
                        }
                    });
                }
            }]
        },

        /**
         * Create widget.
         */
        _create: function () {
            this.options.focus = this.options.passwordField;
            this._super();
            this.modal.find(this.options.modalContent).append(
                '<div class="admin__field-control">' +
                    '<input data-role="passwordField" id="password-field" class="admin__control-text" type="password"/>' +
                '</div>'
            );
            this.modal.find(this.options.modalCloseBtn).off().on('click',  _.bind(this.closeModal, this, false));
        },
        
        /**
         * Open modal window
         */
        openModal: function () {
            this._super();
            this.modal.find(this.options.passwordField).val(this.options.value);
        },
    });
    
    return function (data, el) {
        if (!changePasswordModal) {
            changePasswordModal = $.mage.MageKey_CustomerPassword__changepassword(data);
        }
        $(el).click(function () {
            changePasswordModal.openModal();
        });
    };
});
