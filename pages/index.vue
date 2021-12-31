<template>
  <VRow style="height: 100%; overflow: hidden">
    <VCol cols="12" md="6" class="py-md-16 px-md-10 py-10 px-6">
      <div class="d-flex flex-column align-center">
        <img
          class="mt-2"
          src="/MGSocialHomepageLogo.png"
          alt="logo"
          width="100"
        />
        <div class="text-center mb-16" style="margin-top: 5rem">
          <div class="text-h4 font-weight-black">Sign in to your account</div>
          <div class="font-weight-medium mt-3 blue-grey--text text--darken-2">
            Need an account? <a href="https://coil.com/">Sign up with Coil</a>
          </div>
        </div>
        <div class="sign-in-btn" @click="signin">
          <img src="/signin-coil-black.png" alt="coil_sign_in" width="220" />
        </div>
        <div class="font-weight-medium mt-1 blue-grey--text text--darken-2">
          or download the
          <a href="https://apps.apple.com/us/app/mg-social/id1561681322">IOS</a>
          and
          <a
            href="https://play.google.com/store/apps/details?id=social.mg.mobileapp"
            >Android</a
          >
          app
        </div>
        <div class="body-2 text-center mt-16" style="max-width: 28rem">
          <NuxtLink class="nuxt-link" to="/">© COPYRIGHT MG.SOCIAL</NuxtLink>
          <span>·</span>
          <NuxtLink class="nuxt-link" to="/site/about">About</NuxtLink>
          <span>·</span>
          <NuxtLink class="nuxt-link" to="/site/terms"
            >Terms and Conditions</NuxtLink
          >
          <span>·</span>
          <NuxtLink class="nuxt-link" to="/site/privacy">Privacy</NuxtLink>
          <span>·</span>
          <a href="/MG.SOCIAL_VISIONPAPER_FINAL_3.pdf" class="nuxt-link"
            >Vision</a
          >
        </div>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="6"
      class="blue darken-3 white--text hidden-sm-and-down"
      style="padding: 8rem 5rem"
    >
      <v-chip label color="blue darken-4" dark :ripple="false"
        >New and Improved</v-chip
      >
      <div class="text-h4 font-weight-black mt-6">Welcome to MG.Social!</div>
      <p class="mt-5 body-1" style="max-width: 28rem">
        Get paid to post! An ad-free social network with blockchain monetization
        powered by
        <a class="white--text" href="https://coil.com/" target="_BLANK">Coil</a>
        and
        <a class="white--text" href="https://xumm.app/" target="_BLANK">Xumm</a
        >.
      </p>
      <video controls class="mt-5" poster="/poster.png">
        <source src="/mg-social-intro.mp4" type="video/mp4" />
      </video>
    </VCol>
  </VRow>
</template>

<script lang="ts">
import { useSnackbar } from '~/composables';

export default defineComponent({
  middleware: 'public',
  setup() {
    const { $config, $vuetify, app } = useContext();
    const showSnackbar = useSnackbar();

    $vuetify.theme.dark = false;
    const signin = () => {
      location.href = $config.loginUrl;
    };

    onMounted(() => {
      const hasError = app.$cookies.get('login-fail-status');

      if (hasError) {
        showSnackbar(hasError);
        app.$cookies.remove('login-fail-status');
      }
    });

    return {
      signin,
    };
  },
});
</script>

<style>
.sign-in-btn {
  cursor: pointer;
}

.sign-in-btn:hover {
  opacity: 0.8;
}

video {
  width: 100%;
  max-height: 100%;
}
</style>
