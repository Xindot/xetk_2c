// 接口前缀
import {
    OilManApiPrefix
} from '@/utils/const'
// console.log(OilManApiPrefix)
const OilManApi = OilManApiPrefix + '/v2/api'
// 请求中转
import request from '@/utils/request';

// 首页
export function api_home_index(params) {
    return request({
        url: `${OilManApi}/home/index`,
        method: 'get',
        params,
    });
}

// 油卡
// 我的油卡
export function api_user_oilCard(data) {
    return request({
        url: `${OilManApi}/user/oilCard`,
        method: 'post',
        data,
    });
}
// 绑定油卡
export function api_oil_bindOil(data) {
    return request({
        url: `${OilManApi}/oil/bindOil`,
        method: 'post',
        data,
    });
}
// 油卡解绑
export function api_oil_removeBind(data) {
    return request({
        url: `${OilManApi}/oil/removeBind`,
        method: 'post',
        data,
    });
}

// 油卡充值套餐
export function api_oil_meals(params) {
    return request({
        url: `${OilManApi}/oil/meals`,
        method: 'get',
        params,
    });
}
// 油卡直充
export function api_oil_meal(params) {
    return request({
        url: `${OilManApi}/oil/meal`,
        method: 'get',
        params,
    });
}
// 可用优惠券
export function api_oil_usableCoupon(data) {
    return request({
        url: `${OilManApi}/oil/usableCoupon`,
        method: 'post',
        data,
    });
}
// 油卡充值明细
export function api_oil_detail(data) {
    return request({
        url: `${OilManApi}/oil/detail`,
        method: 'post',
        data,
    });
}

// 话费充值套餐
export function api_mobile_meals(params) {
    return request({
        url: `${OilManApi}/mobile/meals`,
        method: 'get',
        params,
    });
}
// 话费直充
export function api_mobile_meal(params) {
    return request({
        url: `${OilManApi}/mobile/meal`,
        method: 'get',
        params,
    });
}
// 统一下单
export function api_oil_oilOrder(data) {
    return request({
        url: `${OilManApi}/oil/oilOrder`,
        method: 'post',
        data,
    });
}
// 订单列表
export function api_recharge_orderList(data) {
    return request({
        url: `${OilManApi}/recharge/orderList`,
        method: 'post',
        data,
    });
}
// 订单详情
export function api_recharge_orderDetail(data) {
    return request({
        url: `${OilManApi}/recharge/orderDetail`,
        method: 'post',
        data,
    });
}
// 取消订单
export function api_recharge_close(data) {
    return request({
        url: `${OilManApi}/recharge/close`,
        method: 'post',
        data,
    });
}
// 订单再次支付
export function api_oil_recharge_pay(data) {
    return request({
        url: `${OilManApi}/oil/recharge/pay`,
        method: 'post',
        data,
    });
}

// 我的
// 注册
// 手机号注册
export function api_user_register(data) {
    return request({
        url: `${OilManApi}/user/register`,
        method: 'post',
        data,
    });
}
// 发送验证码
export function api_sms_send(data) {
    return request({
        url: `${OilManApi}/sms/send`,
        method: 'post',
        data,
    });
}
// 修改绑定手机号
export function api_user_changeMobile(data) {
    return request({
        url: `${OilManApi}/user/changeMobile`,
        method: 'post',
        data,
    });
}
// 修改密码
export function api_user_changePassword(data) {
    return request({
        url: `${OilManApi}/user/changePassword`,
        method: 'post',
        data,
    });
}

// 登录
export function api_user_login(data) {
    return request({
        url: `${OilManApi}/user/login`,
        method: 'post',
        data,
    });
}
// 用户信息
export function api_user_info(data) {
    return request({
        url: `${OilManApi}/user/info`,
        method: 'post',
        data,
    });
}
// 我的优惠券
export function api_user_coupon(params) {
    return request({
        url: `${OilManApi}/user/coupon`,
        method: 'get',
        params,
    });
}

// 发现
// 限时活动
export function api_activity_all(params) {
    return request({
        url: `${OilManApi}/activity/all`,
        method: 'get',
        params,
    });
}
// ios导航
export function api_discover(params) {
    return request({
        url: `${OilManApi}/discover`,
        method: 'get',
        params,
    });
}

