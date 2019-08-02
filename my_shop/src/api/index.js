import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 设置请求头
axios.interceptors.request.use(config => {
        // console.log(config)
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 在最后必须 return config
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
        return axios.get("users", { params });
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
        return axios.put(`users/${params.id}`, { email: params.email, mobile: params.mobile });
    }
    // users删除用户
export const delete_api = (params) => {
        return axios.delete(`users/${params}`)
    }
    // rights权限列表获取
export const gitRights_api = (params) => {
        return axios.get(`rights/${params}`)
    }
    // roles权限列表获取
export const getRights_api = (params) => {
    return axios.get('roles')
}