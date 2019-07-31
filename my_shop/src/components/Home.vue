<template>
	<div class="home_content">
		<el-container class="constent">
			<el-header class="header">
				<div class="logo">
					<img src="../images/heima.png" alt="">
				</div>
				<div class="logo_title">
					<span>电商后台管理系统</span>
				</div>
				<div class="out">退出</div>
			</el-header>
			<el-container>
				<el-aside :width="toggle_menu?'60px':'200px'" class="aside">
					<el-menu
						default-active="2"
						class="el-menu-vertical-demo"
						
						background-color="#333744"
						text-color="#fff"
						active-text-color="#ffd04b"
						unique-opened
						router
						:collapse="toggle_menu"
						:collapse-transition="false"
					>	
						<div class="toggit" @click="toggle">|||</div>
						<el-submenu :index="index+''" v-for='(item,index ) in menulist ' :key='item.id' >
							<template slot="title" class="first">
								<i :class=" iconObj[item.id] " class="title_icon"></i>
								<span>{{item.authName}}</span>
							</template>
							<el-menu-item-group>
								<el-menu-item @click="getIndex('/'+item2.path)" :index="'/'+item2.path" v-for='(item2 ) in item.children ' :key='item2.id' >
									<template slot="title" style="color: #55A532;">
										<i class="el-icon-menu"></i>
										<span>{{item2.authName}}</span>
									</template>
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
						
						
						
					</el-menu>
				</el-aside>
				<el-main class="main">
					<router-view/>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { asize_api } from '@/api';
export default {
	data() {
		return {
			menulist: [],
			iconObj:{
				'125':'iconfont icon-user' ,
				'103':'iconfont icon-tijikongjian' ,
				'101':'iconfont icon-shangpin' ,
				'102':'iconfont icon-danju' ,
				'145':'iconfont icon-baobiao' ,
			},
			toggle_menu:false
		}
	},
	methods: {
		async getMenuList() {
			//刷新home页面就请求侧边栏
			const { data: res } = await asize_api();
			if (res.meta.status != '200') return this.$message.error(res.meta.msg);
			this.menulist = res.data;
		},
		getIndex(index){  //存储侧边栏子栏请求地址
			window.sessionStorage.getItem(index)
		},
		toggle(){//切换关闭侧边栏
			this.toggle_menu=!this.toggle_menu
		}
	},
	created() {
		this.getMenuList(); //执行函数  刷新home页面就请求侧边栏
		
	}
};
</script>

<style lang="less" scoped>
.home_content {
	width: 100%;
	height: 100%;
	.constent {
		width: 100%;
		height: 100%;
		.header {
			display: flex;
			align-items:center;
			justify-content: space-between;
			background-color: #333744;
			.logo {
				// width: 40px;
				height: 100%;
				img {
					height: 100%;
				}
			}
			.logo_title {
				display: flex;
				margin-left: 20px;
				width: 85%;
				color: #fff;
				font-size: 20px;
				justify-content: flex-start;
			}
			.out {
				// width: 80px;
				font-size: 14px;
				text-align: center;
				border-radius: 5px;
				padding: 0 20px;
				height: 35px;
				line-height: 35px;
				color: #fff;
				background-color: #7f8c8d;
			}
		}
		.aside {
			background-color:#333744;
			.toggit {
				text-align: center;
				font-size: 10px;
				letter-spacing: 0.2em;
				height: 20px;
				line-height: 20px;
				cursor: pointer;
				color: #fff;
				background-color: #4A5064;
			}
		}
		.main {
			background-color:#eee;
		}
	}
}
.el-menu {
	border-right: none;
}
.title_icon {
	margin-right: 10px;
}


</style>
<style>
	.home_content .el-submenu .el-submenu__title:hover {
	    background-color: #eb3b5a!important;
	}
	.home_content .el-submenu .el-menu-item:hover {
		background-color: #eb3b5a!important;
	}
</style>
