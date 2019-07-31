<template>
	<div class="component_login">
		<div class="login_box">
			<!-- 头像 -->
			<div class="avatar_box"><img src="../assets/logo.png" alt="" /></div>
			<!-- 输入框 -->
			<!-- 登录 -->
			<el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
				<!-- 账号 -->
				<el-form-item prop="username" class="username_input">
					<el-input v-model="loginForm.username" placeholder="请输入账号" prefix-icon="iconfont icon-user"></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
				</el-form-item>
				<!-- 按钮区域 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {login_api} from "@/api"
export default {
	data() {
		return {
			loginForm: {
				username: 'admin',
				password: '123456'
			},
			// 表单验证规则
			loginFormRules: {
				// 验证用户名
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
				// 验证密码
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }]
			}
		};
	},
	methods: {
		reset() {
			// console.log(this.$refs.loginFormRef);
			this.$refs.loginFormRef.resetFields();
		},
		login() {
			this.$refs.loginFormRef.validate(async valid => {
				if (!valid) return this.$message.error('输入有误');
				// const { data: res } =  this.$http.post('login', this.loginForm);
				const { data: res}=await login_api(this.loginForm);
				if (res.meta.status != 200) {
					return this.$message.error('登录失败');
				}
				this.$message.success('登录成功');
				// 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
				//   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
				//   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
				window.sessionStorage.setItem('token', res.data.token);
				// 跳转到home页面
				this.$router.push('/home');
			});
		}
	}
};
</script>

<style lang="less" scoped>
.component_login {
	width: 100%;
	height: 100%;
	background-color: #2b4b6b;

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 10px;
		.avatar_box {
			height: 130px;
			width: 130px;
			border: 10px solid #fff;
			background-color: #eee;
			border-radius: 50%;
			overflow: hidden;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			box-shadow: 0 0 10px #ddd;
			img {
				width: 100%;
			}
		}
		.login_form {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 0 20px;
			box-sizing: border-box;
			.btns {
				display: flex;
				justify-content: center;
			}
		}
	}
}
</style>
