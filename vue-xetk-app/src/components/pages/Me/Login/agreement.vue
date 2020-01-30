<template>
  <div class="view-user-agreemrnt">
    <div class="main">
      <div>
        <div v-html="userAgreementContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { userAgreementContent } from "@/utils/texts";
export default {
  data() {
    return {
      userAgreementContent
    };
  }
};
</script>

<style lang="scss" scoped>
.view-user-agreemrnt {
  .main {
    > div {
      text-align: left;
      padding: 15px;
      font-size: 14px;
      margin-top: 10px;
      background-color: #ffffff;
    }
  }
}
</style>
