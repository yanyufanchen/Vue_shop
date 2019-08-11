import axios from 'axios'
// 引入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置请求头
axios.interceptors.request.use(config => {
     //当进入request拦截器，表示发送了请求，我们就开启进度条
    NProgress.start()
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
})
//在response拦截器中，隐藏进度条
axios.interceptors.response.use(config =>{
    //当进入response拦截器，表示请求已经结束，我们就结束进度条
    NProgress.done()
    return config
  })
// 登录
export const login_api = (params) => {
    return axios.post('login', params)
}
// 侧边栏请求
export const asize_api = (params) => {
    return axios.get('menus', params)
}

// users用户表请求
export const users_api = (params) => {
    return axios.get("users", {
        params
    });
}
// users用户状态修改
export const usersType_api = (params) => {
    return axios.put(`users/${params.id}/state/${params.type}`);
}
// users用户添加
export const addUser_api = (params) => {
    return axios.post('users', params);
}
// users用户编辑
export const editUser_api = (params) => {
    return axios.put(`users/${params.id}`, {
        email: params.email,
        mobile: params.mobile
    });
}
// users删除用户
export const delete_api = (params) => {
    return axios.delete(`users/${params}`)
}
// rights权限列表list、tree获取
export const gitRights_api = (params) => {
    return axios.get(`rights/${params}`)
}
// rolesh角色列表获取
export const getRoles_api = (params) => {
    return axios.get('roles')
}

// roles指定权限删除
export const deleteRoles_api = (params) => {
    return axios.delete(`roles/${params.rolesId}/rights/${params.rightsId}`)
}
// roles角色的权限修改分配
export const amendRolesRights_api = (roleId, params) => {
    return axios.post(`roles/${roleId}/rights`, {
        rids: params
    })
}
// goods商品列表获取
export const getGoods_api = (params) => {
    return axios.get('goods', {
        params
    })
}

// categories商品分类列表获取
export const getCategoriesList_api = (params) => {
    return axios.get('categories', {
        params
    })
}
// categories商品分类添加
export const addCateName_api = (params) => {
    return axios.post('categories',params )
}
// categories分类参数获取
export const getattributes_api = (req) => {
    
    return axios.get(`categories/${req.id}/attributes`,
    {
      params: { sel: req.sel }
    } )
}

// params指定分类参数添加
export const addCateParams_api = (params) => {
    return axios.post(`categories/${params.id}/attributes`,{
        attr_name: params.attr_name,
        attr_sel: params.attr_sel,
    } )
}
// params指定分类参数添加
export const deleteCateParams_api = (params) => {
    return axios.delete(`categories/${params.id}/attributes/${params.attrid}`)
}
// params指定分类参数内的属性修改更新/编辑参数
export const changeParams_api = (params) => {
    
    return axios.put(`categories/${params.id}/attributes/${params.attrId}`,{
        attr_name: params.attr_name,
        attr_sel: params.attr_sel,
        attr_vals: params.attr_vals,
    } )
}
// good添加商品
export const addGoods_api = (params) => {
    return axios.post('goods',params)
}
// orders订单列表
export const ordersList_api = (params) => {
    return axios.get('orders',{params:params})
}
// orderspany订单列表
export const ordersPany_api = (params) => {
    return axios.get('/kuaidi/1106975712662')
}
// reports图表获取
export const reports_api = (params) => {
    return axios.get('reports/type/1')
}




