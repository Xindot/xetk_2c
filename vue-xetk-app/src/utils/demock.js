// 首页
const index = {
    "data": {
        "banner": [{
            "id": 53,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/05a22ad17591b9293e271936b7ea92d8.png",
            "width": null,
            "height": null,
            "redirect_type": "h5",
            "redirect_to": "newPerson",
            "url": "newPerson"
        }, {
            "id": 54,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/dd0438a2a0637e46974a90996a0f3e64.png",
            "width": null,
            "height": null,
            "redirect_type": "h5",
            "redirect_to": "newPerson",
            "url": "newPerson"
        }],
        "notice": [{
            "id": 4,
            "content": "热门活动来袭，赶紧去领取吧！",
            "url": null,
            "created_at": null
        }, {
            "id": 3,
            "content": "新人注册即可领取168元优惠券",
            "url": null,
            "created_at": null
        }],
        "menu": [{
            "id": 13,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/ab75b4f526a9dc327fd4191a3fe90b1b.png",
            "name": "油卡充值",
            "redirect_type": "app",
            "redirect_to": "oilpackage",
            "url": "oilpackage"
        }, {
            "id": 14,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/a67b06959d1104fe9ff753db927e4978.png",
            "name": "话费充值",
            "redirect_type": "app",
            "redirect_to": "phonepackage",
            "url": "phonepackage"
        }, {
            "id": 15,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/9e3577cdcb7a07cbf6d22c9686f8515d.png",
            "name": "安全保障",
            "redirect_type": "h5",
            "redirect_to": "safepage",
            "url": "safepage"
        }, {
            "id": 16,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/fbdf88de1761c0cad8c00bf78b32efc4.png",
            "name": "热门活动",
            "redirect_type": "h5",
            "redirect_to": "hotactivity",
            "url": "hotactivity"
        }],
        "adv1": [{
            "id": 55,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/ca4d3671b0094b0266b1bb373fd18958.png",
            "width": null,
            "height": null,
            "redirect_type": "app",
            "redirect_to": "oilpackage",
            "url": "oilpackage"
        }, {
            "id": 56,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/09094c63869fcb5f448c61955a025b3c.png",
            "width": null,
            "height": null,
            "redirect_type": "h5",
            "redirect_to": "newPerson",
            "url": "newPerson"
        }],
        "adv2": [{
            "id": 57,
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190707/9e58e2431b1422411e2a8789fef9e672.png",
            "width": null,
            "height": null,
            "redirect_type": "h5",
            "redirect_to": "newPerson",
            "url": "newPerson"
        }]
    },
    "code": 0,
    "msg": "ok"
}

// 我的 个人信息
const meInfo = {
    "data": {
        "avatar": "https://wzwh.oss-cn-hangzhou.aliyuncs.com/OIL_CARD/20190624/c5932ad996d887858a15a37b87a028e6.png",
        "nickname": "187****5975",
        "open_code": "50792556",
        "open_id": "",
        "mobile": "18758885975",
        "unionid": null,
        "prev_recharge_amount": "¥0.00",
        "next_recharge_date": "暂无",
        "next_recharge_amount": "¥0.00",
        "coupon": 5,
        "phone": "18758885975"
    },
    "code": 0,
    "msg": "ok"
}

// 发现 限时活动
const findHd = {
    "data": {
        "activity": [{
            "id": 14,
            "title": "邀请有礼,多邀多得",
            "image": "http://wzwh.oss-cn-hangzhou.aliyuncs.com/OIL_CARD/20190625/bb86e2adf5069fc3695dddc38eb6f95e.png",
            "redirect_to": "Share",
            "url": "http://h5.wenhuakj.com/Share",
            "status": 1,
            "status_text": "进行中"
        }]
    },
    "code": 0,
    "msg": "ok"
}

