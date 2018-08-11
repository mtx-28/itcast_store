<template>
  <el-container class="container">
		<el-header class="header">
			<el-row>
				<el-col :span="4">
					<img src="@/assets/logo.png" alt="">
				</el-col>
				<el-col :span="18">
					<div class="title">电商后台管理系统</div>
				</el-col>
				<el-col :span="2">
					<div class="logout">
						<a href="#" @click.prevent="handleLogout">退出</a>
					</div>
				</el-col>
			</el-row>
		</el-header>
		<el-container>
			<!-- // 侧边栏 -->
			<el-aside class="aside" width="200px">
				<el-menu
          unique-opened
          router
          style="height: 100%"
          default-active="/users">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
			</el-aside>
			<!-- // 表格 -->
			<el-main class="main">
				<router-view></router-view>
			</el-main>
		</el-container>
  </el-container>
</template>

<script>
export default {
	beforeCreate() {
	// 判断是否登录token
	var token = sessionStorage.getItem('token');
	if(!token) {
    // 提示
    this.$message.warning('请先登录');
    // 没有token跳转页面
    this.$router.push('/login');
		}
	},
	methods: {
		handleLogout() {
			// 提示退出成功
			this.$message.success('退出成功');
			// 清空token
			sessionStorage.clear();
			// 跳转到登录页面
			this.$router.push('/login');
		}
	}
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
	padding: 0;
}
.header .title {
	text-align: center;
	color: #fff;
	font-size: 24px;
	line-height: 60px;
}
.header .logout {
	line-height: 60px;
}
.header .logout a {
	text-decoration: none;
	color: orange;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
  height: 100%;
}
</style>
	