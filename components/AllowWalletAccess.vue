<template>
  <div
    class="wrm-flex-column"
    style="font-family: Arial; height: 100vh; justify-content: center">
    <div style="padding-bottom: 10px; font-size: 14px;">
      Credential Wallet authorized! Please click below to close this window.
    </div>

    <div
      class="wrm-button-bar"
      style="margin-top: 10px; font-size: 12px">
      <button
        type="button"
        class="wrm-button wrm-primary"
        @click="onClose()">
        Close
      </button>
    </div>
  </div>
</template>

<script>
/*!
 * New BSD License (3-clause)
 * Copyright (c) 2019-2021, Digital Bazaar, Inc.
 * All rights reserved.
 */
export default {
  name: 'AllowWalletAccess',
  methods: {
    async onClose() {
      // set cookie to enable cross-domain storage access on Safari
      // Note: This cookie is only used by Safari. It must be accessible to
      // JavaScript (not http-only) in order for storage access to work
      // properly. Safari will only persist this cookie for 7 days per:
      // https://www.cookiestatus.com/safari/#first-party-cookies
      // But setting it in JS allows for the mediator to be a static site.
      document.cookie = 'v=1;secure';
      window.close();
    }
  }
};

</script>

<style>
</style>