// 微信相关
// 微信分享SDK
export function api_jssdk(params) {
    return request({
        url: `${OilManApi}/jssdk`,
        method: 'get',
        params,
    });
}
// 获取微信access_token
export function api_user_accessToken(data) {
    return request({
        url: `${OilManApi}/user/accessToken`,
        method: 'post',
        data,
    });
}
// 微信登录即注册
export function api_user_wxRegister(data) {
    return request({
        url: `${OilManApi}/user/wxRegister`,
        method: 'post',
        data,
    });
}

// 领取油卡
export function api_recharge_getOilCard(data) {
    return request({
        url: `${OilManApi}/recharge/getOilCard`,
        method: 'post',
        data,
    });
}
// 领取油卡运费计算
export function api_recharge_express(data) {
    return request({
        url: `${OilManApi}/recharge/express`,
        method: 'post',
        data,
    });
}

// 收货地址
// 收货地址列表
export function api_address_list(params) {
    return request({
        url: `${OilManApi}/address/list`,
        method: 'get',
        params,
    });
}
// 默认收货地址
export function api_address_selected(params) {
    return request({
        url: `${OilManApi}/address/selected`,
        method: 'get',
        params,
    });
}
// 新增收货地址
export function api_address_add(data) {
    return request({
        url: `${OilManApi}/address/add`,
        method: 'post',
        data,
    });
}
// 编辑收货地址
export function api_address_edit(data) {
    return request({
        url: `${OilManApi}/address/edit`,
        method: 'post',
        data,
    });
}
// 删除收货地址
export function api_address_del(data) {
    return request({
        url: `${OilManApi}/address/del`,
        method: 'post',
        data,
    });
}
// 全国行政区 
export function api_china_city(params) {
    return request({
        url: `${OilManApi}/china/city`,
        method: 'get',
        params,
    });
}

// 车辆
// 车辆列表
export function api_car_user(data) {
    return request({
        url: `${OilManApi}/car/user`,
        method: 'post',
        data,
    });
}
// 添加车辆
export function api_car_add(data) {
    return request({
        url: `${OilManApi}/car/add`,
        method: 'post',
        data,
    });
}
// 删除车辆
export function api_car_delete(data) {
    return request({
        url: `${OilManApi}/car/delete`,
        method: 'post',
        data,
    });
}
// 违章查询
export function api_car_lawbreaking(data) {
    return request({
        url: `${OilManApi}/car/lawbreaking`,
        method: 'post',
        data,
    });
}

// 商城
// 商品类型
export function api_shop_nav(data) {
    return request({
        url: `${OilManApi}/shop/nav`,
        method: 'post',
        data,
    });
}
// 商品列表
export function api_shop_list(data) {
    return request({
        url: `${OilManApi}/shop/list`,
        method: 'post',
        data,
    });
}
// 商品详情
export function api_shop_detail(params) {
    return request({
        url: `${OilManApi}/shop/detail/${params.id}`,
        method: 'get',
        // params,
    });
}
// 精选和热门
export function api_shop_selected(data) {
    return request({
        url: `${OilManApi}/shop/selected`,
        method: 'post',
        data,
    });
}
// 商品下单
export function api_shop_createOrder(data) {
    return request({
        url: `${OilManApi}/shop/createOrder`,
        method: 'post',
        data,
    });
}
// 订单再次支付
export function api_shop_orderPay(data) {
    return request({
        url: `${OilManApi}/shop/orderPay`,
        method: 'post',
        data,
    });
}
// 商城订单
export function api_shop_orderList(data) {
    return request({
        url: `${OilManApi}/shop/orderList`,
        method: 'post',
        data,
    });
}
// 订单详情
export function api_shop_orderDetail(data) {
    return request({
        url: `${OilManApi}/shop/orderDetail`,
        method: 'post',
        data,
    });
}
// 取消订单
export function api_shop_close(data) {
    return request({
        url: `${OilManApi}/shop/close`,
        method: 'post',
        data,
    });
}
// 确认收货
export function api_shop_finish(data) {
    return request({
        url: `${OilManApi}/shop/finish`,
        method: 'post',
        data,
    });
}
// 删除订单
export function api_shop_delete(data) {
    return request({
        url: `${OilManApi}/shop/delete`,
        method: 'post',
        data,
    });
}