// 油卡充值
// 套餐
const oilCardMeals = {
    "data": [{
        "id": 0,
        "title": "即时充值",
        "discount": "0.99",
        "max_amount": "5000.00",
        "min_amount": "100.00",
        "only_first": 0,
        "months": 1,
        "tag": "",
        "sell_num": 0,
        "selected": 0,
        "img_url": null
    }, {
        "id": 13,
        "title": "3个月加油套餐",
        "discount": "0.96",
        "max_amount": "5000.00",
        "min_amount": "100.00",
        "only_first": 0,
        "months": 3,
        "tag": "",
        "sell_num": 0,
        "selected": 1,
        "img_url": null
    }, {
        "id": 14,
        "title": "6个月加油套餐",
        "discount": "0.93",
        "max_amount": "5000.00",
        "min_amount": "100.00",
        "only_first": 0,
        "months": 6,
        "tag": "",
        "sell_num": 0,
        "selected": 0,
        "img_url": null
    }, {
        "id": 17,
        "title": "12个月加油套餐",
        "discount": "0.82",
        "max_amount": "5000.00",
        "min_amount": "100.00",
        "only_first": 0,
        "months": 12,
        "tag": "",
        "sell_num": 0,
        "selected": 0,
        "img_url": null
    }, {
        "id": 16,
        "title": "18个月加油套餐",
        "discount": "0.79",
        "max_amount": "5000.00",
        "min_amount": "100.00",
        "only_first": 0,
        "months": 18,
        "tag": "",
        "sell_num": 0,
        "selected": 0,
        "img_url": null
    }, {
        "id": 15,
        "title": "24个月加油套餐",
        "discount": "0.69",
        "max_amount": "5000.00",
        "min_amount": "100.00",
        "only_first": 0,
        "months": 24,
        "tag": "",
        "sell_num": 0,
        "selected": 0,
        "img_url": null
    }],
    "code": 0,
    "msg": "ok"
}

// 直充
const oilCardMeal = {
    "data": [{
        "sell_price": 100,
        "real_price": 99
    }, {
        "sell_price": 200,
        "real_price": 198
    }, {
        "sell_price": 500,
        "real_price": 495
    }, {
        "sell_price": 1000,
        "real_price": 990
    }],
    "code": 0,
    "msg": "ok"
}

// 商城首页
const shopnNav = {
    "data": {
        "menu": [{
            "id": 55,
            "class_name": "汽车用品",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/a183f6b55acd0ffaf77de9d7253d30a4.png",
            "url": null,
            "child": [{
                "id": 65,
                "class_name": "汽车配件"
            }]
        }, {
            "id": 56,
            "class_name": "家用电器",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/bd7f84c2dd270c4748df5bcfca353f18.png",
            "url": null,
            "child": []
        }, {
            "id": 57,
            "class_name": "家具百货",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/0acce1d103681357d798fb14b476fa55.png",
            "url": null,
            "child": []
        }, {
            "id": 58,
            "class_name": "食品酒水",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/2d45be6fdc29c818b748054591c881db.png",
            "url": null,
            "child": []
        }, {
            "id": 59,
            "class_name": "数码办公",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/115bd325e2f238ca3be8298c9332989c.png",
            "url": null,
            "child": []
        }, {
            "id": 60,
            "class_name": "服装配饰",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/da19da738acec43129424a7f104e9c04.png",
            "url": null,
            "child": []
        }, {
            "id": 61,
            "class_name": "美妆个护",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/f6635339f6925163f0cb144b55e67244.png",
            "url": null,
            "child": []
        }, {
            "id": 62,
            "class_name": "母婴用品",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/dcdf7655569d4bf30db31dd49a5aeb3a.png",
            "url": null,
            "child": []
        }, {
            "id": 63,
            "class_name": "精选箱包",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/f7637d176a8d36c7268db1acbeb0f067.png",
            "url": null,
            "child": []
        }, {
            "id": 64,
            "class_name": "户外运动",
            "image": "http://gskj.oss-cn-hangzhou.aliyuncs.com/20190827/82e322055eef7d13e22abdb3ba3b75fa.png",
            "url": null,
            "child": []
        }]
    },
    "code": 0,
    "msg": "ok"
}

export {
    index,
    meInfo,
    findHd,
    oilCardMeal,
    oilCardMeals,
    shopnNav,
}