<template>
  <div class="view-faq">
    <div class="main">
      <div>
        <div v-for="(el,index) in list" :key="index" class="list-one">
          <div class="q-1" :class="{'un-fold':el.unfold}" @click="el.unfold=!el.unfold">
            <span>{{el.title}}</span>
            <img :src="icons.i_arrow_b" alt class="arrow-b" />
          </div>
          <div class="q-2" v-if="el.unfold">
            <p v-for="(em,indexm) in el.desc" :key="indexm" v-html="em"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i_arrow_b from "@/assets/icon/common/arrow-b.svg";
export default {
  data() {
    return {
      icons: { i_arrow_b },
      list: [
        {
          title: "1、加油卡充值完成后为何要去线下“圈存”？",
          desc: [
            "“圈存”即是将您网上充值的资金存到加油卡的芯片里。未圈存前，资金只是进入系统后台的备付金账户，没有直接到达加油卡上，圈存后，资金才会进入加油卡里，故线上充值完成后，需要到加油站或发卡点将充入加油卡账户中的金额存放到加油卡的卡片中，只有圈存后加油卡才能在加油站加油。"
          ],
          unfold: false
        },
        {
          title: "2、加油卡在线充值有发票吗？",
          desc: [
            "本充值平台提供的加油卡充值为代充服务，暂不提供发票，也不支持到加油站开具发票,敬请谅解！"
          ],
          unfold: false
        },
        {
          title: "3、加油卡可以“副卡”充值吗？",
          desc: [
            "对不起，本充值平台仅针对全国中石油、全国中石化主卡进行充值，副卡暂时无法进行充值。"
          ],
          unfold: false
        },
        {
          title: "4、充值成功后，还需要哪些操作？",
          desc: [
            "充值成功后，需要到当地加油站办理圈存后方可加油使用。<br/>多卡用户则需要将加油卡余额分配到副卡中，然后进行圈存后，副卡才可加油使用。"
          ],
          unfold: false
        },
        {
          title: "5、中国石化加油卡分类？",
          desc: [
            "中石化加油卡在归属上分为单位卡与个人卡，两者在充值上无区别，区别在于所需要充值的加油卡是单用户卡还是多用户卡。<br/>单用户卡是单张加油卡，直接充值使用即可；<br/>多用户卡是一张主卡带若干张副卡，主卡充值以后钱到主卡额度账户上，经过主卡额度账户进行分配金额，副卡才可以进行加油消费。"
          ],
          unfold: false
        },
        {
          title: "6、充错加油卡卡号怎么办？",
          desc: [
            "非常抱歉，充错账号不能办理退款。请客户在充值时仔细核对充值账号是否正确，确认无误后再办理充值交易。"
          ],
          unfold: false
        },
        {
          title: "7、加油卡充值失败会有提醒么？",
          desc: [
            "有的，充值失败后，我司系统会将充值失败的提醒短信发送到您的手机号码上。"
          ],
          unfold: false
        },
        {
          title: "8、加油卡充值多久到账？",
          desc: [
            "实时到账。可能会因为系统升级出现延时到账的情况，请在5天内关注是否退款。同时，可登录支付宝或者微信账户查看交易记录。"
          ],
          unfold: false
        }
      ]
    };
  },
  created() {
    // this.$parent.setHeader({
    //     leftEvent:(res)=>{
    //         console.log('sss')
    //     }
    // })
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.view-faq {
  .main {
    > div {
      margin-top: 10px;
      text-align: left;
      background-color: #ffffff;
      padding: 5px 20px;
      box-sizing: border-box;
      font-size: 13px;
      .list-one {
        &:last-child {
          .q-1 {
            border-bottom: none;
          }
        }
        > div {
          &.q-1 {
            border-bottom: solid 1px $border-color;
            line-height: $list-one-height;
            position: relative;
            font-weight: 500;
            &.un-fold {
              img {
                &.arrow-b {
                  transform: translateY(-50%) rotate(-45deg);
                }
              }
            }
            img {
              &.arrow-b {
                height: 9px;
                width: 9px;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%) rotate(135deg);
                opacity: 0.3;
                transition: transform 0.3s;
              }
            }
          }
          &.q-2 {
            padding: 5px 10px 5px 25px;
            color: $default-color;
            > p {
              position: relative;
              &::before {
                content: "";
                width: 3.5px;
                height: 3.5px;
                border-radius: $circle-border-radius;
                background-color: #b4b4b4;
                position: absolute;
                left: -10px;
                top: 7px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
